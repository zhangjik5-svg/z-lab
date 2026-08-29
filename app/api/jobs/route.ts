import { eq, lt } from 'drizzle-orm';
import { getDb } from '@/db';
import { jobQueryCache } from '@/db/schema';

const ORIGIN_API = 'https://www.zhangjik.bbroot.com/api/jobs';
const BROWSER_CACHE_SECONDS = 120;
const QUERY_CACHE_MS = 2 * 60 * 60 * 1000;
const ORIGIN_TIMEOUT_MS = 18_000;

type CachedQuery = {
  payload: string;
  cachedAt: number;
};

function queryKey(url: URL) {
  const entries = [...url.searchParams.entries()].sort(([aKey, aValue], [bKey, bValue]) =>
    aKey === bKey ? aValue.localeCompare(bValue) : aKey.localeCompare(bKey),
  );
  return new URLSearchParams(entries).toString() || '_default';
}

function responseHeaders(source: 'origin' | 'cloud-cache' | 'stale-cloud-cache') {
  return {
    'Cache-Control': `public, max-age=${BROWSER_CACHE_SECONDS}, stale-while-revalidate=7200`,
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'X-ZLab-Edge': source,
  };
}

async function readCache(key: string): Promise<CachedQuery | null> {
  try {
    const row = await getDb().select({ payload: jobQueryCache.payload, cachedAt: jobQueryCache.cachedAt })
      .from(jobQueryCache).where(eq(jobQueryCache.queryKey, key)).get();
    return row ?? null;
  } catch {
    return null;
  }
}

async function writeCache(key: string, payload: string) {
  try {
    const cachedAt = Date.now();
    const db = getDb();
    await db.insert(jobQueryCache).values({ queryKey: key, payload, cachedAt })
      .onConflictDoUpdate({ target: jobQueryCache.queryKey, set: { payload, cachedAt } });
    await db.delete(jobQueryCache).where(lt(jobQueryCache.cachedAt, cachedAt - 14 * 24 * 60 * 60 * 1000));
  } catch {
    // The live response is still usable if cache persistence is temporarily unavailable.
  }
}

export async function GET(request: Request) {
  const incoming = new URL(request.url);
  const key = queryKey(incoming);
  const cached = await readCache(key);
  if (cached && Date.now() - cached.cachedAt < QUERY_CACHE_MS) {
    return new Response(cached.payload, { status: 200, headers: responseHeaders('cloud-cache') });
  }

  const origin = new URL(ORIGIN_API);
  origin.search = incoming.search;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ORIGIN_TIMEOUT_MS);
  try {
    const upstream = await fetch(origin, {
      headers: { Accept: 'application/json', 'User-Agent': 'ZLab-Edge/2.0' },
      signal: controller.signal,
    });
    if (!upstream.ok) throw new Error(`origin ${upstream.status}`);
    const payload = await upstream.text();
    JSON.parse(payload);
    await writeCache(key, payload);
    return new Response(payload, { status: 200, headers: responseHeaders('origin') });
  } catch {
    if (cached) {
      return new Response(cached.payload, { status: 200, headers: responseHeaders('stale-cloud-cache') });
    }
    return Response.json(
      { error: '岗位服务暂时不可用' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  } finally {
    clearTimeout(timeout);
  }
}
