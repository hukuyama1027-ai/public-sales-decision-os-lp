import { cleanText, safeHttpUrl } from './validation.js';

export const KKJ_API_BASE = 'https://www.kkj.go.jp/api/';
export const KKJ_PORTAL_URL = 'https://www.kkj.go.jp/s/';

function decodeXml(value = '') {
  const cdata = value.replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/i, '$1');
  return cdata
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'").replace(/&amp;/g, '&')
    .trim();
}

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'));
  return m ? decodeXml(m[1]) : null;
}

function blocks(xml, name) {
  return [...xml.matchAll(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'gi'))].map(m => m[1]);
}

export function parseKkjXml(xml) {
  if (typeof xml !== 'string' || !xml.trim()) throw new Error('EMPTY_XML');
  const error = tag(xml, 'Error');
  if (error) throw new Error(`KKJ_ERROR:${cleanText(error, 200)}`);
  const resultBlocks = blocks(xml, 'SearchResult');
  return resultBlocks.map(block => {
    const attachmentRoot = tag(block, 'Attachments') || '';
    const attachments = blocks(attachmentRoot, 'Attachment').map(a => ({
      name: cleanText(tag(a, 'Name'), 200) || null,
      uri: safeHttpUrl(tag(a, 'Uri') || tag(a, 'URI')),
    })).filter(x => x.name || x.uri);
    return {
      result_id: cleanText(tag(block, 'ResultId'), 80) || null,
      source_key: cleanText(tag(block, 'Key'), 240) || null,
      source_url: safeHttpUrl(tag(block, 'ExternalDocumentURI')),
      title: cleanText(tag(block, 'ProjectName'), 600),
      fetched_source_date: cleanText(tag(block, 'Date'), 80) || null,
      prefecture_code: cleanText(tag(block, 'LgCode'), 20) || null,
      prefecture_name: cleanText(tag(block, 'PrefectureName'), 80) || null,
      city_name: cleanText(tag(block, 'CityName'), 100) || null,
      organization_name: cleanText(tag(block, 'OrganizationName'), 300) || null,
      certification: cleanText(tag(block, 'Certification'), 600) || null,
      announced_at: normalizeDate(tag(block, 'CftIssueDate')),
      period_end_raw: cleanText(tag(block, 'PeriodEndTime'), 120) || null,
      category: cleanText(tag(block, 'Category'), 120) || null,
      procedure_type: cleanText(tag(block, 'ProcedureType'), 120) || null,
      location: cleanText(tag(block, 'Location'), 300) || null,
      tender_submission_raw: cleanText(tag(block, 'TenderSubmissionDeadline'), 120) || null,
      opening_event_raw: cleanText(tag(block, 'OpeningTendersEvent'), 120) || null,
      description: cleanText(tag(block, 'ProjectDescription'), 4000) || null,
      attachments,
    };
  }).filter(x => x.title);
}

export function normalizeDate(value) {
  const s = cleanText(value, 80);
  const m = s.match(/(\d{4})[-\/.年](\d{1,2})[-\/.月](\d{1,2})/);
  if (!m) return null;
  const y = m[1], mo = m[2].padStart(2, '0'), d = m[3].padStart(2, '0');
  const iso = `${y}-${mo}-${d}`;
  const test = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(test.getTime()) ? null : iso;
}

export function buildKkjUrl(filters = {}) {
  const u = new URL(KKJ_API_BASE);
  if (filters.q) u.searchParams.set('Query', cleanText(filters.q, 100));
  if (filters.organization) u.searchParams.set('Organization_Name', cleanText(filters.organization, 100));
  if (filters.lgCode) u.searchParams.set('LG_Code', cleanText(filters.lgCode, 20));
  if (filters.category) u.searchParams.set('Category', cleanText(filters.category, 30));
  if (filters.procedure) u.searchParams.set('Procedure_Type', cleanText(filters.procedure, 30));
  if (filters.announcedFrom || filters.announcedTo) {
    u.searchParams.set('CFT_Issue_Date', `${filters.announcedFrom || ''}/${filters.announcedTo || ''}`);
  }
  u.searchParams.set('Count', String(Math.min(Math.max(Number(filters.count) || 30, 1), 50)));
  return u;
}

export async function fetchKkj(filters, fetchImpl = fetch) {
  const url = buildKkjUrl(filters);
  if (![...url.searchParams.keys()].some(k => ['Query','Project_Name','Organization_Name','LG_Code'].includes(k))) {
    throw new Error('KKJ_SEARCH_KEY_REQUIRED');
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetchImpl(url, { headers: { accept: 'application/xml,text/xml;q=0.9,*/*;q=0.1' }, signal: controller.signal });
    if (!res.ok) throw new Error(`KKJ_HTTP_${res.status}`);
    const text = await res.text();
    return parseKkjXml(text);
  } finally { clearTimeout(timer); }
}
