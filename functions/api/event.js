const ALLOWED = new Set(['page_view','cta_click','diagnosis_start','diagnosis_complete','pricing_click','usage_interest']);
const PLANS = new Set(['starter','standard','pro']);

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ ok:false, error:'storage_unavailable' }, 503);
  if (!request.headers.get('content-type')?.includes('application/json')) return json({ok:false,error:'invalid_content_type'},415);
  let body;
  try { body = await request.json(); } catch { return json({ok:false,error:'invalid_json'},400); }
  const eventType = String(body.event_type || '');
  const sessionId = String(body.session_id || '').slice(0,80);
  const plan = body.plan ? String(body.plan) : null;
  const path = body.path ? String(body.path).slice(0,200) : null;
  if (!ALLOWED.has(eventType) || !sessionId) return json({ok:false,error:'invalid_event'},400);
  if (plan && !PLANS.has(plan)) return json({ok:false,error:'invalid_plan'},400);
  await env.DB.prepare('INSERT INTO events(event_type, session_id, plan, path) VALUES(?,?,?,?)')
    .bind(eventType, sessionId, plan, path).run();
  return json({ok:true});
}

export function onRequestGet() { return json({ok:false,error:'method_not_allowed'},405); }
function json(data,status=200){ return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}}); }
export const __test = { ALLOWED, PLANS };
