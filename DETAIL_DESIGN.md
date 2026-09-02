# DETAIL_DESIGN｜公共営業 意思決定OS｜LP + 無料版 v0.1

- 文書ID: AIMOS-LP-DD-001
- 版数: v0.2
- 状態: APPROVED_BY_AI_DESIGN
- 対応: AIMOS-CR-003

## 1. Repository Layout
```text
src/
  index.html
  assets/style.css
  assets/app.js
  app/
    index.html
    app.css
    app.js
    modules/
      api.js
      state.js
      render.js
      token.js
      format.js
functions/api/
  event.js
  lead.js
  health.js
  home.js
  profile.js
  watch.js
  watch/[id].js
  recommendations.js
  recent.js
  opportunities/search.js
  opportunities/[id].js
  ai/support.js                 # P1
lib/
  client-token.js
  db.js
  events.js
  kkJ-adapter.js
  opportunity-normalizer.js
  matcher.js
  next-actions.js
  validation.js
workers/
  sync-worker.js
schema.sql
migration_cr003.sql
tests/
```

## 2. Client Token
### Browser
- `localStorage['public_sales_client_token']`
- 未存在時 `crypto.getRandomValues(new Uint8Array(32))` → base64url。
- APIへ `X-Client-Token`。

### Server
- ASCII length 40..100程度を受理、charset base64url。
- Web Crypto SHA-256 → hex 64文字 `client_key`。
- raw tokenをログ/DBへ書かない。

## 3. Official API Adapter
### Endpoint
固定base URLのみ。ユーザー入力でhost/pathを変更できない。

### Request
- GETを第一候補。
- 必須検索キー: `Query` / `Project_Name` / `Organization_Name` / `LG_Code` のいずれか。
- `Count` default 30, hard max 50。
- 公告日範囲などの公式パラメータへ安全にmapping。
- timeout 5000ms目安。

### XML Parse
実装はサーバー側専用parser module。
- XML declaration、CDATA、entityを処理。
- `SearchResult` 0/1/N件を常にarrayへ正規化。
- `Error` responseをHTTP 200でもfailure扱い。
- 不明tagは無視。
- HTMLとして描画しない。

### Stable ID
`sha256('kkj|' + canonical source uri + '|' + title + '|' + organization + '|' + announced_at)`。
source uriがない場合も同規則でdeterministic生成。

## 4. Normalization
原典→内部:
- ProjectName/title系 → title
- OrganizationName → organization_name
- CftIssueDate → announced_at
- Category → category
- ProcedureType → procedure_type
- Certification → certification
- Location/City/region → location fields
- ProjectDescription → description
- Attachments → attachments_json
- ExternalDocumentURI等 → source_url
- TenderSubmissionDeadline → tender_submission_raw
- OpeningTendersEvent → opening_event_raw
- PeriodEndTime → period_end_raw

### Deadline Rule
v0.1初期では`deadline_at`を自動設定しないことを安全側デフォルトとする。公式仕様・個別原典から「応募/提出締切」であることをdeterministicに確定できるmappingを追加した場合のみ設定し、`deadline_source`も保存する。
UIはNULL時「期限：原典で確認」。

## 5. Search Algorithm
1. input normalize/length validate。
2. D1でfilters検索、limit+offset。
3. cache freshnessを確認。検索条件にq/org/regionがあり、最新取得から6時間以上または0件の場合のみupstream候補。
4. 同一queryの直近10分以内のsync_runs successがあればupstream skip。
5. upstream fetchは1回、Count<=30。
6. normalize transaction/upsert。
7. D1再検索。
8. `public_search` / `public_search_result_view`記録。

LIKE検索は`title`/`description`に限定し、limitを固定。M3のキャッシュ件数が増大した場合はFTS等を再評価する。

## 6. Opportunity Upsert
`INSERT ... ON CONFLICT(id) DO UPDATE`。
更新対象: 原典由来列、raw_hash、fetched_at、last_seen_at。
WATCH snapshotを上書きしない。
同期失敗時に既存案件をDELETEしない。

## 7. Profile Validation
- company_name trim 1..120
- industry 1..80
- services 2..1000
- regions JSON array 1..20
- employee_scale allowlist
- desired_project_size allowlist
- public_experience allowlist
- unified_qualification allowlist
- strengths <=1000
HTML/scriptをそのままinnerHTMLへ入れない。

## 8. Match Engine
### Tokenization
title/description/category/procedureをlowercase/全角空白正規化。profile services/strengthsも同様。日本語は単語分割に依存せず、設定済みdomain keywordsのsubstring一致を使用。

### Initial Score
- service/strength keyword overlap: +0..35
- region exact/prefecture match: +0..20
- category/procedure relevance: +0..15
- qualification known match: +15
- public experience: +0..10
- recent announcement: +0..5
合計0..100 clamp。

### Information Completeness
title/org/announced/category/procedure/certification/location/source_urlの取得率を重み付き計算。

