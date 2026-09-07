import { registerEmailUser } from '@/app/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: unknown; password?: unknown };
    const result = await registerEmailUser(String(body.email ?? ''), String(body.password ?? ''));
    return Response.json({ authenticated: true, user: { id: result.user.userId, email: result.user.email, displayName: result.user.displayName } }, { headers: { 'Cache-Control': 'no-store', 'Set-Cookie': result.cookie } });
  } catch (error) {
    const message = error instanceof Error ? error.message : '注册失败，请稍后再试';
    return Response.json({ error: message }, { status: message.includes('已经注册') ? 409 : 400, headers: { 'Cache-Control': 'no-store' } });
  }
}
