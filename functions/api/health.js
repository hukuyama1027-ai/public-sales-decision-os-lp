import { json } from '../../lib/validation.js';
export async function onRequestGet({env}){
  if(!env.DB) return json({ok:false,db:false,error:'DB_UNAVAILABLE'},503);
  try{await env.DB.prepare('SELECT 1 AS ok').first();return json({ok:true,db:true,version:'0.1-cr003'});}catch{return json({ok:false,db:false,error:'DB_UNAVAILABLE'},503);}
}
