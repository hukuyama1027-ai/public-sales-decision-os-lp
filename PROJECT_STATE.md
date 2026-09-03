# PROJECT_STATE

- Project: 公共営業 意思決定OS｜需要検証LP + 無料版公共営業OS
- Active Change: AIMOS-CR-004 v0.1
- Phase: PRODUCTION / SYSTEM_UAT_PASS / HUMAN_VISUAL_UAT_PENDING
- Progress: Design 100% / Implementation 100% / Automated & System UAT 100% / Human Visual UAT PENDING
- Stable Production: CR-004 P0
- Production Commit: `35d0a68c7955131fd2bb96ddfd0fbe98c4932ca4`
- Rollback Baseline: `baseline-cr003-production` @ `e70182e343643cd738113df5e0e21a7d3ba67123`
- Public URL: https://public-sales-decision-os-lp.pages.dev/
- Free App URL: https://public-sales-decision-os-lp.pages.dev/app/
- READY_TO_BUILD: PASS（AIMOS-LP-RTB-004 v0.1）
- P0 BUILD GATE: PASS（AIMOS-LP-GATE-004 v0.1）
- BLOCKING: 0
- P0重大不具合: 0
- Cost: Initial 0円 / Monthly Fixed 0円

## Completed

- AIMOS-MGMT-SYNC-003受領
- CR-003 Production baseline固定
- AIMOS-CR-004 Product Decision承認
- REQUIREMENTS / BASIC / UI / SCREEN_FLOW / DB / API / DATA_FLOW / DETAIL / SECURITY / TEST_PLAN更新
- READY_TO_BUILD PASS
- CR-004 P0実装
- semantic WATCH update
- 求人サイト型Home / card / detail / WATCH / profile / NEXT ACTION
- release_version=cr004 Evidence segmentation
- GitHub Actions OIDC Evidence export
- main統合
- Cloudflare Production deploy
- D1 schema `cr004` migration
- Automated Test 102/102 PASS
- Production live-smoke PASS
- Production P0 E2E PASS
- Evidence integrity hotfix（Issue #10）完了
- OIDC Evidence export実証（Issue #7）完了
- sanitized Evidence artifact実査PASS

## Latest Evidence

### Automated / System
- Automated Test: **102 PASS / 0 FAIL**
- live-smoke: `33734876649` / SUCCESS
- Production P0 E2E: `33734876525` / SUCCESS
- Evidence export: `33735462738` / SUCCESS
- Evidence Artifact ID: `9885535710`
- Evidence Artifact Digest: `sha256:4c97625504978abca7607b4cf7a8872dc073cba51e55f51e0725c515bebb6b44`

### M3 Evidence Snapshot
Generated: 2026-09-03T08:49:47.466Z / 30 days / market sessions only

legacy_cr003:
- unique_sessions: 14
- unique_product_users: 1
- public_search: 2
- search_users: 1
- watch_add: 1
- page_view: 13
- cta_click: 3
- diagnosis_start: 2
- diagnosis_complete: 2
- usage_interest: 2

Overall lead:
- lead_count: 2
- lead_usage_interest: 2

cr004:
- 実ユーザーEvidence: 0（公開直後のため）

CR-004の市場価値は現時点では未判定。0件を需要なしと解釈せず、今後の実利用EvidenceをCR-003 baselineと比較する。

## Current Task

**Human Visual UAT → ユーザー正式受入判定**

ユーザー作業は `HUMAN_VISUAL_UAT_CR004.md` の5項目のみ。

## Pending

1. Human Visual UAT
2. 問題があればIssue / CR化 → 修正 → 回帰
3. 問題がなければユーザー正式受入
4. 正式受入後にAIMOS-CR-004をDONEへ更新

## P1 Remaining

- AI公共営業コンシェルジュ
- 応募準備の永続進捗
- 閲覧履歴UI
- 高度締切管理
- 公共営業準備度
- 高度な今日やること
- 発注機関研究

P1はCR-004 P0受入のBLOCKERではない。
