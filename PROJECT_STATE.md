# PROJECT_STATE

- Project: 公共営業 意思決定OS｜需要検証LP + 無料版公共営業OS
- Production Baseline: `baseline-cr003-production` @ `e70182e343643cd738113df5e0e21a7d3ba67123`
- Active Change: AIMOS-CR-004 v0.1
- Goal: CR-003実機能を維持し、求人サイト型UI/UXへ再設計してM3利用Evidenceを改善・比較可能にする
- Phase: BUILDING / CR-004
- Progress: Design Gate 100% / Implementation IN_PROGRESS
- Stable Production: CR-003 P0 / SYSTEM UAT PASS
- Public URL: https://public-sales-decision-os-lp.pages.dev/
- Free App URL: https://public-sales-decision-os-lp.pages.dev/app/
- READY_TO_BUILD: PASS（AIMOS-LP-RTB-004 v0.1）
- BLOCKING: 0

## Completed
AIMOS-MGMT-SYNC-003確認、CR-003 baseline固定、CR-004/Issue #7受領、影響分析、REQUIREMENTS/BASIC/UI/SCREEN_FLOW/DB/API/DATA_FLOW/DETAIL/EVIDENCE_EXPORT/SECURITY/TEST_PLAN/AGENTS/HANDOFF更新、READY_TO_BUILD PASS。

## Current Task
CR-004 P0実装 → Automated Test → P0 Gate。

## Technical Decisions
- CR-003検索/判定/D1を継続
- Homeを今日やること中心へ再構成
- match scoreはband主表示
- WATCH更新はsource hash差分
- Profile完成度は入力充足率
- NEXT ACTIONをP0軽量応募準備チェックへ
- events.release_version=cr004 server-side
- Evidence集計はGitHub Actions OIDC→認証集計API→Actions Artifact
- 長期shared secret不要

## Pending
CR-004実装、Automated Test、P0 Gate、main merge、Cloudflare deploy、schema cr004、System UAT、OIDC Evidence export実証、Human Visual UAT、manual同期、AIMOS-MGMT-SYNC-004。

## P1 Remaining
AI公共営業コンシェルジュ、応募準備永続進捗、閲覧履歴UI、高度締切管理、公共営業準備度、高度今日やること、発注機関研究。

## Cost
Initial 0円 / Monthly Fixed 0円。
