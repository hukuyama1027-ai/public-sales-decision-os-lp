# DB_DESIGN｜公共営業 意思決定OS v0.1

- 文書ID: AIMOS-LP-DB-001
- 版数: v0.1
- 状態: APPROVED_BY_AI_DESIGN
- DB: Cloudflare D1
- 対応: AIMOS-CR-003

## 1. 方針
- 既存 `events` / `leads` を保持する後方互換migration。
- 実案件・プロフィール・WATCH・検索履歴・閲覧履歴・同期履歴のみ追加。
- v0.1ではユーザーアカウント/パスワードを作らない。
- raw client tokenは保存せずSHA-256の`client_key`のみ保存。
- 官公需APIの欠損項目はNULL。推測値は原典データ列へ保存しない。
- raw XML全文は保存せず、必要な正規化項目とpayload hashのみ保存して容量を抑える。

## 2. events拡張
既存列は維持し、以下をnullable追加:
- client_key TEXT NULL
- entity_type TEXT NULL
- entity_id TEXT NULL
- metadata_json TEXT NULL

metadata_jsonへメール・会社名等のPIIを保存しない。

追加index:
- idx_events_client_created(client_key, created_at)
- idx_events_type_created(event_type, created_at)

## 3. opportunities
| Column | Type | Rule |
|---|---|---|
| id | TEXT PK | source情報から生成したstable hash |
| source | TEXT NOT NULL | `kkj` |
| source_key | TEXT NULL | API側に安定IDがある場合のみ |
| title | TEXT NOT NULL | 原典 |
| organization_name | TEXT NULL | 原典 |
| prefecture_code | TEXT NULL | 原典/JISコード |
| prefecture_name | TEXT NULL | 原典 |
| city_name | TEXT NULL | 原典 |
| location | TEXT NULL | 原典 |
| announced_at | TEXT NULL | 原典公告日 |
| category | TEXT NULL | 原典 |
| procedure_type | TEXT NULL | 原典 |
| certification | TEXT NULL | 原典 |
| description | TEXT NULL | 原典概要 |
| source_url | TEXT NULL | 原典/外部文書URI |
| attachments_json | TEXT NULL | 原典添付情報JSON |
| tender_submission_raw | TEXT NULL | API原値。v0.1で意味を勝手に締切扱いしない |
| opening_event_raw | TEXT NULL | API原値 |
| period_end_raw | TEXT NULL | API原値 |
| deadline_at | TEXT NULL | deterministicに「締切」と確認できた場合のみ |
| deadline_source | TEXT NULL | deadline_atの根拠field |
| raw_hash | TEXT NULL | 正規化前payloadのhash |
| fetched_at | TEXT NOT NULL | 最終取得時刻 |
| last_seen_at | TEXT NOT NULL | APIで最後に観測した時刻 |
| source_status | TEXT NOT NULL | active/unknown |

Indexes:
- idx_opp_announced(announced_at DESC)
- idx_opp_deadline(deadline_at)
- idx_opp_org(organization_name)
- idx_opp_pref(prefecture_code)
- idx_opp_category(category)
- idx_opp_procedure(procedure_type)

## 4. company_profiles
| Column | Type |
|---|---|
| client_key | TEXT PK |
| company_name | TEXT NOT NULL |
| industry | TEXT NOT NULL |
| services | TEXT NOT NULL |
| regions_json | TEXT NOT NULL |
| employee_scale | TEXT NULL |
| desired_project_size | TEXT NULL |
| public_experience | TEXT NOT NULL |
| unified_qualification | TEXT NOT NULL |
| strengths | TEXT NULL |
| created_at | TEXT NOT NULL |
| updated_at | TEXT NOT NULL |

メール等は保存しない。LP leadsとは結合しない。

## 5. watch_items
| Column | Type |
|---|---|
| client_key | TEXT NOT NULL |
| opportunity_id | TEXT NOT NULL |
| saved_at | TEXT NOT NULL |
| deadline_snapshot | TEXT NULL |
| status_snapshot | TEXT NULL |

PRIMARY KEY(client_key, opportunity_id)。
Indexes: client_key/saved_at, opportunity_id。

## 6. search_history
- id INTEGER PK AUTOINCREMENT
- client_key TEXT NULL
- session_id TEXT NOT NULL
- keyword TEXT NULL
- filters_json TEXT NULL
- result_count INTEGER NOT NULL DEFAULT 0
- searched_at TEXT NOT NULL

Index: client_key,searched_at DESC / session_id,searched_at DESC。
検索履歴に会社名/メールを保存しない。

## 7. recent_views
- client_key TEXT NOT NULL
- opportunity_id TEXT NOT NULL
- viewed_at TEXT NOT NULL
PRIMARY KEY(client_key, opportunity_id)。再閲覧時はviewed_atを更新。

## 8. sync_runs
- id INTEGER PK AUTOINCREMENT
- source TEXT NOT NULL
- query_key TEXT NOT NULL
- started_at TEXT NOT NULL
- completed_at TEXT NULL
- status TEXT NOT NULL (running/success/partial/error)
- fetched_count INTEGER NOT NULL DEFAULT 0
- upserted_count INTEGER NOT NULL DEFAULT 0
- error_code TEXT NULL

古い詳細ログを無制限保持しない。Evidenceに必要なサマリーのみ保存。

## 9. AI session（P1）
v0.1では会話本文の永続保存を必須にしない。AI利用率は`events.ai_support_start`で計測。将来必要なら`ai_sessions`を追加するが、P0 migrationには含めない。

## 10. Migration
`schema.sql`は新規環境用full schemaとして更新する。
既存本番DBには`migration_cr003.sql`を1回適用する。
- CREATE TABLE IF NOT EXISTS
- ALTER TABLE events ADD COLUMN ... は重複実行不可のためmigration versionを明示
- DROP/DELETE禁止

## 11. Retention
- opportunities: 検証中はactive/unknownを維持。古い案件は将来archive候補。
- search_history/recent_views: M3 Evidenceに必要な期間を保持。長期肥大化時は集約後削除。
- events/leads: 既存プライバシー方針に従う。

## 12. Data Integrity
- WATCHは存在するopportunity_idのみ受け付ける。
- profileはclient_key単位でupsert。
- opportunity upsertはsource由来のstable IDを使用。
- deadline_atがNULLの場合、UIは残日数を出さない。
