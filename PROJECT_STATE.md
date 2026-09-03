# PROJECT_STATE

- Project: 公共営業 意思決定OS｜需要検証LP + 無料版公共営業OS
- Active Change: AIMOS-CR-005 v0.1
- Parent Change: AIMOS-CR-004
- Phase: CR-005 / READY_TO_BUILD / UAT_RECOVERY
- Progress: CR-004 System UAT 100% / Human Visual UAT FAIL / CR-005 Design 100% / Implementation 0%
- Stable Production: CR-004 P0（Human UAT未受入）
- Production Runtime Commit: `35d0a68c7955131fd2bb96ddfd0fbe98c4932ca4`
- Formal Main Head before CR-005: `bffa99d787164c14e66f84ccf809f56394e94afc`
- Rollback Baseline: `baseline-cr003-production` @ `e70182e343643cd738113df5e0e21a7d3ba67123`
- Public URL: https://public-sales-decision-os-lp.pages.dev/
- Free App URL: https://public-sales-decision-os-lp.pages.dev/app/
- CR-005 READY_TO_BUILD: PASS
- BLOCKING: 0
- P0重大不具合: 2件の症状 / 共通root cause特定済み
- Cost: Initial 0円 / Monthly Fixed 0円

## Human UAT Evidence
2026-09-03 user browser / smartphone:
- 検索結果が案件名なし・発注機関情報なしになる
- WATCH追加が `INVALID_INPUT`
- UIが簡素。イラスト/アイコンを増やしたい

Human Visual UAT = **FAIL / CHANGE_REQUIRED**。
CR-004 DONE禁止。

## Root Cause
`src/app/app.js` `normalizeCard()` がflat opportunityの `source: "kkj"` をnested objectと誤認し、item id/title/organizationを失う。

この1原因から、カード空表示とWATCH invalid inputが連鎖した。

## CR-005 Artifacts
- CHANGE_REQUEST_CR-005.md
- CHANGE_IMPACT_CR-005.md
- UI_DESIGN_CR005.md
- TEST_PLAN_CR005.md
- READY_TO_BUILD_CR005.md
- Issue #16

## Current Task
**CR-005 implementation → automated regression → Production E2E → Human Visual UAT再試験**

## Implementation Scope
1. flat/nested opportunity normalization修正
2. WATCH id validation / aria state
3. browser-facing regression tests
4. Home/Search/Profile/Bottom Navのvisual enrichment
5. inline SVG/CSSのみ、外部assetなし
6. CR-003/CR-004 regression
7. Production deploy
8. Search→card→WATCH add/list/remove Production test

## P1 Remaining（CR-005 blockerではない）
- AI公共営業コンシェルジュ
- 応募準備の永続進捗
- 閲覧履歴UI
- 高度締切管理
- 公共営業準備度
- 高度な今日やること
- 発注機関研究
