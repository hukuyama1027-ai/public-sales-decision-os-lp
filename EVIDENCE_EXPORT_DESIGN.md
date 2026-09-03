# EVIDENCE_EXPORT_DESIGN｜AI経営OS向け安全なEvidence自動取得

- 文書ID: AIMOS-LP-EVEXP-001
- 版数: v0.1
- 状態: APPROVED_BY_AI_DESIGN
- Related: GitHub Issue #7 / AIMOS-CR-004

## 1. 目的
代表本人がCloudflare D1を毎回開かず、AI経営OSがM3集計EvidenceをGitHub経由で取得できるようにする。

## 2. 採用方式
GitHub Actions OIDC → Cloudflare認証済み集計API → GitHub Actions Artifact。
長期shared secretを使わない。

## 3. 認証
Workflow:
- permissions: contents: read, id-token: write
- audience: `aimos-public-sales-evidence`
- GitHub OIDC providerから短命JWT取得

Cloudflare Function検証:
- alg=RS256
- kidをGitHub fixed JWKSから解決
- signature verify via WebCrypto
- iss=`https://token.actions.githubusercontent.com`
- aud=`aimos-public-sales-evidence`
- repository=`hukuyama1027-ai/public-sales-decision-os-lp`
- ref=`refs/heads/main`
- workflow_ref=`hukuyama1027-ai/public-sales-decision-os-lp/.github/workflows/evidence-export.yml@refs/heads/main`
- exp/nbf/iatを妥当範囲確認

JWT内のURL指定(jku/x5u等)は使わない。JWKS endpointはコード固定。

## 4. API
`GET /api/internal/evidence?days=7|30|90`

Response例:
```json
{
  "ok": true,
  "generated_at": "...",
  "window": {"days": 7, "from": "...", "to": "..."},
  "releases": {
    "legacy_cr003": {...},
    "cr004": {...}
  },
  "overall": {...}
}
```

## 5. 集計値
- unique_sessions
- unique_product_users（client_key non-null）
- profile_complete
- profile_update
- public_search
- search_users
- searches_per_user
- search_result_views
- detail_views
- search_to_detail_rate
- watch_add
- watch_remove
- detail_to_watch_rate
- recommendation_views
- go_view/watch_view/no_go_view
- next_action_view
- application_prep_start
- repeat_users（2以上のdistinct利用日）
- LP page_view/cta/diagnosis/pricing/usage_interest
- lead_count
- lead price_interest distribution（plan別countのみ）

## 6. Privacy
返してはいけない:
- client_key値
- session_id値
- email/company_name/services/regions
- search keyword
- opportunity title/id単位の行動履歴
- IP/User-Agent
- raw event rows

集計だけを返す。

## 7. Release比較
events.release_version:
- CR-004コード: `cr004`
- legacy NULL: `legacy_cr003`

CR-003/CR-004のevent名を変更しないため、同KPIをrelease別に比較できる。

## 8. Rate/Scope
- days allowlist: 7/30/90
- endpoint GETのみ
- OIDC auth failure時DB queryしない
- request bodyなし
- SQLは固定queryのみ
- 最大1回/日scheduled + manual workflow程度

## 9. Workflow Artifact
`.github/workflows/evidence-export.yml`
- schedule: daily
- workflow_dispatch
- fetch OIDC token
- call endpoint
- validate `ok=true`
- save `evidence.json`
- `actions/upload-artifact@v4`
- artifact name: `m3-evidence-<run_id>`
- retention-days: 30

## 10. AI経営OS取得
AI経営OSはGitHub connectorで:
1. 最新`evidence-export` workflow run確認
2. artifact取得
3. evidence.jsonをCURRENT STATE/KPI/EVIDENCEへ反映

D1の直接read権限やCloudflare tokenはAI経営OSへ渡さない。

## 11. Audit
GitHub Actions run ID、timestamp、commit SHAが監査証跡となる。
API responseにも`source_release`と`generated_at`を含める。

## 12. Failure
- OIDC verify failure → 401/403
- JWKS fetch failure → 503
- D1 failure → 503
- artifact upload failure → workflow FAIL、Production public機能には影響なし
- 0 events → 0を返してよいのは「集計期間内でSQL上0」と確認できた場合のみ

## 13. Cost
Cloudflare/GitHub Free枠。固定費0円。
