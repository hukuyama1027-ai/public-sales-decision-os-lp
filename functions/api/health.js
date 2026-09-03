import { ensureCr004Schema } from '../../lib/schema.js';
import { json } from '../../lib/validation.js';

export async function onRequestGet({env}){
  if(!env.DB) return json({ok:false,db:false,error:'DB_UNAVAILABLE'},503);
  try{
    const migration=await ensureCr004Schema(env.DB);
    await env.DB.prepare('SELECT 1 AS ok').first();
    return json({ok:true,db:true,version:'0.1-cr004',schema:migration.version,migrated:migration.applied});
  }catch(err){
    return json({ok:false,db:false,error:'DB_UNAVAILABLE',message:String(err?.message||'migration_failed').slice(0,120)},503);
  }
}