### Decision
- GO: score>=70 かつ重大な「資格不明/地域不明」flagなし
- WATCH: score>=40 または重要条件不明
- NO-GO: score<40 かつ明確な低一致

資格が「不明」だけでNO-GOにしない。資格不一致も正式不適格とは断定せず`要確認`。

### Reasons
各加点/不明信号からテンプレート生成し、原典値を根拠として返す。LLM不要。

## 9. NEXT ACTION Engine
共通:
1. 公告原文を確認
2. 参加資格を確認
3. 質問期限を確認
4. 説明会の有無を確認
5. 提出資料を確認

条件追加:
- certification missing → `参加資格・必要資格を原典で確認`
- deadline_at null → `提出・質問期限を原典で確認`
- source_url missing → `発注機関名・案件名で原典を確認`
- profile qualification unknown → `自社の全省庁統一資格の状況を確認`

## 10. Home Aggregation
- recommendations: profileあり top 5
- new_items: announced_at desc top 5
- deadline_items: deadline_at non-null ascending top 5
- watch_items: own top 5
- today_actions: rule-based max 5
N+1を避け、必要数を限定する。

## 11. WATCH
POST:
- token hash
- opportunity existence
- INSERT OR IGNORE
- server event `watch_add`
DELETE:
- `DELETE WHERE client_key=? AND opportunity_id=?`
GET:
- JOIN opportunities、他client_keyは絶対に返さない。

## 12. Recent Views
`INSERT ... ON CONFLICT(client_key,opportunity_id) DO UPDATE SET viewed_at=excluded.viewed_at`。
P1 HOMEで直近10件。

## 13. Event Metadata Policy
Allowed keysをevent別に定義:
- public_search: `has_keyword,filter_count`
- result_view: `result_count,stale`
- detail: `decision`
- watch_add: metadataなし
- decision views: `score_band`
- ai_support_start: `question_type`（自由文は保存しない）
自由form metadata objectをそのままDBへ保存しない。

## 14. AI Guard（P1）
Prompt構成:
1. fixed system safety
2. source facts JSON
3. profile facts JSON
4. question

禁止:
- source factsにない期限/金額/資格の生成
- 「参加できます」「法的に問題ありません」等の保証
- source URL以外の架空source

回答末尾に`必ず原典で最終確認してください。`。

## 15. Security Headers
Pages `_headers`:
- Content-Security-Policy: default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'
- Referrer-Policy: strict-origin-when-cross-origin
- X-Content-Type-Options: nosniff
- Permissions-Policy: geolocation=(), camera=(), microphone=()

AI/公式APIはserver sideなのでconnect-srcへ外部host不要。

## 16. Privacy
無料版profileは匿名端末IDに紐付く会社情報であり、LP lead emailとは分離する。Privacy文に以下を追加:
- profile/WATCH/search/historyの利用目的
- localStorage匿名token使用
- API利用/非網羅性
- 削除はv0.1ではブラウザデータ消去 + 将来的なserver削除導線が必要。P0では`DELETE /api/profile`を追加して「無料版データを削除」機能をマイページに実装する。

## 17. Profile Delete
`DELETE /api/profile` Token required。
transaction:
- watch_items delete client
- recent_views delete client
- company_profiles delete client
- search_historyはclient_keyをNULL化または削除。v0.1は削除。
- eventsは匿名Evidenceとしてclient_keyをNULL化し保持可能（PIIなし）。
Browserは成功後localStorage tokenをrotateする。
破壊操作のためUIで確認を1回表示。

## 18. Scheduled Worker
Curated query: `AI OR システム OR DX OR Web OR RPA OR SaaS` を公式検索式仕様に合わせ複数小クエリへ分割可能。
- 1 triggerあたり最大3 upstream requests
- Count<=30/request
- 失敗はsync_runsへsummary
- 既存cache削除禁止

## 19. Performance Budgets
- App initial static assets < 250KB gzip目標（外部ライブラリなし）
- Search response <=50 items
- Home各section <=5
- D1 query count 50/invocationを超えない
- External API 1 user searchあたり<=1

## 20. Error Codes
- INVALID_INPUT 400
- TOKEN_REQUIRED 400
- TOKEN_INVALID 400
- PROFILE_REQUIRED 409
- NOT_FOUND 404
- UPSTREAM_UNAVAILABLE 503
- DB_UNAVAILABLE 503
- FREE_LIMIT 503
- AI_FREE_LIMIT 429/503

## 21. Observability
sync_runsとeventsを利用。機密/PIIをconsole logしない。外部API errorはstatus/codeだけ記録し、全文レスポンスを恒久保存しない。

## 22. P0/P1 Boundary
P0: search/list/detail/watch/profile/recommendation/decision/reasons/NEXT ACTION/events/mobile/PC/privacy/delete。
P1: deadline grouping/today refinements/recent UI/reason detail/readiness/Workers AI concierge。P0完了後BLOCKING 0なら同開発サイクルで追加する。
