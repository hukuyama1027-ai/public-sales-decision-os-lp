const EMP = new Set(['1-4','5-9','10-30','31-99','100+','']);
const EXP = new Set(['none','considering','once_or_more']);
const QUAL = new Set(['yes','no','unknown']);
const PRICE = new Set(['9800','19800','29800','undecided']);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ ok:false, error:'storage_unavailable' }, 503);
  if (!request.headers.get('content-type')?.includes('application/json')) return json({ok:false,error:'invalid_content_type'},415);
  let b;
  try { b = await request.json(); } catch { return json({ok:false,error:'invalid_json'},400); }
  if (String(b.website || '').trim()) return json({ok:true});
  const v = {
    company_name: clean(b.company_name,120), industry: clean(b.industry,80), employee_scale: clean(b.employee_scale,20),
    services: clean(b.services,500), region: clean(b.region,120), public_experience: clean(b.public_experience,30),
    unified_qualification: clean(b.unified_qualification,20), email: clean(b.email,254).toLowerCase(),
    price_interest: clean(b.price_interest,20), usage_interest: b.usage_interest === true, consent: b.consent === true
  };
  if (!v.company_name || !v.industry || v.services.length < 2 || !v.region || !EMAIL.test(v.email)) return json({ok:false,error:'required_fields'},400);
  if (!EMP.has(v.employee_scale) || !EXP.has(v.public_experience) || !QUAL.has(v.unified_qualification) || !PRICE.has(v.price_interest)) return json({ok:false,error:'invalid_option'},400);
  if (!v.consent) return json({ok:false,error:'consent_required'},400);
  const consentAt = new Date().toISOString();
  const result = await env.DB.prepare(`INSERT INTO leads(company_name,industry,employee_scale,services,region,public_experience,unified_qualification,email,price_interest,usage_interest,consent_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)`)
    .bind(v.company_name,v.industry,v.employee_scale||null,v.services,v.region,v.public_experience,v.unified_qualification,v.email,v.price_interest,v.usage_interest?1:0,consentAt).run();
  return json({ok:true,id:result.meta?.last_row_id ?? null});
}
export function onRequestGet(){ return json({ok:false,error:'method_not_allowed'},405); }
function clean(value,max){ return String(value ?? '').trim().slice(0,max); }
function json(data,status=200){ return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}}); }
export const __test = { EMP, EXP, QUAL, PRICE, EMAIL, clean };
