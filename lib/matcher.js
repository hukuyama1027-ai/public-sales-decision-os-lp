const DOMAIN_KEYWORDS = ['AI','生成AI','人工知能','Web','ウェブ','システム','DX','RPA','SaaS','アプリ','クラウド','データ','開発','保守','運用','コンサル','ネットワーク','セキュリティ'];
const norm = v => String(v || '').normalize('NFKC').toLowerCase();

function keywordSignals(profile, opportunity) {
  const profileText = norm(`${profile.services || ''} ${profile.strengths || ''} ${profile.industry || ''}`);
  const oppText = norm(`${opportunity.title || ''} ${opportunity.description || ''} ${opportunity.category || ''} ${opportunity.procedure_type || ''}`);
  return DOMAIN_KEYWORDS.filter(k => profileText.includes(norm(k)) && oppText.includes(norm(k)));
}

export function matchOpportunity(profile, opportunity, now = new Date()) {
  if (!profile) return null;
  let score = 0;
  const positive_reasons = [];
  const check_points = [];
  const missing_information = [];
  const matchedKeywords = keywordSignals(profile, opportunity);
  const keywordScore = Math.min(matchedKeywords.length * 8, 35);
  score += keywordScore;
  if (matchedKeywords.length) positive_reasons.push(`得意分野と案件キーワードが一致: ${matchedKeywords.slice(0,4).join(' / ')}`);
  else check_points.push('自社サービスとの具体的な適合を原典で確認');

  let regions = [];
  try { regions = JSON.parse(profile.regions_json || '[]'); } catch {}
  const oppRegion = norm(`${opportunity.prefecture_name || ''} ${opportunity.city_name || ''} ${opportunity.location || ''}`);
  const regionMatch = regions.some(r => norm(r) === '全国' || oppRegion.includes(norm(r)));
  if (regionMatch) { score += 20; positive_reasons.push('登録した対応地域と一致'); }
  else if (oppRegion) check_points.push('対応可能地域か確認');
  else missing_information.push('地域情報');

  if (opportunity.category || opportunity.procedure_type) { score += 8; positive_reasons.push('案件分類情報を取得済み'); }
  else missing_information.push('案件分類');

  if (opportunity.certification) {
    if (profile.unified_qualification === 'yes') { score += 8; positive_reasons.push('全省庁統一資格を保有と登録（案件側要件は要確認）'); }
    else check_points.push('案件の資格要件と自社資格を原典で照合');
  } else missing_information.push('参加資格情報');

  if (profile.public_experience === 'once_or_more') { score += 10; positive_reasons.push('公共案件への応募経験あり'); }
  else if (profile.public_experience === 'considering') score += 5;

  if (opportunity.announced_at) {
    const age = (now - new Date(`${opportunity.announced_at}T00:00:00Z`)) / 86400000;
    if (age >= 0 && age <= 14) { score += 5; positive_reasons.push('比較的新しい公告'); }
  } else missing_information.push('公告日');

  if (!opportunity.source_url) missing_information.push('原典URL');
  if (!opportunity.deadline_at) missing_information.push('提出締切');
  score = Math.max(0, Math.min(100, score));

  const fields = ['title','organization_name','announced_at','category','procedure_type','certification','location','source_url'];
  const present = fields.filter(f => opportunity[f]).length;
  const information_completeness = Math.round((present / fields.length) * 100);
  const criticalUnknown = missing_information.includes('参加資格情報') || missing_information.includes('地域情報');
  let decision = score >= 70 && !criticalUnknown ? 'GO' : score >= 40 || criticalUnknown ? 'WATCH' : 'NO-GO';
  if (decision === 'NO-GO') check_points.push('現時点では自社との一致情報が少ないため優先度低。参加不可の判定ではありません');

  return { score, information_completeness, decision, positive_reasons, check_points, missing_information };
}
