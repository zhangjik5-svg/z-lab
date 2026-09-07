import { and, eq, gt } from 'drizzle-orm';
import { cookies, headers } from 'next/headers';
import { getDb } from '@/db';
import { sessions, trackerStates, users } from '@/db/schema';

const SESSION_COOKIE = 'zlab_session';
const SESSION_DAYS = 30;
const PBKDF2_ITERATIONS = 120_000;
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;

export type AppUser = {
  userId: string;
  displayName: string;
  email: string;
  fullName: string | null;
};

function displayName(email: string) {
  return email.split('@', 1)[0].trim().slice(0, 24) || 'Z Lab 用户';
}

function encode(value: Uint8Array) {
  let binary = '';
  for (const byte of value) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decode(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(normalized);
  return Uint8Array.from(binary, character => character.charCodeAt(0));
}

async function derivePassword(password: string, salt: Uint8Array, iterations = PBKDF2_ITERATIONS) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, key, 256);
  return encode(new Uint8Array(bits));
}

async function hashToken(token: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return encode(new Uint8Array(digest));
}

function sameSecret(left: string, right: string) {
  const a = decode(left);
  const b = decode(right);
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}

function userPayload(user: { id: string; email: string }): AppUser {
  return { userId: user.id, email: user.email, displayName: displayName(user.email), fullName: null };
}

function chatGPTUserFromHeaders(requestHeaders: Headers): AppUser | null {
  const userId = requestHeaders.get('oai-authenticated-user-id');
  const email = requestHeaders.get('oai-authenticated-user-email');
  if (!userId || !email) return null;
  const encodedName = requestHeaders.get('oai-authenticated-user-full-name');
  const fullName = encodedName && requestHeaders.get('oai-authenticated-user-full-name-encoding') === 'percent-encoded-utf-8'
    ? safeDecodeURIComponent(encodedName)
    : null;
  return { userId, email, fullName, displayName: fullName ?? email };
}

function safeDecodeURIComponent(value: string) {
  try { return decodeURIComponent(value); } catch { return null; }
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const requestHeaders = await headers();
  const chatGPTUser = chatGPTUserFromHeaders(requestHeaders);
  if (chatGPTUser) return chatGPTUser;

  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const tokenHash = await hashToken(token);
  const now = Math.floor(Date.now() / 1000);
  const row = await getDb().select({ userId: users.id, email: users.email })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, now)))
    .get();
  if (!row) return null;
  await getDb().update(sessions).set({ lastSeenAt: now }).where(eq(sessions.tokenHash, tokenHash)).run();
  return userPayload(row);
}

export function validCredentials(email: string, password: string) {
  return EMAIL_RE.test(email) && password.length >= 8 && password.length <= 128;
}

export async function registerEmailUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!validCredentials(normalizedEmail, password)) throw new Error('请输入有效邮箱，密码需为 8–128 个字符');
  const db = getDb();
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, normalizedEmail)).get();
  if (existing) throw new Error('该邮箱已经注册，请直接登录');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const timestamp = new Date().toISOString();
  const userId = crypto.randomUUID().replaceAll('-', '');
  await db.insert(users).values({ id: userId, email: normalizedEmail, passwordHash: await derivePassword(password, salt), salt: encode(salt), iterations: PBKDF2_ITERATIONS, createdAt: timestamp, updatedAt: timestamp }).run();
  await db.insert(trackerStates).values({ userId, email: normalizedEmail, payload: '[]', revision: 0, createdAt: timestamp, updatedAt: timestamp }).run();
  return { user: userPayload({ id: userId, email: normalizedEmail }), cookie: await issueSession(userId) };
}

export async function loginEmailUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!validCredentials(normalizedEmail, password)) throw new Error('邮箱或密码不正确');
  const row = await getDb().select().from(users).where(eq(users.email, normalizedEmail)).get();
  if (!row || !sameSecret(await derivePassword(password, decode(row.salt), row.iterations), row.passwordHash)) throw new Error('邮箱或密码不正确');
  return { user: userPayload(row), cookie: await issueSession(row.id) };
}

async function issueSession(userId: string) {
  const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
  const token = encode(tokenBytes);
  const timestamp = Math.floor(Date.now() / 1000);
  await getDb().insert(sessions).values({ tokenHash: await hashToken(token), userId, expiresAt: timestamp + SESSION_DAYS * 86400, createdAt: timestamp, lastSeenAt: timestamp }).run();
  return `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${SESSION_DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`;
}

export async function clearCurrentSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) await getDb().delete(sessions).where(eq(sessions.tokenHash, await hashToken(token))).run();
  return `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}
