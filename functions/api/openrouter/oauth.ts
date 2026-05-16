type Env = Record<string, never>;

type PagesFunction<Env> = (context: {
  request: Request;
  env: Env;
}) => Response | Promise<Response>;

type OAuthRequest = {
  code?: string;
  codeVerifier?: string;
};

export const onRequestPost: PagesFunction<Env> = async ({ request }) => {
  let body: OAuthRequest;
  try {
    body = await request.json();
  } catch (error) {
    return json({ error: 'Invalid JSON request.' }, 400);
  }

  const code = body.code?.trim();
  const codeVerifier = body.codeVerifier?.trim();
  if (!code || !codeVerifier) {
    return json({ error: 'OpenRouter code and code verifier are required.' }, 400);
  }

  const response = await fetch('https://openrouter.ai/api/v1/auth/keys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      code_verifier: codeVerifier,
      code_challenge_method: 'S256',
    }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    return json({
      error: payload?.error || payload?.message || 'OpenRouter OAuth exchange failed.',
    }, response.status);
  }

  return json({ key: payload?.key || '' });
};

export const onRequest: PagesFunction<Env> = async () => {
  return json({ error: 'Use POST.' }, 405);
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
