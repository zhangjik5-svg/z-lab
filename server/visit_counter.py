#!/usr/bin/env python3
"""Minimal same-origin visit counter for Z Lab."""

from __future__ import annotations

import json
import os
import sqlite3
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


DB_PATH = Path(os.environ.get("ZLAB_COUNTER_DB", "/var/lib/zlab-counter/visits.db"))
HOST = os.environ.get("ZLAB_COUNTER_HOST", "127.0.0.1")
PORT = int(os.environ.get("ZLAB_COUNTER_PORT", "8766"))


def connect() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH, timeout=5)
    connection.execute("PRAGMA busy_timeout = 5000")
    return connection


def initialize() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with connect() as connection:
        connection.execute(
            "CREATE TABLE IF NOT EXISTS counters (key TEXT PRIMARY KEY, value INTEGER NOT NULL CHECK(value >= 0))"
        )
        connection.execute(
            "INSERT OR IGNORE INTO counters(key, value) VALUES (?, ?)",
            ("visits", 0),
        )
        connection.execute("PRAGMA optimize")


def read_count() -> int:
    with connect() as connection:
        row = connection.execute(
            "SELECT value FROM counters WHERE key = ?", ("visits",)
        ).fetchone()
    return int(row[0] if row else 0)


def increment_count() -> int:
    with connect() as connection:
        connection.execute("BEGIN IMMEDIATE")
        connection.execute(
            "UPDATE counters SET value = value + 1 WHERE key = ?", ("visits",)
        )
        row = connection.execute(
            "SELECT value FROM counters WHERE key = ?", ("visits",)
        ).fetchone()
        connection.commit()
    return int(row[0])


class CounterHandler(BaseHTTPRequestHandler):
    server_version = "ZLabCounter/1.0"

    def send_json(self, status: int, payload: dict[str, int | str]) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:  # noqa: N802
        if self.path != "/api/visit":
            self.send_json(404, {"error": "not_found"})
            return
        self.send_json(200, {"count": read_count()})

    def do_POST(self) -> None:  # noqa: N802
        if self.path != "/api/visit":
            self.send_json(404, {"error": "not_found"})
            return
        self.send_json(200, {"count": increment_count()})

    def log_message(self, message: str, *args: object) -> None:
        print(f"{self.address_string()} - {message % args}", flush=True)


if __name__ == "__main__":
    initialize()
    server = ThreadingHTTPServer((HOST, PORT), CounterHandler)
    print(f"Z Lab visit counter listening on {HOST}:{PORT}", flush=True)
    server.serve_forever()
