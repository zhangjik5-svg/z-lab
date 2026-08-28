const ORIGIN_VISIT_API = 'https://www.zhangjik.bbroot.com/api/visit';

async function proxyVisit(request: Request) {
  try {
    const upstream = await fetch(ORIGIN_VISIT_API, {
      method: request.method,
      headers: { Accept: 'application/json', 'User-Agent': 'ZLab-Edge/1.0' },
    });
    const body = await upstream.arrayBuffer();
    return new Response(body, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  } catch {
    return Response.json({ error: '计数服务暂时不可用' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}

export const GET = proxyVisit;
export const POST = proxyVisit;
