# SETUP GUIDE｜公共営業 意思決定OS

- 文書ID: AIMOS-LP-SETUP-004
- 版数: v0.1
- 状態: CURRENT_FOR_CR004
- 対象構成: Cloudflare Pages + Pages Functions + D1 + GitHub Actions

## 1. Source
GitHub repository: `hukuyama1027-ai/public-sales-decision-os-lp`
Production branch: `main`
CR-003 rollback/comparison baseline: `baseline-cr003-production`

## 2. Cloudflare Pages
- Build command: `exit 0`
- Build output: `src`
- Pages Functions: repository `/functions`
- Production URL: https://public-sales-decision-os-lp.pages.dev/

## 3. D1
Binding name: `DB`。
Productionでは `/api/health` がidempotentなschema bootstrapを実行する。
CR-004は既存データを削除せず、`events.release_version`、`watch_items.source_hash_snapshot`等の必要な列/indexを追加する。

手動で `DROP` / 全件DELETE / DB再作成を行わない。

## 4. CR-004 migration確認
`GET /api/health`
期待値:
- `ok=true`
- `db=true`
- `version=0.1-cr004`
- `schema=cr004`

`migrated=true` は当該requestで適用、`false` は既に適用済みを表し、どちらも正常。

## 5. GitHub Actions
- `test.yml`: Automated Test
- `live-smoke.yml`: Production health/app/実案件検索
- `p0-e2e.yml`: synthetic profileを使ったProduction E2E、最後にcleanup
- `evidence-export.yml`: GitHub OIDCを使ったsanitized M3 Evidence export

Evidence workflowは長期shared secretを使わず `id-token: write` の短命OIDC tokenを使用する。

## 6. Evidence security
Production `/api/internal/evidence` は無認証アクセスを拒否する。
許可するOIDC claimは所定repository / main ref / evidence-export workflowに限定する。
出力へPII、company input、検索語、生session/client identifierを含めない。

## 7. Rollback
CR-004で重大障害が発生した場合、基準線 `baseline-cr003-production` をrollback sourceとして利用する。
ただしProduction ref変更前に障害影響・D1後方互換性を確認する。CR-004 schemaはadditiveであり、CR-003コードから追加列が存在しても基本動作を妨げない設計。

## 8. Cost
初期費用0円、月額固定費0円を前提としCloudflare/GitHub Free枠を優先する。有料化が必要な変更はユーザー承認前に実施しない。
