# API_DESIGN｜公共営業 意思決定OS CR-004

- 文書ID: AIMOS-LP-API-001
- 版数: v0.2
- 状態: APPROVED_BY_AI_DESIGN

既存CR-003 APIを維持し、以下を追加/拡張する。

## 1. GET /api/home
追加response:
- `today_actions[]`
- `watch_updates[]`
- `os_suggestion`
- `profile_completion`

recommendations/new/deadline/watch既存構造は後方互換を維持する。

## 2. GET /api/opportunities/search
追加query:
- `sort=default|new|deadline|fit`

各itemをUI view model化:
- source
- decision
- match_band
- watched
- has_update
- feature_tags
- reason_summary
- check_summary

profileなし時decision/match_band=null。
fit sortはprofileなし時default。

## 3. GET /api/opportunities/:id
既存source/decision/next_actionsを維持。
追加:
- match_band
- watched
- has_update
- feature_tags
- application_prep: `{available:boolean,items:[]}`

## 4. GET /api/watch
各itemへ`decision/match_band/has_update`を付加可能。

## 5. POST /api/watch
保存時`source_hash_snapshot=opportunity.raw_hash`。
watch_add event。

## 6. DELETE /api/watch/:id
watch_remove eventを追加。

## 7. GET/PUT /api/profile
GET responseへ`profile_completion`。
PUT:
- 新規: company_profile_complete
- 更新: profile_update

## 8. POST /api/event
既存allowlist維持。
追加:
- application_prep_start
- profile_update
- watch_remove

release_versionはrequest bodyから受理せずserverで付与。

## 9. GET /api/internal/evidence
### Authentication
Authorization: Bearer `<GitHub Actions OIDC JWT>`

### Query
`days=7|30|90` default30。

### Success
集計値のみ。
- overall
- releases.legacy_cr003
- releases.cr004
- window/generated_at

### Failure
- 401 TOKEN_REQUIRED/MALFORMED
- 403 OIDC_INVALID
- 400 INVALID_DAYS
- 503 JWKS_UNAVAILABLE/DB_UNAVAILABLE

### Security
- GET only
- no CORS public access expansion
- no raw rows
- no arbitrary dimensions
- no opportunity/search keyword/profile values

## 10. GitHub OIDC Claims
expected:
- iss `https://token.actions.githubusercontent.com`
- aud `aimos-public-sales-evidence`
- repository `hukuyama1027-ai/public-sales-decision-os-lp`
- ref `refs/heads/main`
- workflow_ref `hukuyama1027-ai/public-sales-decision-os-lp/.github/workflows/evidence-export.yml@refs/heads/main`

## 11. Event Aggregation Definitions
- search_users: distinct client_key on public_search
- searches_per_user: public_search/search_users
- detail_users: distinct client_key on opportunity_detail_view
- search_to_detail_rate: detail_users/search_users
- watch_users: distinct client_key on watch_add
- detail_to_watch_rate: watch_users/detail_users
- repeat_users: client_key with events on >=2 dates
- release split: COALESCE(release_version,'legacy_cr003')

0 denominator => null rate。
