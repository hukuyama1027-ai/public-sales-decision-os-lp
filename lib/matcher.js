const STRONG_KEYWORDS = ['AI','生成AI','人工知能','Web','ウェブ','DX','RPA','SaaS','アプリ','クラウド','データ','コンサル','ネットワーク','セキュリティ'];
const GENERIC_KEYWORDS = ['システム','開発','保守','運用'];
const norm = v => String(v || '').normalize('NFKC').toLowerCase();

function containsAsciiAware(text, keyword) {
  const source = String(text || '').normalize('NFKC');
  const q = String(keyword || '').normalize('NFKC');
  if (/^[A-Za-z0-9+#._-]{2,12}$/.test(q)) {
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^A-Za-z0-9])${escaped}($|[^A-Za-z0-9])`, 'i').test(source);
  }
  return norm(source).includes(norm(q));
}

export function keywordSignals(profile, opportunity) {
  const profileText = `${profile.services || ''} ${profile.strengths || ''} ${profile.industry || ''}`;
  const title = String(opportunity.title || '');
  const primaryText = `${title}\n${String(opportunity.description || '').slice(0, 600)}`;
  const isConstruction = norm(opportunity.category).includes('工事');

  // In construction notices, AI/DX/system terms often describe optional construction
  // methods rather than the procured deliverable. For that category, require the
  // strong IT term to be part of the procurement title itself.
  const strongTarget = isConstruction ? title : primaryText;
  const strong = STRONG_KEYWORDS.filter(k => containsAsciiAware(profileText, k) && containsAsciiAware(strongTarget, k));

  // Generic words such as "system" or "development" occur incidentally in many public notices.
  // Count them independently only when they describe the procurement subject in the title.
  const generic = GENERIC_KEYWORDS.filter(k => containsAsciiAware(profileText, k) && containsAsciiAware(title, k));
  return [...new Set([...strong, ...generic])];
}

export function matchOpportunity(profile, opportunity, now = new Date()) {
  if (!profile) return null;
  let score = 0;
  const positive_reasons = [];
  const check_points = [];
  const missing_information = [];
  const matchedKeywords = keywordSignals(profile, opportunity);
  const serviceRelevant = matchedKeywords.length > 0;
  const keywordScore = Math.min(matchedKeywords.length * 8, 35);
  score += keywordScore;
  if (serviceRelevant) positive_reasons.push(`得意分野と案件の主題が一致: ${matchedKeywords.slice(0,4).join(' / ')}`);
  else check_points.push('自社サービスとの主題一致が確認できないため、現時点では優先度低');

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
  } else missing_information.push('公告日/取得日');

  if (!opportunity.source_url) missing_information.push('原典URL');
  if (!opportunity.deadline_at) missing_information.push('提出締切');
  score = Math.max(0, Math.min(100, score));

  const fields = ['title','organization_name','announced_at','category','procedure_type','certification','location','source_url'];
  const present = fields.filter(f => opportunity[f]).length;
  const information_completeness = Math.round((present / fields.length) * 100);
  const criticalUnknown = missing_information.includes('参加資格情報') || missing_information.includes('地域情報');
  let decision;
  if (!serviceRelevant) decision = 'NO-GO';
  else if (score >= 70 && !criticalUnknown) decision = 'GO';
  else decision = 'WATCH';
  if (decision === 'NO-GO') check_points.push('現時点では自社サービスとの主題一致が弱いため優先度低。参加不可の判定ではありません');

  return { score, information_completeness, decision, service_relevant: serviceRelevant, positive_reasons, check_points, missing_information };
}
