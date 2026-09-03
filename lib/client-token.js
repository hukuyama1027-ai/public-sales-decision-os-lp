export function getClientToken(request) {
  const token = request.headers.get('x-client-token') || '';
  if (!/^[A-Za-z0-9_-]{40,100}$/.test(token)) return null;
  return token;
}

export async function hashClientToken(token) {
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function requireClientKey(request) {
  const token = getClientToken(request);
  if (!token) return null;
  return hashClientToken(token);
}
