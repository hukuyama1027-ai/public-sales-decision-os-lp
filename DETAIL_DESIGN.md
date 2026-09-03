# DETAIL_DESIGN｜公共営業 意思決定OS｜CR-004

- 文書ID: AIMOS-LP-DD-001
- 版数: v0.3
- 状態: APPROVED_BY_AI_DESIGN
- 対応: AIMOS-CR-003 + AIMOS-CR-004 + Issue #7

CR-003 v0.2の検索adapter、normalizer、matcher、NEXT ACTION、安全境界は継続適用し、本書はCR-004で変更する実装詳細を上位化する。

## 1. App Release Constant
`lib/release.js`
```js
export const APP_RELEASE = 'cr004';
```
Browserからrelease値をevent APIへ自由指定させない。server-side `recordEvent()`がAPP_RELEASEをDBへ書く。

## 2. events Migration
`events.release_version TEXT NULL`追加。
既存行はNULLのまま保持。更新しない。
`recordEvent` INSERTへrelease_versionを追加。

## 3. watch_items Migration
`watch_items.source_hash_snapshot TEXT NULL`追加。
WATCH add時:
- opportunity.raw_hash取得
- source_hash_snapshotとして保存

WATCH read時:
`has_update = source_hash_snapshot IS NOT NULL AND current raw_hash IS NOT NULL AND source_hash_snapshot != current raw_hash`
legacy WATCHでsnapshot NULLの場合はfalse。

## 4. Profile Completion
入力項目9カテゴリ:
1 company_name
2 industry
3 services
4 regions
5 employee_scale
6 desired_project_size
7 public_experience
8 unified_qualification
9 strengths

入力あり数/9を5%単位で丸める。必須・任意の区別はUI説明に反映するが、能力評価ではない。
Response:
`profile_completion:{percent,missing_fields[]}`

## 5. Match Band
内部score/decisionを維持。
UI helper:
- GO → high
- WATCH → medium
- NO-GO → low
scoreを画面主要要素として表示しない。
API内部sortにはscoreを利用可能。

## 6. Feature Tags
deterministic source/profile dataからのみ生成。
Allowed examples:
- 新着
- 更新あり
- AI / Web / DX / RPA / SaaS（案件主題一致時）
- 資格要件あり
- 地域一致

禁止:
- 公共実績不要
- 説明会なし
- オンライン提出
- 小規模企業向け
等、構造化根拠がないtag。

## 7. Search Response Extension
各item:
```json
{
  "source": {...},
  "decision": {...}|null,
  "match_band": "high|medium|low|null",
  "watched": true,
  "has_update": false,
  "feature_tags": [],
  "reason_summary": [],
  "check_summary": []
}
```
profile/tokenなしでもsourceは返す。

Sort query:
- `sort=default|new|deadline|fit`
fitはprofile必須。profileなしはdefaultへfallback。
deadlineはNULLを末尾。

## 8. Home Response
`GET /api/home`:
```json
{
 "today_actions":[],
 "recommendations":[],
 "new_items":[],
 "deadline_items":[],
 "watch_updates":[],
 "os_suggestion":{},
 "profile_status":"complete|missing",
 "profile_completion":{}
}
```

### today_actions priority
1. has_update WATCH
2. GO recommendationの原典確認
3. profile incomplete
4. WATCHの原典確認
最大5。

### os_suggestion
LLMを使わないdeterministic suggestion。
AI生成と表記しない。

## 9. Card Rendering
DOM生成は`textContent`中心。innerHTMLへsource/user dataを入れない。
Card actionsは独立button/link。
GO primary action: application prep。

## 10. Detail Rendering
Order:
- decision hero
- summary reasons/checks
- source facts
- application prep/NEXT ACTION
- source link
- AI support P1

`application_prep_start`はGOカードCTAまたはDetailの応募準備CTA押下時に1回記録。
単にsectionが画面内に存在するだけでは記録しない。

## 11. Profile Event
PUT /api/profile:
- 既存profileなし → `company_profile_complete`
- 既存profileあり → `profile_update`
同一requestで二重eventを記録しない。

## 12. WATCH Event
- add → watch_add
- remove → watch_remove
既存watch_add名称を変更しない。

## 13. Evidence Aggregation SQL
日付windowをUTCで固定。
Raw rowを返さず以下のCOUNT/DISTINCTだけ実行。

Release分類:
`COALESCE(release_version,'legacy_cr003')`

主要計算:
- unique_sessions = COUNT(DISTINCT session_id)
- unique_product_users = COUNT(DISTINCT client_key) WHERE client_key IS NOT NULL
- searches_per_user = public_search count / distinct search client_key（0 denominator時null）
- search_to_detail_rate = distinct detail users / distinct search users
- detail_to_watch_rate = distinct watch_add users / distinct detail users
- repeat_users = client_key with COUNT(DISTINCT DATE(created_at)) >=2

rateは0〜1 number、denominator=0はnull。

## 14. OIDC JWT Verify
File: `lib/github-oidc.js`

### Parse
JWT 3 segments、base64url decode。
header.alg must `RS256`。
kid必須。

### JWKS
Fixed URL:
`https://token.actions.githubusercontent.com/.well-known/jwks`
User-provided JWKS URL禁止。
key.kid一致のRSA JWKをWebCrypto import。

### Verify
`RSASSA-PKCS1-v1_5`, SHA-256。

### Claims
- iss exact
- aud exact stringまたはarray contains audience
- repository exact
- ref exact `refs/heads/main`
- workflow_ref exact `.github/workflows/evidence-export.yml@refs/heads/main`
- exp > now - skew
- nbf <= now + skew
- iat not far future
Clock skew 60秒。

Invalid signature/claims: 403。
Malformed/missing token: 401。

## 15. Internal Evidence API
Path: `/api/internal/evidence.js`
GET only。
`days` allowlist 7,30,90 default30。
OIDC verify before D1 query。
Responseにraw IDsなし。
`cache-control:no-store`。

## 16. Evidence Workflow
`.github/workflows/evidence-export.yml`
- schedule daily UTC
- workflow_dispatch
- permissions contents:read,id-token:write
- OIDC request with audience
- curl bearer to Production endpoint
- jq `ok == true`
- upload-artifact

Token/JWTをechoしない。curl verbose禁止。

## 17. Schema Bootstrap
health bootstrap markerを`cr004`へ更新。
実行順:
1. schema_migrations table ensure
2. events release column existence確認
3. watch snapshot column existence確認
4. index必要なら作成
5. marker insert

SQLite `PRAGMA table_info`でcolumn存在を確認し、重複ALTERを避ける。

## 18. P0 UI CSS
- Home priority sections
- `.decision-banner`
- `.match-band`
- `.tag-list`
- `.reason-preview`
- `.prep-checklist`
- `.profile-progress`
- `.watch-update`
- mobile bottom nav

特定他社の配色/レイアウトをコピーしない。

## 19. Regression
既存LP、lead、pricing、診断、official search、matcher、profile、watch、recommendation、health/E2Eを必ず維持。

## 20. P1 Boundary
AI concierge、応募準備永続進捗、閲覧履歴UI、高度締切、準備度統合はP0 mergeを遅らせない。
