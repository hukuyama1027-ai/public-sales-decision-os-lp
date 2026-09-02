# DETAIL_DESIGN｜需要検証LP

- 文書ID: AIMOS-LP-DD-001
- 版数: v0.1
- 状態: APPROVED_BY_AI_DESIGN

## API
### POST /api/event
Input JSON:
- event_type: enum(page_view, cta_click, diagnosis_start, diagnosis_complete, pricing_click, usage_interest)
- session_id: 1..80 chars
- plan: optional enum(starter, standard, pro)
- path: optional <=200
Output: {ok:true}
Validation failure: 400

### POST /api/lead
Input JSON:
- company_name 1..120
- industry 1..80
- employee_scale optional enum(1-4,5-9,10-30,31-99,100+)
- services 2..500
- region 1..120
- public_experience enum(none,considering,once_or_more)
- unified_qualification enum(yes,no,unknown)
- email valid-like pattern <=254
- price_interest enum(9800,19800,29800,undecided)
- usage_interest boolean
- consent boolean=true
- website optional honeypot must be empty
Output: {ok:true,id:<integer>}

## DB
### events
id INTEGER PK AUTOINCREMENT
event_type TEXT NOT NULL
session_id TEXT NOT NULL
plan TEXT NULL
path TEXT NULL
created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP

Indexes: event_type, created_at, session_id.

### leads
id INTEGER PK AUTOINCREMENT
company_name TEXT NOT NULL
industry TEXT NOT NULL
employee_scale TEXT NULL
services TEXT NOT NULL
region TEXT NOT NULL
public_experience TEXT NOT NULL
unified_qualification TEXT NOT NULL
email TEXT NOT NULL
price_interest TEXT NOT NULL
usage_interest INTEGER NOT NULL DEFAULT 0
consent_at TEXT NOT NULL
created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP

Index: created_at, price_interest, usage_interest.

## セキュリティ
- CORSはsame-origin想定。Access-Control-Allow-Originは付与しない。
- Content-Type application/jsonのみ受け付ける。
- 1リクエスト本文の想定上限を小さく維持（プラットフォーム側上限より遥かに小さい）。
- HTML出力へユーザー入力を反映する場合textContentのみ使用。
- honeypot populated時は成功風レスポンスを返しDB保存しない。
- リード取得APIはPOSTのみ。GET一覧APIは作らない。

## SEO
canonicalはデプロイ後URLへ置換する。OGPも同じ公開URLを使用。
robots index,follow。sitemap.xmlを同梱する。
