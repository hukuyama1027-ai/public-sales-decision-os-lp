import { ALLOWED_EVENTS, recordEvent, safeMetadata } from '../../lib/events.js';
import { requireClientKey } from '../../lib/client-token.js';
import { cleanText, json, readJson } from '../../lib/validation.js';
const PLANS = new Set(['starter','standard','pro']);
const ENTITY_TYPES = new Set(['opportunity','profile','search','plan']);

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ok:false,error:'DB_UNAVAILABLE'},503);
  let body; try { body=await readJson(request,6000); } catch(e){ return json({ok:false,error:e.message},e.status||400); }
  const eventType=cleanText(body.event_type,80), sessionId=cleanText(body.session_id,80);
  const plan=body.plan?cleanText(body.plan,30):null, path=body.path?cleanText(body.path,200):null;
  const entityType=body.entity_type?cleanText(body.entity_type,30):null, entityId=body.entity_id?cleanText(body.entity_id,128):null;
  if(!ALLOWED_EVENTS.has(eventType)||!sessionId) return json({ok:false,error:'INVALID_EVENT'},400);
  if(plan&&!PLANS.has(plan)) return json({ok:false,error:'INVALID_PLAN'},400);
  if(entityType&&!ENTITY_TYPES.has(entityType)) return json({ok:false,error:'INVALID_ENTITY'},400);
  const clientKey=await requireClientKey(request);
  await recordEvent(env.DB,{event_type:eventType,session_id:sessionId,plan,path,client_key:clientKey,entity_type:entityType,entity_id:entityId,metadata:safeMetadata(eventType,body.metadata)});
  return json({ok:true});
}
export function onRequestGet(){return json({ok:false,error:'METHOD_NOT_ALLOWED'},405);}
export const __test={ALLOWED_EVENTS,PLANS,ENTITY_TYPES,safeMetadata};
