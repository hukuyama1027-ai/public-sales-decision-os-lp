import { cleanText } from './validation.js';

export const ALLOWED_EVENTS = new Set([
  'page_view','cta_click','diagnosis_start','diagnosis_complete','pricing_click','usage_interest',
  'public_search','public_search_result_view','opportunity_detail_view','watch_add','company_profile_complete',
  'recommended_opportunity_view','go_view','watch_view','no_go_view','next_action_view','ai_support_start'
]);

const META_KEYS = Object.freeze({
  public_search: ['has_keyword','filter_count'],
  public_search_result_view: ['result_count','stale'],
  opportunity_detail_view: ['decision'],
  recommended_opportunity_view: ['decision','score_band'],
  go_view: ['score_band'], watch_view: ['score_band'], no_go_view: ['score_band'],
  next_action_view: ['count'], ai_support_start: ['question_type']
});

export function safeMetadata(eventType, input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const out = {};
  for (const key of META_KEYS[eventType] || []) {
    const v = input[key];
    if (['string','number','boolean'].includes(typeof v)) out[key] = typeof v === 'string' ? cleanText(v, 80) : v;
  }
  return Object.keys(out).length ? out : null;
}

export async function recordEvent(db, { event_type, session_id='server', plan=null, path=null, client_key=null, entity_type=null, entity_id=null, metadata=null }) {
  if (!db || !ALLOWED_EVENTS.has(event_type)) return false;
  const meta = safeMetadata(event_type, metadata);
  try {
    await db.prepare('INSERT INTO events(event_type,session_id,plan,path,client_key,entity_type,entity_id,metadata_json) VALUES(?,?,?,?,?,?,?,?)')
      .bind(event_type, cleanText(session_id,80)||'server', plan, cleanText(path,200)||null, client_key, entity_type, cleanText(entity_id,128)||null, meta ? JSON.stringify(meta) : null).run();
  } catch (err) {
    if (client_key || entity_type || entity_id || meta) throw err;
    await db.prepare('INSERT INTO events(event_type,session_id,plan,path) VALUES(?,?,?,?)')
      .bind(event_type, cleanText(session_id,80)||'server', plan, cleanText(path,200)||null).run();
  }
  return true;
}
