import { requireClientKey } from '../../lib/client-token.js';
import { publicOpportunity } from '../../lib/db.js';
import { matchOpportunity } from '../../lib/matcher.js';
import { recordEvent } from '../../lib/events.js';
import { cleanText, json } from '../../lib/validation.js';

export async function onRequestGet({request,env}) {
  const k=await requireClientKey(request);
  if(!k)return json({ok:false,error:'TOKEN_REQUIRED'},400);
  const p=await env.DB.prepare('SELECT * FROM company_profiles WHERE client_key=?').bind(k).first();
  if(!p)return json({ok:false,error:'PROFILE_REQUIRED'},409);
  const r=await env.DB.prepare("SELECT * FROM opportunities ORDER BY COALESCE(announced_at,'') DESC,fetched_at DESC LIMIT 120").all();
  const limit=Math.min(30,Math.max(1,Number(new URL(request.url).searchParams.get('limit'))||10));
  const items=(r.results||[])
    .map(o=>({source:publicOpportunity(o),decision:matchOpportunity(p,o)}))
    .filter(x=>x.decision && x.decision.decision!=='NO-GO')
    .sort((a,b)=>b.decision.score-a.decision.score)
    .slice(0,limit);
  const sid=cleanText(request.headers.get('x-session-id'),80)||'anonymous';
  for(const x of items.slice(0,5)){
    try{await recordEvent(env.DB,{event_type:'recommended_opportunity_view',session_id:sid,client_key:k,entity_type:'opportunity',entity_id:x.source.id,metadata:{decision:x.decision.decision,score_band:Math.floor(x.decision.score/10)*10}});}catch{}
  }
  return json({ok:true,items});
}
