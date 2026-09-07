import { loginEmailUser } from '@/app/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: unknown; password?: unknown };
    const result = await loginEmailUser(String(body.email ?? ''), String(body.password ?? ''));
    return Response.json({ authenticated: true, user: { id: result.user.userId, email: result.user.email, displayName: result.user.displayName } }, { headers: { 'Cache-Control': 'no-store', 'Set-Cookie': result.cookie } });
  } catch (error) {
    const message = error instanceof Error ? error.message : '登录失败，请稍后再试';
    return Response.json({ error: message }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }
}
