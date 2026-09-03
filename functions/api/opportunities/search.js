import { fetchKkj } from '../../../lib/kkj-adapter.js';
import { normalizeOpportunities } from '../../../lib/opportunity-normalizer.js';
import { prefectureCode } from '../../../lib/prefectures.js';
import { publicOpportunity, searchCached, upsertOpportunities } from '../../../lib/db.js';
import { requireClientKey } from '../../../lib/client-token.js';
import { recordEvent } from '../../../lib/events.js';
import { cleanText, json, validDate } from '../../../lib/validation.js';

function parseFilters(url){
  const p=url.searchParams;
  return {q:cleanText(p.get('q'),100),prefecture:cleanText(p.get('prefecture'),20),organization:cleanText(p.get('organization'),100),announcedFrom:cleanText(p.get('announced_from'),10),announcedTo:cleanText(p.get('announced_to'),10),deadlineFrom:cleanText(p.get('deadline_from'),10),deadlineTo:cleanText(p.get('deadline_to'),10),category:cleanText(p.get('category'),30),procedure:cleanText(p.get('procedure'),30),newOnly:p.get('new')==='1',deadlineDays:[7,14].includes(Number(p.get('deadline_days')))?Number(p.get('deadline_days')):null,page:Math.max(1,Number(p.get('page'))||1),limit:Math.min(50,Math.max(1,Number(p.get('limit'))||20))};
}
function validFilters(f){return [f.announcedFrom,f.announcedTo,f.deadlineFrom,f.deadlineTo].every(validDate);}
function isFresh(rows){if(!rows.length)return false;const newest=Math.max(...rows.map(r=>Date.parse(r.fetched_at||0)).filter(Number.isFinite));return newest && Date.now()-newest<6*3600000;}

export async function onRequestGet({request,env}){
  if(!env.DB)return json({ok:false,error:'DB_UNAVAILABLE'},503);
  const f=parseFilters(new URL(request.url));if(!validFilters(f))return json({ok:false,error:'INVALID_INPUT',message:'日付形式を確認してください'},400);
  let rows=[];try{rows=await searchCached(env.DB,f);}catch{return json({ok:false,error:'DB_UNAVAILABLE'},503);}
  let stale=false,upstreamError=null;const hasKey=!!(f.q||f.organization||f.prefecture);
  if(hasKey&&!isFresh(rows)){
    try{
      const queryKey=JSON.stringify({q:f.q,organization:f.organization,prefecture:f.prefecture,announcedFrom:f.announcedFrom,announcedTo:f.announcedTo,category:f.category,procedure:f.procedure});
      const recent=await env.DB.prepare("SELECT 1 AS ok FROM sync_runs WHERE query_key=? AND status='success' AND completed_at>=datetime('now','-10 minutes') LIMIT 1").bind(queryKey).first();
      if(!recent){
        const started=new Date().toISOString();const run=await env.DB.prepare("INSERT INTO sync_runs(source,query_key,started_at,status) VALUES('kkj',?,?,'running') RETURNING id").bind(queryKey,started).first();
        try{const raw=await fetchKkj({q:f.q,organization:f.organization,lgCode:prefectureCode(f.prefecture),category:f.category,procedure:f.procedure,announcedFrom:f.announcedFrom,announcedTo:f.announcedTo,count:30});const normalized=await normalizeOpportunities(raw,new Date().toISOString());const n=await upsertOpportunities(env.DB,normalized);await env.DB.prepare("UPDATE sync_runs SET completed_at=?,status='success',fetched_count=?,upserted_count=? WHERE id=?").bind(new Date().toISOString(),raw.length,n,run.id).run();}catch(e){await env.DB.prepare("UPDATE sync_runs SET completed_at=?,status='error',error_code=? WHERE id=?").bind(new Date().toISOString(),cleanText(e.message,120),run.id).run();throw e;}
      }
      rows=await searchCached(env.DB,f);
    }catch(e){upstreamError=cleanText(e.message,120);stale=true;}
  }
  if(!rows.length&&upstreamError)return json({ok:false,error:'UPSTREAM_UNAVAILABLE',message:'公式APIから最新情報を取得できませんでした'},503);
  const sessionId=cleanText(request.headers.get('x-session-id'),80)||'anonymous',clientKey=await requireClientKey(request);const filterCount=['prefecture','organization','announcedFrom','announcedTo','deadlineFrom','deadlineTo','category','procedure'].filter(k=>f[k]).length+(f.newOnly?1:0)+(f.deadlineDays?1:0);
  try{await env.DB.prepare('INSERT INTO search_history(client_key,session_id,keyword,filters_json,result_count,searched_at) VALUES(?,?,?,?,?,?)').bind(clientKey,sessionId,f.q||null,JSON.stringify({...f,q:undefined}),rows.length,new Date().toISOString()).run();await recordEvent(env.DB,{event_type:'public_search',session_id:sessionId,client_key:clientKey,entity_type:'search',metadata:{has_keyword:!!f.q,filter_count:filterCount}});await recordEvent(env.DB,{event_type:'public_search_result_view',session_id:sessionId,client_key:clientKey,entity_type:'search',metadata:{result_count:rows.length,stale}});}catch{}
  return json({ok:true,items:rows.map(publicOpportunity),count:rows.length,source:'kkj',cache:{stale},disclaimer:'官公需情報ポータルAPIを利用しています。掲載情報はすべての公共調達案件を網羅するものではありません。'});
}
export const __test={parseFilters,validFilters,isFresh};
