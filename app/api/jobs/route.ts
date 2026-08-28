const ORIGIN_API = 'https://www.zhangjik.bbroot.com/api/jobs';
const FRESH_SECONDS = 120;
const BACKUP_SECONDS = 86400;

type EdgeCacheStorage = CacheStorage & { default: Cache };

function cacheRequest(requestUrl: URL, tier: 'fresh' | 'backup') {
  const key = new URL(requestUrl);
  key.searchParams.set('__zlab_edge_cache', tier);
  return new Request(key.toString(), { method: 'GET' });
}

function withCacheHeaders(response: Response, seconds: number, state: string) {
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', `public, max-age=${seconds}, stale-while-revalidate=7200`);
  headers.set('X-ZLab-Edge', state);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.delete('Set-Cookie');
  return new Response(response.body, { status: response.status, headers });
}

export async function GET(request: Request) {
  const incoming = new URL(request.url);
  incoming.searchParams.delete('__zlab_edge_cache');
  const edgeCache = (caches as EdgeCacheStorage).default;
  const freshKey = cacheRequest(incoming, 'fresh');
  const backupKey = cacheRequest(incoming, 'backup');
  const fresh = await edgeCache.match(freshKey);
  if (fresh) return withCacheHeaders(fresh, FRESH_SECONDS, 'fresh-hit');

  const origin = new URL(ORIGIN_API);
  origin.search = incoming.search;
  try {
    const upstream = await fetch(origin, {
      headers: { Accept: 'application/json', 'User-Agent': 'ZLab-Edge/1.0' },
    });
    if (!upstream.ok) throw new Error(`origin ${upstream.status}`);
    const body = await upstream.arrayBuffer();
    const baseHeaders = new Headers(upstream.headers);
    baseHeaders.set('Content-Type', 'application/json; charset=utf-8');
    baseHeaders.delete('Content-Encoding');
    baseHeaders.delete('Content-Length');
    baseHeaders.delete('Set-Cookie');
    const freshResponse = new Response(body, { status: 200, headers: baseHeaders });
    const backupResponse = freshResponse.clone();
    const freshStored = withCacheHeaders(freshResponse.clone(), FRESH_SECONDS, 'origin');
    const backupStored = withCacheHeaders(backupResponse, BACKUP_SECONDS, 'backup');
    await Promise.all([edgeCache.put(freshKey, freshStored), edgeCache.put(backupKey, backupStored)]);
    return withCacheHeaders(freshResponse, FRESH_SECONDS, 'origin');
  } catch {
    const backup = await edgeCache.match(backupKey);
    if (backup) return withCacheHeaders(backup, FRESH_SECONDS, 'backup-hit');
    return Response.json({ error: '岗位服务暂时不可用' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
