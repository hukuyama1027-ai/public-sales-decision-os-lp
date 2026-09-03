export function nextActions(opportunity, profile = null) {
  const actions = [
    '公告原文を確認する',
    '参加資格・必要資格を原典で確認する',
    '質問期限を原典で確認する',
    '説明会の有無を原典で確認する',
    '提出資料を原典で確認する',
  ];
  if (!opportunity.deadline_at) actions.push('提出期限は取得情報だけで断定せず、原典で確認する');
  if (!opportunity.certification) actions.push('参加資格情報が未取得のため、公告・仕様書を確認する');
  if (!opportunity.source_url) actions.push('発注機関名と案件名から公式公告を確認する');
  if (profile?.unified_qualification === 'unknown') actions.push('自社の全省庁統一資格の取得状況を確認する');
  return [...new Set(actions)];
}
