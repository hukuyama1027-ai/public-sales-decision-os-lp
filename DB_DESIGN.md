# DB_DESIGN｜公共営業 意思決定OS CR-004

- 文書ID: AIMOS-LP-DB-001
- 版数: v0.2
- 状態: APPROVED_BY_AI_DESIGN
- DB: Cloudflare D1

## 1. 方針
CR-003 schemaを後方互換で拡張する。既存events/leads/opportunities/company_profiles/watch_items/search_history/recent_views/sync_runsを保持し、既存行を削除/書換しない。

## 2. events追加列
`release_version TEXT NULL`

用途:
- NULL = CR-003/legacy event
- `cr004` = CR-004コードがserver-side記録したevent

Browser inputでrelease_versionを上書き不可。
Index:
`idx_events_release_created(release_version, created_at)`

## 3. watch_items追加列
`source_hash_snapshot TEXT NULL`

WATCH保存時のopportunities.raw_hashを保持。
現在raw_hashとの差分で`has_update`を算出。
legacy NULLはupdate不明ではなくUI上falseとし、誤警告を避ける。

## 4. 既存tables
構造・用途はCR-003 DB_DESIGN v0.1を継続。
- opportunities: 実公共案件cache
- company_profiles: 匿名client profile
- watch_items: WATCH
- search_history: 検索履歴（検索語は内部保持するがEvidence exportへ出さない）
- recent_views: 閲覧基盤
- events: Product Usage
- leads: LP lead
- sync_runs: upstream同期

## 5. Evidence Query
集計APIはfixed SQLのみ。
raw rows返却禁止。

Release分類:
`CASE WHEN release_version='cr004' THEN 'cr004' ELSE 'legacy_cr003' END`

Repeat user:
`GROUP BY client_key HAVING COUNT(DISTINCT DATE(created_at)) >= 2`
client_key IS NOT NULLのみ。

## 6. Migration CR-004
1. `schema_migrations`存在確認
2. PRAGMA table_info(events)でrelease_version確認
3. なければALTER TABLE events ADD COLUMN release_version TEXT
4. index作成
5. PRAGMA table_info(watch_items)でsource_hash_snapshot確認
6. なければALTER TABLE watch_items ADD COLUMN source_hash_snapshot TEXT
7. marker `cr004` insert

DROP/DELETE/既存event更新なし。

## 7. Backup
D1 Time Travelを継続利用。baseline code branchも保持。

## 8. Privacy
Evidence exportはevents/leadsをaggregate queryするだけで、client_key/session_id/email/company/search keywordを出力しない。
