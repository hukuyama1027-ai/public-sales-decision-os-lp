export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extraHeaders,
    },
  });
}

export function cleanText(value, max = 200) {
  return String(value ?? '').replace(/\u0000/g, '').trim().slice(0, max);
}

export function validDate(value) {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export function safeHttpUrl(value) {
  const raw = cleanText(value, 1000);
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (!['http:', 'https:'].includes(u.protocol)) return null;
    return u.href;
  } catch {
    return null;
  }
}

export async function readJson(request, maxBytes = 12000) {
  const type = request.headers.get('content-type') || '';
  if (!type.includes('application/json')) throw Object.assign(new Error('INVALID_CONTENT_TYPE'), { status: 415 });
  const text = await request.text();
  if (text.length > maxBytes) throw Object.assign(new Error('BODY_TOO_LARGE'), { status: 413 });
  try { return JSON.parse(text); }
  catch { throw Object.assign(new Error('INVALID_JSON'), { status: 400 }); }
}
