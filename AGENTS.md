# AGENTS.md

## Project
公共営業 意思決定OS｜需要検証LP + 無料版公共営業OS

## Active Baseline / Change
- Production baseline: `baseline-cr003-production` @ `e70182e343643cd738113df5e0e21a7d3ba67123`
- Active Change: AIMOS-CR-004 v0.1
- Target branch: `cr-004-ui-ux-v0.1`

## Source of Truth Priority
1. CHANGE_REQUEST_CR-004.md
2. REQUIREMENTS.md v0.4
3. CHANGE_IMPACT_CR-004.md
4. BASIC_DESIGN.md v0.3
5. UI_DESIGN.md v0.3
6. SCREEN_FLOW.md
7. DB_DESIGN.md v0.2
8. API_DESIGN.md v0.2
9. DATA_FLOW.md v0.2
10. DETAIL_DESIGN.md v0.3
11. EVIDENCE_EXPORT_DESIGN.md
12. SECURITY_REVIEW.md v0.2
13. TEST_PLAN.md v0.3
14. PROJECT_STATE.md
15. HANDOFF.md

CR-003 baselineの機能/安全境界は、CR-004が明示的に変更しない限り継続。

## Non-negotiable
- CR-003 Production機能と既存Eventを壊さない。
- 既存D1行をmigrationで削除/書換しない。
- deadline推測禁止。
- 原典情報とOS/AI参考情報を分離。
- 正式参加可否/法的適格性を保証しない。
- 競合サービスデータを取得しない。
- 固定費0円。Paid導入は承認なし禁止。
- 求人サイトの具体デザイン/コードをコピーしない。

## CR-004 UI Rules
- Homeは今日やること→おすすめ→新着→締切間近→WATCH更新→提案。
- CardsはGO/WATCH/NO-GO、match band、理由、要確認、WATCH、応募準備CTA。
- exact scoreを主要UIにしない。
- feature tagは根拠があるものだけ。
- AI未実装機能をAI出力済みと見せない。

## Evidence Rules
- release_versionはserver-side `cr004`。
- event名を既存から変更しない。
- Evidence APIはGitHub Actions OIDC限定。
- raw IDs/session/search/profile/emailをexportしない。
- arbitrary SQL/filter/dimensionを提供しない。
- JWTのissuer/audience/repository/ref/workflow/signatureを検証。

## Implementation Order
1. DB migration/schema bootstrap
2. release/event helpers
3. watch update/profile completion/view model APIs
4. Home/Search/Detail/WATCH/Profile UI
5. Evidence aggregate API + OIDC verify
6. Evidence workflow
7. tests
8. P0 gate
9. main merge / Production UAT

## Completion
TEST_PLAN Exit Criteria + Production System UAT。Human Visual UAT結果を明示するまでDONEにしない。
