import { bearerToken, verifyGitHubOidc } from '../../../lib/github-oidc.js';
import { collectEvidence } from '../../../lib/evidence.js';
import { ensureCr004Schema } from '../../../lib/schema.js';
import { json } from '../../../lib/validation.js';
const DAYS=new Set([7,30,90]);
export async function onRequestGet({request,env}){const token=bearerToken(request);if(!token)return json({ok:false,error:'TOKEN_REQUIRED'},401);try{await verifyGitHubOidc(token);}catch(e){const code=String(e?.message||'OIDC_INVALID');if(code==='JWKS_UNAVAILABLE')return json({ok:false,error:code},503);return json({ok:false,error:'OIDC_INVALID'},403);}const raw=new URL(request.url).searchParams.get('days');const days=raw==null?30:Number(raw);if(!DAYS.has(days))return json({ok:false,error:'INVALID_DAYS'},400);if(!env.DB)return json({ok:false,error:'DB_UNAVAILABLE'},503);try{await ensureCr004Schema(env.DB);return json(await collectEvidence(env.DB,days),200,{'cache-control':'no-store'});}catch{return json({ok:false,error:'DB_UNAVAILABLE'},503);}}
export function onRequestPost(){return json({ok:false,error:'METHOD_NOT_ALLOWED'},405);}
export const __test={DAYS};
