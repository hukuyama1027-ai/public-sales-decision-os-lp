export function normalizeCardData(input){
  const x=input||{};
  const nested=typeof x.source==='object'&&x.source!==null&&!Array.isArray(x.source);
  const item=nested?x.source:x;
  const decision=x.decision||item?.decision||null;
  return{
    item:item||{},
    decision,
    match_band:x.match_band||item?.match_band||null,
    watched:Boolean(x.watched??item?.watched),
    has_update:Boolean(x.has_update??item?.has_update),
    feature_tags:x.feature_tags||item?.feature_tags||[],
    reason_summary:x.reason_summary||decision?.positive_reasons?.slice(0,2)||[],
    check_summary:x.check_summary||decision?.check_points?.slice(0,2)||[]
  };
}

export function hasValidOpportunityId(item){
  return typeof item?.id==='string'&&item.id.trim().length>0;
}

export function watchRequestBody(item){
  if(!hasValidOpportunityId(item))throw new Error('INVALID_OPPORTUNITY_ID');
  return{opportunity_id:item.id};
}
