import { publicOpportunity } from '../../../lib/db.js';
import { requireClientKey } from '../../../lib/client-token.js';
import { matchOpportunity } from '../../../lib/matcher.js';
import { nextActions } from '../../../lib/next-actions.js';
import { recordEvent } from '../../../lib/events.js';
import { featureTags, hasWatchUpdate, matchBand } from '../../../lib/view-model.js';
import { cleanText, json } from '../../../lib/validation.js';

export async function onRequestGet({request,env,params}){
  if(!env.DB)return json({ok:false,error:'DB_UNAVAILABLE'},503);
  const id=cleanText(params.id,128);const row=await env.DB.prepare('SELECT * FROM opportunities WHERE id=?').bind(id).first();if(!row)return json({ok:false,error:'NOT_FOUND'},404);
  const clientKey=await requireClientKey(request);let profile=null,decision=null,watchRow=null;if(clientKey){profile=await env.DB.prepare('SELECT * FROM company_profiles WHERE client_key=?').bind(clientKey).first();if(profile)decision=matchOpportunity(profile,row);try{watchRow=await env.DB.prepare('SELECT source_hash_snapshot FROM watch_items WHERE client_key=? AND opportunity_id=?').bind(clientKey,id).first();}catch{watchRow=await env.DB.prepare('SELECT 1 AS watched FROM watch_items WHERE client_key=? AND opportunity_id=?').bind(clientKey,id).first();}try{await env.DB.prepare('INSERT INTO recent_views(client_key,opportunity_id,viewed_at) VALUES(?,?,?) ON CONFLICT(client_key,opportunity_id) DO UPDATE SET viewed_at=excluded.viewed_at').bind(clientKey,id,new Date().toISOString()).run();}catch{}}
  const actions=nextActions(row,profile),sessionId=cleanText(request.headers.get('x-session-id'),80)||'anonymous';try{await recordEvent(env.DB,{event_type:'opportunity_detail_view',session_id:sessionId,client_key:clientKey,entity_type:'opportunity',entity_id:id,metadata:{decision:decision?.decision||'none'}});}catch{}
  const updated=hasWatchUpdate({...row,source_hash_snapshot:watchRow?.source_hash_snapshot});
  return json({ok:true,source:publicOpportunity(row),decision,match_band:matchBand(decision),watched:Boolean(watchRow),has_update:updated,feature_tags:featureTags(row,decision,updated),next_actions:actions,application_prep:{available:decision?.decision==='GO',items:actions},notice:'OSの判定は参考情報です。正式な参加可否・資格・期限は必ず原典で最終確認してください。'});
}
