import { and, eq } from 'drizzle-orm';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { getDb } from '@/db';
import { trackerStates } from '@/db/schema';

export const dynamic = 'force-dynamic';

type TrackerEntry = {
  id: string;
  title: string;
  company: string;
  city: string;
  batch: string;
  audience: string;
  deadline: string;
  applicationUrl: string;
  desc: string;
  tags: string[];
  status: 'saved' | 'applied' | 'interview' | 'offer' | 'closed';
  note: string;
  savedAt: string;
  updatedAt: string;
};

const jsonHeaders = {
  'Cache-Control': 'no-store, private',
  'Content-Type': 'application/json; charset=utf-8',
};
const allowedStatuses = new Set(['saved', 'applied', 'interview', 'offer', 'closed']);

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: jsonHeaders });
}

function textValue(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.slice(0, maxLength) : '';
}

function cleanEntry(value: unknown): TrackerEntry | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  const id = textValue(raw.id, 180).trim();
  if (!id) return null;
  const status = textValue(raw.status, 20);
  const now = new Date().toISOString();
  return {
    id,
    title: textValue(raw.title, 240),
    company: textValue(raw.company, 240),
    city: textValue(raw.city, 120),
    batch: textValue(raw.batch, 120),
    audience: textValue(raw.audience, 120),
    deadline: textValue(raw.deadline, 120),
    applicationUrl: textValue(raw.applicationUrl, 1600),
    desc: textValue(raw.desc, 4000),
    tags: Array.isArray(raw.tags) ? raw.tags.map(item => textValue(item, 80)).filter(Boolean).slice(0, 20) : [],
    status: allowedStatuses.has(status) ? status as TrackerEntry['status'] : 'saved',
    note: textValue(raw.note, 2000),
    savedAt: textValue(raw.savedAt, 50) || now,
    updatedAt: textValue(raw.updatedAt, 50) || now,
  };
}

async function ensureState(userId: string, email: string) {
  const db = getDb();
  const now = new Date().toISOString();
  await db.insert(trackerStates).values({
    userId,
    email,
    payload: '[]',
    revision: 0,
    createdAt: now,
    updatedAt: now,
  }).onConflictDoNothing();

  return db.select().from(trackerStates).where(eq(trackerStates.userId, userId)).get();
}

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return json({ authenticated: false, error: 'sign_in_required' }, 401);

  const state = await ensureState(user.userId, user.email);
  let entries: TrackerEntry[] = [];
  try {
    const parsed = JSON.parse(state?.payload || '[]');
    if (Array.isArray(parsed)) entries = parsed.map(cleanEntry).filter((entry): entry is TrackerEntry => Boolean(entry));
  } catch {
    entries = [];
  }

  return json({ authenticated: true, entries, revision: state?.revision ?? 0, updatedAt: state?.updatedAt ?? null });
}

export async function PUT(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return json({ authenticated: false, error: 'sign_in_required' }, 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const raw = body && typeof body === 'object' ? body as Record<string, unknown> : {};
  if (!Array.isArray(raw.entries) || raw.entries.length > 500) return json({ error: 'invalid_entries' }, 400);
  const entries = raw.entries.map(cleanEntry).filter((entry): entry is TrackerEntry => Boolean(entry));
  const payload = JSON.stringify(entries);
  if (new TextEncoder().encode(payload).byteLength > 1_500_000) return json({ error: 'payload_too_large' }, 413);

  const baseRevision = Number.isInteger(raw.revision) ? Number(raw.revision) : -1;
  const state = await ensureState(user.userId, user.email);
  if (!state) return json({ error: 'state_unavailable' }, 503);
  if (baseRevision !== state.revision) {
    let serverEntries: TrackerEntry[] = [];
    try {
      const parsed = JSON.parse(state.payload);
      if (Array.isArray(parsed)) serverEntries = parsed.map(cleanEntry).filter((entry): entry is TrackerEntry => Boolean(entry));
    } catch {}
    return json({ error: 'revision_conflict', entries: serverEntries, revision: state.revision }, 409);
  }

  const now = new Date().toISOString();
  const updated = await getDb().update(trackerStates).set({
    email: user.email,
    payload,
    revision: state.revision + 1,
    updatedAt: now,
  }).where(and(eq(trackerStates.userId, user.userId), eq(trackerStates.revision, state.revision))).returning({ revision: trackerStates.revision }).get();

  if (!updated) return json({ error: 'revision_conflict' }, 409);
  return json({ ok: true, revision: updated.revision, updatedAt: now });
}
