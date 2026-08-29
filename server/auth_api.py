#!/usr/bin/env python3
"""Small self-hosted account and tracker API for Z Lab."""

from __future__ import annotations

import hashlib
import hmac
import json
import os
import re
import secrets
import sqlite3
import time
import uuid
from collections import defaultdict, deque
from contextlib import closing
from http import HTTPStatus
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse


HOST = os.environ.get("ZLAB_AUTH_HOST", "127.0.0.1")
PORT = int(os.environ.get("ZLAB_AUTH_PORT", "8768"))
DB_PATH = os.environ.get("ZLAB_AUTH_DB", "/var/lib/zlab-auth/zlab.db")
SESSION_DAYS = 30
SESSION_COOKIE = "zlab_session"
PBKDF2_ITERATIONS = 420_000
MAX_BODY = 1_500_000
MAX_ENTRIES = 500
ALLOWED_ORIGINS = {
    "https://zhangjik.bbroot.com",
    "https://www.zhangjik.bbroot.com",
    "http://127.0.0.1:4173",
    "http://localhost:4173",
}
EMAIL_RE = re.compile(r"^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$")
RATE_BUCKETS: dict[str, deque[float]] = defaultdict(deque)


def now() -> int:
    return int(time.time())


def connect() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH, timeout=10)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys=ON")
    connection.execute("PRAGMA journal_mode=WAL")
    connection.execute("PRAGMA busy_timeout=5000")
    return connection


