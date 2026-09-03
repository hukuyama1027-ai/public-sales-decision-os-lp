# TEST RESULT｜AIMOS-CR-004

- 文書ID: AIMOS-LP-TR-004
- 版数: v0.1
- 状態: PASS / PRODUCTION SYSTEM TEST COMPLETE
- 実施日: 2026-09-03
- Production URL: https://public-sales-decision-os-lp.pages.dev/
- Free App URL: https://public-sales-decision-os-lp.pages.dev/app/
- Production Code Baseline: `35d0a68c7955131fd2bb96ddfd0fbe98c4932ca4`
- CR-003 Rollback Baseline: `baseline-cr003-production` @ `e70182e343643cd738113df5e0e21a7d3ba67123`

## 1. 総合判定

**PASS / BLOCKING 0 / P0重大不具合 0**

AIMOS-CR-004のP0実装について、Automated Test、Cloudflare Production smoke、Production E2E、D1 schema、実官公需案件検索、OIDC Evidence exportを実行し、必須System TestはPASSした。

Human Visual UATは人間受入のため本書のPASSでは代替せず、別成果物 `HUMAN_VISUAL_UAT_CR004.md` でPENDING管理する。

## 2. Automated Test

最終確認:
- Tests: **102**
- PASS: **102**
- FAIL: **0**
- CANCELLED: 0
- SKIPPED: 0

主な確認対象:
- CR-003回帰
- 官公需API XML normalization / URL / error handling
- 公共案件判定 / match band / NEXT ACTION
- Profile / WATCH / Home / Recommendations
- CR-004求人サイト型UI静的要件
- 44px相当interaction target / focus-visible
- semantic WATCH fingerprint
- additive D1 migration
- release_versionによるCR-003/CR-004比較
- Evidence funnel intersection
- synthetic session除外
- OIDC署名・issuer・audience・repository・ref・workflow・期限・改ざん拒否
- Evidence endpoint無認証拒否

## 3. Production Live Smoke

GitHub Actions run: `33734876649` / SUCCESS

確認結果:
- `/api/health`: PASS
- `db=true`: PASS
- `schema=cr004`: PASS
- `version=0.1-cr004`: PASS
- CR-004 app shell: PASS
- 実官公需案件検索: PASS

D1 migrationはProductionで適用済み。既存データを破壊しないadditive migrationである。

## 4. Production P0 E2E

GitHub Actions run: `33734876525` / SUCCESS

synthetic anonymous profileを用いてProduction上で以下を通し確認した。
- Profile登録: PASS
- 実公共案件検索: PASS
- 案件詳細: PASS
- GO / WATCH / NO-GO: PASS
- match band: PASS
- 判定理由 / 要確認: PASS
- NEXT ACTION: PASS
- 軽量応募準備view model: PASS
- WATCH追加: PASS
- WATCH永続化 / 一覧: PASS
- Recommendations品質: PASS
- Home profile completion / today actions / WATCH updates / OS suggestion: PASS
- synthetic test data cleanup: PASS

Production E2Eは `p0-e2e-*` session classを使用し、市場Evidence集計から除外する。

## 5. Evidence Export

GitHub Actions run: `33735462738` / SUCCESS

Artifact:
- Name: `m3-evidence-33735462738`
- Artifact ID: `9885535710`
- Digest: `sha256:4c97625504978abca7607b4cf7a8872dc073cba51e55f51e0725c515bebb6b44`
- Retention: 30 days

確認結果:
- GitHub Actions OIDC取得: PASS
- Production Evidence API認証: PASS
- sanitized aggregate取得: PASS
- artifact upload: PASS
- 長期shared secret: 不使用
- 禁止raw field: 未検出

禁止対象:
`client_key`, `session_id`, `company_name`, `email`, `services`, `keyword`

## 6. Evidence Integrity Hotfix

Issue #10を正式修正済み。

市場Evidenceから以下を除外する。
- `anonymous`
- `server`
- `p0-e2e-*`
- `live-smoke-*`

raw event自体は監査・障害解析用に保持する。

## 7. 未実施 / 別Gate

未実施なのは **Human Visual UAT** のみ。

AI側System Testで代替しない。ユーザー本人が主要画面・主要導線を確認し、PASS / CONDITIONAL PASS / FAILを判定する。
