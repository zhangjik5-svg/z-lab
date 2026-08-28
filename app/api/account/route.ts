import { getChatGPTUser } from '@/app/chatgpt-auth';

export const dynamic = 'force-dynamic';

const jsonHeaders = {
  'Cache-Control': 'no-store, private',
  'Content-Type': 'application/json; charset=utf-8',
};

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) {
    return Response.json({ authenticated: false }, { headers: jsonHeaders });
  }

  return Response.json({
    authenticated: true,
    user: {
      id: user.userId,
      email: user.email,
      displayName: user.displayName,
    },
  }, { headers: jsonHeaders });
}
