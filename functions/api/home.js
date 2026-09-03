import { requireClientKey } from '../../lib/client-token.js';
import { publicOpportunity } from '../../lib/db.js';
import { matchOpportunity } from '../../lib/matcher.js';
import { nextActions } from '../../lib/next-actions.js';
import { opportunityViewModel, profileCompletion } from '../../lib/view-model.js';
import { json } from '../../lib/validation.js';

async function getWatchRows(db,k){try{return (await db.prepare('SELECT o.*,w.saved_at,w.source_hash_snapshot FROM watch_items w JOIN opportunities o ON o.id=w.opportunity_id WHERE w.client_key=? ORDER BY w.saved_at DESC LIMIT 20').bind(k).all()).results||[];}catch{return (await db.prepare('SELECT o.*,w.saved_at FROM watch_items w JOIN opportunities o ON o.id=w.opportunity_id WHERE w.client_key=? ORDER BY w.saved_at DESC LIMIT 20').bind(k).all()).results||[];}}
export async function onRequestGet({request,env}) {
  if(!env.DB)return json({ok:false,error:'DB_UNAVAILABLE'},503);
  const k=await requireClientKey(request);
  const recent=await env.DB.prepare("SELECT * FROM opportunities ORDER BY COALESCE(announced_at,'') DESC,fetched_at DESC LIMIT 60").all();
  const recentRows=recent.results||[];
  const newItems=recentRows.slice(0,5).map(publicOpportunity);
  let profile=null,recommendations=[],watchItems=[],watchUpdates=[],todayActions=[],completion=profileCompletion(null);
  if(k){
    profile=await env.DB.prepare('SELECT * FROM company_profiles WHERE client_key=?').bind(k).first();
    completion=profileCompletion(profile);
    const w=await getWatchRows(env.DB,k);
    watchItems=w.slice(0,5).map(row=>{const vm=opportunityViewModel(row,profile,row);return{...vm.source,decision:vm.decision,match_band:vm.match_band,has_update:vm.has_update,feature_tags:vm.feature_tags,saved_at:row.saved_at};});
    watchUpdates=watchItems.filter(x=>x.has_update).slice(0,5);
    if(profile){
      recommendations=recentRows.map(o=>opportunityViewModel(o,profile,null)).filter(x=>x.decision&&x.decision.decision!=='NO-GO').sort((a,b)=>b.decision.score-a.decision.score).slice(0,5);
      for(const x of watchUpdates.slice(0,2)) todayActions.push({opportunity_id:x.id,title:x.title,action:'WATCH案件の更新内容を原典で確認する',kind:'watch_update'});
      const go=recommendations.find(x=>x.decision.decision==='GO');
      if(go&&todayActions.length<5) todayActions.push({opportunity_id:go.source.id,title:go.source.title,action:'おすすめGO案件の原典と応募条件を確認する',kind:'go_review'});
      if(completion.percent<100&&todayActions.length<5) todayActions.push({opportunity_id:null,title:'企業プロフィール',action:`プロフィールをあと${completion.missing_fields.length}項目入力しておすすめ精度を上げる`,kind:'profile'});
      for(const x of watchItems.slice(0,Math.max(0,5-todayActions.length))) todayActions.push({opportunity_id:x.id,title:x.title,action:nextActions(x,profile)[0],kind:'watch'});
    } else todayActions.push({opportunity_id:null,title:'企業プロフィール',action:'プロフィールを作成して自社おすすめ案件を表示する',kind:'profile'});
  } else todayActions.push({opportunity_id:null,title:'企業プロフィール',action:'プロフィールを作成して自社おすすめ案件を表示する',kind:'profile'});
  const d=await env.DB.prepare("SELECT * FROM opportunities WHERE deadline_at IS NOT NULL AND deadline_at>=date('now') ORDER BY deadline_at LIMIT 5").all();
  const osSuggestion = recommendations[0] ? {title:'まず1件、原典を確認しましょう',text:`${recommendations[0].source.title} は自社との主題一致が確認されています。判断理由と応募準備チェックを確認してください。`,opportunity_id:recommendations[0].source.id} : {title:'案件検索から始めましょう',text:'AI・Web・DXなど自社の得意分野で検索し、気になる案件をWATCHしてください。',opportunity_id:null};
  return json({ok:true,profile_status:profile?'complete':'missing',profile_completion:completion,today_actions:todayActions,recommendations,new_items:newItems,deadline_items:(d.results||[]).map(publicOpportunity),watch_items:watchItems,watch_updates:watchUpdates,os_suggestion:osSuggestion});
}
export const __test={getWatchRows};
