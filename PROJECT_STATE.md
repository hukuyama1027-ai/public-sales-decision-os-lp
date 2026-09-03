# PROJECT_STATE

- Project: 公共営業 意思決定OS｜需要検証LP + 無料版公共営業OS
- Active Change: AIMOS-CR-005 v0.1
- Parent Change: AIMOS-CR-004
- Phase: CR-005 / DEPLOY_RETRY / UAT_RECOVERY
- Progress: CR-005 Design 100% / Implementation 100% / Automated Test 100% / Production Deploy RETRYING / Human re-UAT PENDING
- Stable Production: CR-004 P0（Human UAT未受入）
- CR-005 Merge Commit: `c03d05c44d17792f9547b66a4377421e8f135be8`
- Rollback Baseline: `baseline-cr003-production` @ `e70182e343643cd738113df5e0e21a7d3ba67123`
- Public URL: https://public-sales-decision-os-lp.pages.dev/
- Free App URL: https://public-sales-decision-os-lp.pages.dev/app/
- CR-005 READY_TO_BUILD: PASS
- BLOCKING: 1（Production deployment未完了）
- Cost: Initial 0円 / Monthly Fixed 0円

## Human UAT Evidence
2026-09-03 user browser / smartphone:
- 検索結果が案件名なし・発注機関情報なしになる
- WATCH追加が `INVALID_INPUT`
- UIが簡素。イラスト/アイコンを増やしたい

Human Visual UAT = **FAIL / CHANGE_REQUIRED**。CR-004/CR-005 DONE禁止。

## Root Cause / Fix
旧UIがflat KKJ opportunityの `source: "kkj"` をnested objectと誤認していた。
CR-005で型判定adapter、WATCH id guard、browser-facing regression、オリジナルinline SVG/CSS visual layerを実装済み。

## Automated Evidence
- PR #17 merged
- Automated Test: **109 PASS / 0 FAIL**
- CR-003 regression: PASS
- CR-004 regression: PASS
- CR-005 adapter/WATCH/visual regression: PASS

## Deployment Incident
- Issue #18: `DEPLOY-CR005-001`
- Failed target commit: `c03d05c44d17792f9547b66a4377421e8f135be8`
- Cloudflare deployment id: `d02206c0-916d-4949-97b2-c48697437323`
- Cloudflare check: FAILURE
- GitHub test: SUCCESS
- Initial live-smoke/production-e2e ran before CR-005 static deployment completed and therefore are not accepted as CR-005 Production evidence.
- live-smoke log proved old `公共営業OS CR-004` HTML was still served at 10:08:27Z.

## Retry Decision
Runtime code / Functions / D1 / wranglerの追加変更は行わず、formal state commitによるmain pushで同一runtime成果物を再deployする。

再deploy SUCCESSの場合:
- CR-005 marker/visual CSSのProduction配信確認
- Production E2E再実行
- Human Visual UAT再試験

再deploy FAILの場合:
- Cloudflare dashboard build log取得を外部BLOCKERとして具体エラーに基づき修正する。

## Current Task
**Cloudflare Pages retry → CR-005 Production marker確認 → post-deploy smoke/E2E → Human re-UAT**

## P1 Remaining（CR-005 blockerではない）
- AI公共営業コンシェルジュ
- 応募準備の永続進捗
- 閲覧履歴UI
- 高度締切管理
- 公共営業準備度
- 高度な今日やること
- 発注機関研究
