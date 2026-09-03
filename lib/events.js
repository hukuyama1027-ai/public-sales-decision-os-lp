import { cleanText } from './validation.js';
import { APP_RELEASE } from './release.js';

export const ALLOWED_EVENTS = new Set([
  'page_view','cta_click','diagnosis_start','diagnosis_complete','pricing_click','usage_interest',
  'public_search','public_search_result_view','opportunity_detail_view','watch_add','watch_remove','company_profile_complete','profile_update',
  'recommended_opportunity_view','go_view','watch_view','no_go_view','next_action_view','application_prep_start','ai_support_start'
]);

const META_KEYS = Object.freeze({
  public_search: ['has_keyword','filter_count'],
  public_search_result_view: ['result_count','stale'],
  opportunity_detail_view: ['decision'],
  recommended_opportunity_view: ['decision','score_band'],
  go_view: ['score_band'], watch_view: ['score_band'], no_go_view: ['score_band'],
  next_action_view: ['count'], application_prep_start: ['decision'], ai_support_start: ['question_type']
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
  const args = [event_type, cleanText(session_id,80)||'server', plan, cleanText(path,200)||null, client_key, entity_type, cleanText(entity_id,128)||null, meta ? JSON.stringify(meta) : null, APP_RELEASE];
  try {
    await db.prepare('INSERT INTO events(event_type,session_id,plan,path,client_key,entity_type,entity_id,metadata_json,release_version) VALUES(?,?,?,?,?,?,?,?,?)').bind(...args).run();
  } catch (err) {
    // Deployment-safe fallback while the CR-004 schema bootstrap has not run yet.
    try {
      await db.prepare('INSERT INTO events(event_type,session_id,plan,path,client_key,entity_type,entity_id,metadata_json) VALUES(?,?,?,?,?,?,?,?)').bind(...args.slice(0,8)).run();
    } catch (fallbackErr) {
      if (client_key || entity_type || entity_id || meta) throw fallbackErr;
      await db.prepare('INSERT INTO events(event_type,session_id,plan,path) VALUES(?,?,?,?)').bind(...args.slice(0,4)).run();
    }
  }
  return true;
}
