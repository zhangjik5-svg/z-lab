const ORIGIN_API = 'https://www.zhangjik.bbroot.com/api/jobs';
const CACHE_SECONDS = 120;
const ORIGIN_TIMEOUT_MS = 15_000;

export async function GET(request: Request) {
  const incoming = new URL(request.url);
  const origin = new URL(ORIGIN_API);
  origin.search = incoming.search;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ORIGIN_TIMEOUT_MS);
  try {
    const upstream = await fetch(origin, {
      headers: { Accept: 'application/json', 'User-Agent': 'ZLab-Edge/1.0' },
      signal: controller.signal,
    });
    if (!upstream.ok) throw new Error(`origin ${upstream.status}`);
    const body = await upstream.arrayBuffer();
    const baseHeaders = new Headers(upstream.headers);
    baseHeaders.set('Content-Type', 'application/json; charset=utf-8');
    baseHeaders.set('Cache-Control', `public, max-age=${CACHE_SECONDS}, stale-while-revalidate=7200`);
    baseHeaders.set('X-ZLab-Edge', 'origin');
    baseHeaders.set('X-Content-Type-Options', 'nosniff');
    baseHeaders.delete('Content-Encoding');
    baseHeaders.delete('Content-Length');
    baseHeaders.delete('Set-Cookie');
    return new Response(body, { status: 200, headers: baseHeaders });
  } catch {
    return Response.json({ error: '岗位服务暂时不可用' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  } finally {
    clearTimeout(timeout);
  }
}
