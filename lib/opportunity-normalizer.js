import { safeHttpUrl } from './validation.js';

async function sha256(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function normalizeOpportunity(item, now = new Date().toISOString()) {
  const sourceUrl = safeHttpUrl(item.source_url);
  const identity = `kkj|${item.source_key || ''}|${sourceUrl || ''}|${item.title || ''}|${item.organization_name || ''}|${item.announced_at || ''}`;
  const id = await sha256(identity);
  const rawHash = await sha256(JSON.stringify(item));
  return {
    id,
    source: 'kkj',
    source_key: item.source_key || null,
    title: item.title,
    organization_name: item.organization_name || null,
    prefecture_code: item.prefecture_code || null,
    prefecture_name: item.prefecture_name || null,
    city_name: item.city_name || null,
    location: item.location || null,
    announced_at: item.announced_at || null,
    category: item.category || null,
    procedure_type: item.procedure_type || null,
    certification: item.certification || null,
    description: item.description || null,
    source_url: sourceUrl,
    attachments_json: JSON.stringify(item.attachments || []),
    tender_submission_raw: item.tender_submission_raw || null,
    opening_event_raw: item.opening_event_raw || null,
    period_end_raw: item.period_end_raw || null,
    deadline_at: null,
    deadline_source: null,
    raw_hash: rawHash,
    fetched_at: now,
    last_seen_at: now,
    source_status: 'active',
  };
}

export async function normalizeOpportunities(items, now) {
  return Promise.all(items.map(item => normalizeOpportunity(item, now)));
}
