# PROJECT_STATE

- Project: 公共営業 意思決定OS｜需要検証LP + 無料版公共営業OS
- Active Change: AIMOS-CR-005 v0.1
- Parent Change: AIMOS-CR-004
- Phase: CR-005 / PRE_MERGE_PASS / UAT_RECOVERY
- Progress: CR-004 System UAT 100% / Human Visual UAT FAIL / CR-005 Design 100% / Implementation 100% / Automated Test 100%
- Stable Production: CR-004 P0（Human UAT未受入）
- Production Runtime Commit: `35d0a68c7955131fd2bb96ddfd0fbe98c4932ca4`
- Formal Main Head before CR-005: `bffa99d787164c14e66f84ccf809f56394e94afc`
- Rollback Baseline: `baseline-cr003-production` @ `e70182e343643cd738113df5e0e21a7d3ba67123`
- Public URL: https://public-sales-decision-os-lp.pages.dev/
- Free App URL: https://public-sales-decision-os-lp.pages.dev/app/
- CR-005 READY_TO_BUILD: PASS
- BLOCKING: 0
- Cost: Initial 0円 / Monthly Fixed 0円

## Human UAT Evidence
2026-09-03 user browser / smartphone:
- 検索結果が案件名なし・発注機関情報なしになる
- WATCH追加が `INVALID_INPUT`
- UIが簡素。イラスト/アイコンを増やしたい

Human Visual UAT = **FAIL / CHANGE_REQUIRED**。
CR-004 DONE禁止。

## Root Cause
`src/app/app.js` の旧 `normalizeCard()` がflat opportunityの `source: "kkj"` をnested objectと誤認し、item id/title/organizationを失っていた。

この1原因から、カード空表示とWATCH invalid inputが連鎖した。

## CR-005 Implemented
- `src/app/ui-adapter.js`: flat/nested opportunity shapeを型で判定
- valid opportunity id validation
- WATCH request bodyの防御
- WATCH `aria-pressed` state
- invalid data時の安全なfallback/disabled操作
- Home/Search/WATCH/Profile/AIのオリジナルinline SVG illustration
- card/search/profile/mobile visual refinement
- 外部画像/CDN/有料asset追加なし
- CR-005 browser-facing regression test追加

## Automated Evidence
- PR #17
- GitHub Actions run: `33742326914`
- Automated Test: **109 PASS / 0 FAIL**
- CR-003 regression: PASS
- CR-004 regression: PASS
- CR-005 flat/nested adapter: PASS
- WATCH request body/id guard: PASS
- UI visual layer/static regression: PASS
- Evidence/OIDC regression: PASS

## Current Task
**main統合 → Cloudflare Production deploy → Production search/WATCH E2E → Human Visual UAT再試験**

## Remaining Acceptance Gate
1. Production反映確認
2. 実案件id/title/発注機関表示確認
3. WATCH add/list/remove Production確認
4. Human Visual UAT再実施
5. User acceptance

## P1 Remaining（CR-005 blockerではない）
- AI公共営業コンシェルジュ
- 応募準備の永続進捗
- 閲覧履歴UI
- 高度締切管理
- 公共営業準備度
- 高度な今日やること
- 発注機関研究
