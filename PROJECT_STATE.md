# PROJECT_STATE

- Project: 公共営業 意思決定OS｜需要検証LP + 無料版公共営業OS
- Goal: 小規模IT企業向けの公共営業OSを0円構成で公開し、実案件検索・判断・WATCH・次行動の利用Evidenceを取得してM3市場検証へ進める
- Active Change: AIMOS-CR-005 v0.1
- Parent Change: AIMOS-CR-004
- Phase: CR-005 / HUMAN_RE_UAT_PARTIAL_PASS
- Progress: Design 100% / Implementation 100% / Automated Test 100% / Production Deploy 100% / Production Technical E2E PASS / Human re-UAT PARTIAL PASS
- Stable Version: CR-004 P0（旧Human UAT不受入）
- Development Version: CR-005 Production Candidate
- Production Main Head: `a67e29023cd7f5afd06f908b552f94e18008a118`
- Runtime Implementation Merge: `c03d05c44d17792f9547b66a4377421e8f135be8`
- Rollback Baseline: `baseline-cr003-production` @ `e70182e343643cd738113df5e0e21a7d3ba67123`
- Public URL: https://public-sales-decision-os-lp.pages.dev/
- Free App URL: https://public-sales-decision-os-lp.pages.dev/app/
- Current Task: Human Visual re-UAT final visual acceptance + requirements re-baseline planning
- Completed Tasks: CR-005設計、READY_TO_BUILD、実装、109/109自動試験、main統合、Cloudflare Production再deploy、Production smoke、Production P0 E2E、案件表示/WATCH技術確認、Human re-UATで案件名・発注機関表示PASS、WATCH登録・反映PASS
- Pending Tasks: UI/イラストのHuman Visual受入、UAT結果正式化、要件再ベースライン、M3 Evidence integrity修正、M3 Evidence蓄積・評価
- Open Questions: なし
- Change Requests: AIMOS-CR-005 v0.1（Human UAT改善対応）
- Issues: DEPLOY-CR005-001 / Issue #18 = CLOSED / RESOLVED; Requirements Re-baseline / Issue #24 = OPEN
- Blockers: 0（技術BLOCKERなし。受入GateとしてUI/イラストHuman Visual判定待ち）
- Risks: UI追加改善が必要になる可能性、M3実利用母数不足、実利用KPI未集計期間の誤推測、官公需API/D1 Free枠依存、現行要件と最新事業モデルの不整合
- Cost: Initial 0円 / Monthly Fixed 0円（Free枠内）
- Owner Hours: UNKNOWN / 未計測。推測禁止。
- Last Updated: 2026-09-04
- Next Action: UI/イラストをHuman Visual受入 → requirements v1.0再ベースライン → Evidence計測整備 → M3市場検証開始

## Human UAT Evidence
2026-09-03 user browser / smartphoneでCR-004に対し以下を確認。
- 検索結果が案件名なし・発注機関情報なしになる
- WATCH追加が `INVALID_INPUT`
- UIが簡素。イラスト/アイコンを増やしたい

Human Visual UAT = **FAIL / CHANGE_REQUIRED** とし、CR-005を起票・実装した。

2026-09-04 CR-005 Human re-UATで以下をユーザー確認。
- 案件名・発注機関が正常表示される: **PASS**
- WATCHが正常登録・反映される: **PASS**
- UI/イラストの需要検証用としての受入: **PENDING**

Human re-UAT = **PARTIAL PASS / VISUAL ACCEPTANCE PENDING**。

## CR-005 Root Cause / Fix
旧UIがflat KKJ opportunityの `source: "kkj"` をnested objectと誤認し、item id/title/organizationを失っていた。

CR-005で以下を実装済み。
- flat/nested opportunity shape adapter
- valid opportunity id validation
- WATCH request body guard
- WATCH accessibility state
- invalid data時の安全なfallback
- Home/Search/WATCH/Profile/AIのオリジナルinline SVG illustration
- card/search/profile/mobile visual refinement
- 外部画像/CDN/有料asset追加なし

## Automated Evidence
- PR #17 merged
- Automated Test: **109 PASS / 0 FAIL**
- CR-003 regression: PASS
- CR-004 regression: PASS
- CR-005 adapter/WATCH/visual regression: PASS

## Production Evidence
- Cloudflare Pages retry deployment: SUCCESS
- Deployment id: `c338448f-ba62-468a-97ba-5745acf0b17c`
- Production HTMLで `application-name="公共営業OS CR-005"` を確認
- Production HTMLで `/app/visual-cr005.css` 読込を確認
- Post-deploy live-smoke rerun job `100610621995`: SUCCESS
- Post-deploy production-e2e rerun job `100610651453`: SUCCESS
- 実案件検索: title / id / organization_name取得 PASS
- WATCH add: PASS
- WATCH list/persistence: PASS
- cleanup: PASS
- Issue #18: CLOSED / RESOLVED

## M3 KPI Definitions
正式集計値がない期間は推測・0補完しない。
- unique anonymous users
- unique sessions
- profile completions / profile updates
- search users
- search count / searches per user
- search → detail rate
- detail → WATCH rate
- recommendation views
- GO/WATCH/NO-GO distribution
- NEXT ACTION views
- application prep starts
- repeat usage
- LP CTA / diagnosis / pricing / usage interest / lead count

## P1 Remaining（CR-005 blockerではない）
- AI公共営業コンシェルジュ
- 応募準備の永続進捗
- 閲覧履歴UI
- 高度締切管理
- 公共営業準備度
- 高度な今日やること
- 発注機関研究

## Requirements Re-baseline
現行 `REQUIREMENTS.md v0.4` はCR-003/004 P0の実装要件として有効だが、最新の事業モデル全体（GovReach型Inbound集客 / SaaS収益 / AI意思決定 + AI伴走支援 / 求人サイト型UI/UX / Free→Paid導線）を十分に表現していない。

Issue #24で `REQUIREMENTS RE-BASELINE REQUIRED` をPROPOSALとして登録済み。現Productionを保全しつつ、BUSINESS_MODEL_SPEC / PRODUCT_CONCEPT / CUSTOMER_JOURNEY / FREE-PAID FEATURE MATRIX / SUPPORT MODEL / M3 EXIT CRITERIA / REQUIREMENTS v1.0 を再定義する。