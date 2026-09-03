import { publicOpportunity } from '../../../lib/db.js';
import { requireClientKey } from '../../../lib/client-token.js';
import { matchOpportunity } from '../../../lib/matcher.js';
import { nextActions } from '../../../lib/next-actions.js';
import { recordEvent } from '../../../lib/events.js';
import { cleanText, json } from '../../../lib/validation.js';

export async function onRequestGet({request,env,params}){
  if(!env.DB)return json({ok:false,error:'DB_UNAVAILABLE'},503);
  const id=cleanText(params.id,128);const row=await env.DB.prepare('SELECT * FROM opportunities WHERE id=?').bind(id).first();if(!row)return json({ok:false,error:'NOT_FOUND'},404);
  const clientKey=await requireClientKey(request);let profile=null,decision=null;if(clientKey){profile=await env.DB.prepare('SELECT * FROM company_profiles WHERE client_key=?').bind(clientKey).first();if(profile)decision=matchOpportunity(profile,row);try{await env.DB.prepare('INSERT INTO recent_views(client_key,opportunity_id,viewed_at) VALUES(?,?,?) ON CONFLICT(client_key,opportunity_id) DO UPDATE SET viewed_at=excluded.viewed_at').bind(clientKey,id,new Date().toISOString()).run();}catch{}}
  const actions=nextActions(row,profile),sessionId=cleanText(request.headers.get('x-session-id'),80)||'anonymous';try{await recordEvent(env.DB,{event_type:'opportunity_detail_view',session_id:sessionId,client_key:clientKey,entity_type:'opportunity',entity_id:id,metadata:{decision:decision?.decision||'none'}});}catch{}
  return json({ok:true,source:publicOpportunity(row),decision,next_actions:actions,notice:'OSの判定は参考情報です。正式な参加可否・資格・期限は必ず原典で最終確認してください。'});
}
