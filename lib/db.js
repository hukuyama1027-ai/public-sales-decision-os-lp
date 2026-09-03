const COLS = ['id','source','source_key','title','organization_name','prefecture_code','prefecture_name','city_name','location','announced_at','category','procedure_type','certification','description','source_url','attachments_json','tender_submission_raw','opening_event_raw','period_end_raw','deadline_at','deadline_source','raw_hash','fetched_at','last_seen_at','source_status'];

export async function upsertOpportunities(db, items) {
  if (!items.length) return 0;
  const sql = `INSERT INTO opportunities(${COLS.join(',')}) VALUES(${COLS.map(()=>'?').join(',')}) ON CONFLICT(id) DO UPDATE SET ${COLS.filter(c=>c!=='id').map(c=>`${c}=excluded.${c}`).join(',')}`;
  const statements = items.map(item => db.prepare(sql).bind(...COLS.map(c => item[c] ?? null)));
  await db.batch(statements);
  return items.length;
}

export async function searchCached(db, f) {
  const where = ['1=1'];
  const binds = [];
  if (f.q) { where.push('(title LIKE ? OR description LIKE ?)'); const q=`%${f.q}%`; binds.push(q,q); }
  if (f.prefecture) { where.push('(prefecture_name LIKE ? OR location LIKE ?)'); const p=`%${f.prefecture}%`; binds.push(p,p); }
  if (f.organization) { where.push('organization_name LIKE ?'); binds.push(`%${f.organization}%`); }
  if (f.category) { where.push('category = ?'); binds.push(f.category); }
  if (f.procedure) { where.push('procedure_type = ?'); binds.push(f.procedure); }
  if (f.announcedFrom) { where.push('announced_at >= ?'); binds.push(f.announcedFrom); }
  if (f.announcedTo) { where.push('announced_at <= ?'); binds.push(f.announcedTo); }
  if (f.deadlineFrom) { where.push('deadline_at IS NOT NULL AND deadline_at >= ?'); binds.push(f.deadlineFrom); }
  if (f.deadlineTo) { where.push('deadline_at IS NOT NULL AND deadline_at <= ?'); binds.push(f.deadlineTo); }
  if (f.newOnly) { const d=new Date(Date.now()-7*86400000).toISOString().slice(0,10); where.push('announced_at >= ?'); binds.push(d); }
  if (f.deadlineDays) { const today=new Date().toISOString().slice(0,10); const until=new Date(Date.now()+f.deadlineDays*86400000).toISOString().slice(0,10); where.push('deadline_at BETWEEN ? AND ?'); binds.push(today,until); }
  const limit = f.limit; const offset=(f.page-1)*limit;
  const sql=`SELECT * FROM opportunities WHERE ${where.join(' AND ')} ORDER BY COALESCE(announced_at,'') DESC, fetched_at DESC LIMIT ? OFFSET ?`;
  const res = await db.prepare(sql).bind(...binds, limit, offset).all();
  return res.results || [];
}

export function publicOpportunity(row) {
  return {
    id: row.id, title: row.title, organization_name: row.organization_name,
    prefecture_name: row.prefecture_name, city_name: row.city_name, location: row.location,
    announced_at: row.announced_at, deadline_at: row.deadline_at, category: row.category,
    procedure_type: row.procedure_type, certification: row.certification, description: row.description,
    source_url: row.source_url, attachments: safeJson(row.attachments_json, []),
    tender_submission_raw: row.tender_submission_raw, opening_event_raw: row.opening_event_raw,
    period_end_raw: row.period_end_raw, fetched_at: row.fetched_at, source: row.source,
  };
}

export function safeJson(value, fallback) { try { return JSON.parse(value || ''); } catch { return fallback; } }
