import { clearCurrentSession } from '@/app/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store', 'Set-Cookie': await clearCurrentSession() } });
}
