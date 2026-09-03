import { requireClientKey } from '../../../lib/client-token.js';
import { cleanText, json } from '../../../lib/validation.js';
export async function onRequestDelete({request,env,params}){const k=await requireClientKey(request);if(!k)return json({ok:false,error:'TOKEN_REQUIRED'},400);const id=cleanText(params.id,128);await env.DB.prepare('DELETE FROM watch_items WHERE client_key=? AND opportunity_id=?').bind(k,id).run();return json({ok:true,watched:false});}