def initialize() -> None:
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with closing(connect()) as db, db:
        db.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                password_hash BLOB NOT NULL,
                salt BLOB NOT NULL,
                iterations INTEGER NOT NULL,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS sessions (
                token_hash TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                expires_at INTEGER NOT NULL,
                created_at INTEGER NOT NULL,
                last_seen_at INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS sessions_user_id ON sessions(user_id);
            CREATE INDEX IF NOT EXISTS sessions_expires_at ON sessions(expires_at);
            CREATE TABLE IF NOT EXISTS tracker_states (
                user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
                payload TEXT NOT NULL DEFAULT '[]',
                revision INTEGER NOT NULL DEFAULT 0,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL
            );
            """
        )
        db.execute("DELETE FROM sessions WHERE expires_at <= ?", (now(),))


def hash_password(password: str, salt: bytes, iterations: int = PBKDF2_ITERATIONS) -> bytes:
    return hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations, dklen=32)


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def display_name(email: str) -> str:
    local = email.split("@", 1)[0].strip()
    return local[:24] or "Z Lab 用户"


def clean_entry(value: object) -> dict[str, object] | None:
    if not isinstance(value, dict) or not value.get("id"):
        return None
    allowed = {
        "id", "title", "company", "companyType", "city", "batch", "audience",
        "industry", "updated", "deadline", "tags", "desc", "applicationUrl",
        "sourceId", "sourceName", "color", "status", "notes", "savedAt", "updatedAt",
    }
    result: dict[str, object] = {}
    for key in allowed:
        item = value.get(key)
        if isinstance(item, str):
            result[key] = item[:5000] if key in {"desc", "notes"} else item[:1000]
        elif key == "tags" and isinstance(item, list):
            result[key] = [str(tag)[:80] for tag in item[:20]]
    result["id"] = str(value["id"])[:180]
    return result


class ApiHandler(BaseHTTPRequestHandler):
    server_version = "ZLabAuth/1.0"

    def log_message(self, fmt: str, *args: object) -> None:
        print(f"{self.address_string()} - {fmt % args}", flush=True)

    def send_json(self, status: int, payload: object, cookie: str | None = None) -> None:
        body = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "same-origin")
        if cookie:
            self.send_header("Set-Cookie", cookie)
        self.end_headers()
        self.wfile.write(body)

    def read_json(self) -> dict[str, object]:
        content_type = self.headers.get("Content-Type", "").split(";", 1)[0].strip().lower()
        if content_type != "application/json":
            raise ValueError("请求格式必须为 JSON")
        length = int(self.headers.get("Content-Length", "0") or 0)
        if length <= 0 or length > MAX_BODY:
            raise ValueError("请求内容过大或为空")
        value = json.loads(self.rfile.read(length))
        if not isinstance(value, dict):
            raise ValueError("请求内容无效")
        return value

    def check_origin(self) -> bool:
        origin = self.headers.get("Origin")
        if origin and origin not in ALLOWED_ORIGINS:
            self.send_json(HTTPStatus.FORBIDDEN, {"error": "请求来源无效"})
            return False
        return True

    def client_key(self, action: str) -> str:
        forwarded = self.headers.get("X-Forwarded-For", "").split(",", 1)[0].strip()
        return f"{action}:{forwarded or self.client_address[0]}"

    def rate_allowed(self, action: str, limit: int = 12, window: int = 900) -> bool:
        bucket = RATE_BUCKETS[self.client_key(action)]
        cutoff = time.time() - window
        while bucket and bucket[0] < cutoff:
            bucket.popleft()
        if len(bucket) >= limit:
            self.send_json(HTTPStatus.TOO_MANY_REQUESTS, {"error": "尝试次数过多，请稍后再试"})
            return False
        bucket.append(time.time())
        return True

    def session_token(self) -> str | None:
        raw = self.headers.get("Cookie", "")
        if not raw:
            return None
        cookie = SimpleCookie()
        try:
            cookie.load(raw)
        except Exception:
            return None
        morsel = cookie.get(SESSION_COOKIE)
        return morsel.value if morsel else None

    def current_user(self) -> sqlite3.Row | None:
        token = self.session_token()
        if not token:
            return None
        with closing(connect()) as db, db:
            row = db.execute(
                """SELECT users.id, users.email, sessions.expires_at
                   FROM sessions JOIN users ON users.id = sessions.user_id
                   WHERE sessions.token_hash = ?""",
                (token_hash(token),),
            ).fetchone()
            if not row or row["expires_at"] <= now():
                if row:
                    db.execute("DELETE FROM sessions WHERE token_hash = ?", (token_hash(token),))
                return None
            db.execute(
                "UPDATE sessions SET last_seen_at = ? WHERE token_hash = ?",
                (now(), token_hash(token)),
            )
            return row

    def issue_session(self, user_id: str) -> str:
        token = secrets.token_urlsafe(32)
        timestamp = now()
        with closing(connect()) as db, db:
            db.execute(
                "INSERT INTO sessions(token_hash,user_id,expires_at,created_at,last_seen_at) VALUES(?,?,?,?,?)",
                (token_hash(token), user_id, timestamp + SESSION_DAYS * 86400, timestamp, timestamp),
            )
        return f"{SESSION_COOKIE}={token}; Path=/; Max-Age={SESSION_DAYS * 86400}; HttpOnly; Secure; SameSite=Lax"

    def user_payload(self, row: sqlite3.Row) -> dict[str, str]:
        return {"id": row["id"], "email": row["email"], "displayName": display_name(row["email"])}

    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path == "/api/health":
            self.send_json(HTTPStatus.OK, {"ok": True, "service": "zlab-auth"})
            return
        if path == "/api/account":
            user = self.current_user()
            self.send_json(HTTPStatus.OK, {"authenticated": bool(user), "user": self.user_payload(user) if user else None})
            return
        if path == "/api/tracker":
            user = self.current_user()
            if not user:
                self.send_json(HTTPStatus.UNAUTHORIZED, {"authenticated": False, "error": "请先登录"})
                return
            with closing(connect()) as db, db:
                state = db.execute("SELECT payload,revision,updated_at FROM tracker_states WHERE user_id=?", (user["id"],)).fetchone()
            self.send_json(HTTPStatus.OK, {
                "authenticated": True,
                "entries": json.loads(state["payload"]) if state else [],
                "revision": int(state["revision"]) if state else 0,
                "updatedAt": int(state["updated_at"]) if state else None,
            })
            return
        self.send_json(HTTPStatus.NOT_FOUND, {"error": "接口不存在"})

    def do_POST(self) -> None:
        if not self.check_origin():
            return
        path = urlparse(self.path).path
        if path == "/api/auth/logout":
            token = self.session_token()
            if token:
                with closing(connect()) as db, db:
                    db.execute("DELETE FROM sessions WHERE token_hash=?", (token_hash(token),))
            self.send_json(HTTPStatus.OK, {"ok": True}, f"{SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax")
            return
        if path not in {"/api/auth/register", "/api/auth/login"}:
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "接口不存在"})
            return
        if not self.rate_allowed(path):
            return
        try:
            payload = self.read_json()
        except (ValueError, json.JSONDecodeError) as error:
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(error)})
            return
        email = str(payload.get("email", "")).strip().lower()
        password = str(payload.get("password", ""))
        if len(email) > 254 or not EMAIL_RE.match(email):
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": "请输入有效邮箱地址"})
            return
        if not 8 <= len(password) <= 128:
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": "密码需为 8–128 个字符"})
            return
        if path.endswith("register"):
            salt = secrets.token_bytes(16)
            timestamp = now()
            user_id = uuid.uuid4().hex
            try:
                with closing(connect()) as db, db:
                    db.execute(
                        "INSERT INTO users(id,email,password_hash,salt,iterations,created_at,updated_at) VALUES(?,?,?,?,?,?,?)",
                        (user_id, email, hash_password(password, salt), salt, PBKDF2_ITERATIONS, timestamp, timestamp),
                    )
                    db.execute(
                        "INSERT INTO tracker_states(user_id,payload,revision,created_at,updated_at) VALUES(?,?,?,?,?)",
                        (user_id, "[]", 0, timestamp, timestamp),
                    )
            except sqlite3.IntegrityError:
                self.send_json(HTTPStatus.CONFLICT, {"error": "该邮箱已经注册，请直接登录"})
                return
            user = {"id": user_id, "email": email, "displayName": display_name(email)}
        else:
            with closing(connect()) as db, db:
                row = db.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()
            if not row or not hmac.compare_digest(hash_password(password, row["salt"], row["iterations"]), row["password_hash"]):
                self.send_json(HTTPStatus.UNAUTHORIZED, {"error": "邮箱或密码不正确"})
                return
            user_id = row["id"]
            user = {"id": row["id"], "email": row["email"], "displayName": display_name(row["email"])}
        self.send_json(HTTPStatus.OK, {"authenticated": True, "user": user}, self.issue_session(user_id))

    def do_PUT(self) -> None:
        if not self.check_origin():
            return
        if urlparse(self.path).path != "/api/tracker":
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "接口不存在"})
            return
        user = self.current_user()
        if not user:
            self.send_json(HTTPStatus.UNAUTHORIZED, {"authenticated": False, "error": "登录状态已失效，请重新登录"})
            return
        try:
            payload = self.read_json()
            revision = int(payload.get("revision", 0))
            raw_entries = payload.get("entries", [])
            if not isinstance(raw_entries, list) or len(raw_entries) > MAX_ENTRIES:
                raise ValueError("求职记录数量超出限制")
            entries = [entry for value in raw_entries if (entry := clean_entry(value)) is not None]
        except (ValueError, TypeError, json.JSONDecodeError) as error:
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(error)})
            return
        timestamp = now()
        with closing(connect()) as db, db:
            db.execute("BEGIN IMMEDIATE")
            state = db.execute("SELECT payload,revision FROM tracker_states WHERE user_id=?", (user["id"],)).fetchone()
            current_revision = int(state["revision"]) if state else 0
            if revision != current_revision:
                db.rollback()
                self.send_json(HTTPStatus.CONFLICT, {
                    "error": "云端记录已更新",
                    "entries": json.loads(state["payload"]) if state else [],
                    "revision": current_revision,
                })
                return
            next_revision = current_revision + 1
            encoded = json.dumps(entries, ensure_ascii=False, separators=(",", ":"))
            db.execute(
                """INSERT INTO tracker_states(user_id,payload,revision,created_at,updated_at)
                   VALUES(?,?,?,?,?)
                   ON CONFLICT(user_id) DO UPDATE SET payload=excluded.payload,revision=excluded.revision,updated_at=excluded.updated_at""",
                (user["id"], encoded, next_revision, timestamp, timestamp),
            )
            db.commit()
        self.send_json(HTTPStatus.OK, {"ok": True, "revision": next_revision, "updatedAt": timestamp})


if __name__ == "__main__":
    initialize()
    print(f"Z Lab auth API listening on {HOST}:{PORT}", flush=True)
    ThreadingHTTPServer((HOST, PORT), ApiHandler).serve_forever()
