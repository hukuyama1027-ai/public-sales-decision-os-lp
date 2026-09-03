# READY_TO_BUILD｜AIMOS-CR-004

- 文書ID: AIMOS-LP-RTB-004
- 版数: v0.1
- 状態: PASS
- 判定日: 2026-09-03
- 対象: CR-003 Productionを基準線としたCR-004 UI/UX + Evidence Export

## Gate Checklist
| Gate | Artifact / Result | Status |
|---|---|---|
| CR-003 Production baseline | `baseline-cr003-production` @ e70182e | PASS |
| CR-004 | CHANGE_REQUEST_CR-004.md | PASS |
| Impact Analysis | CHANGE_IMPACT_CR-004.md | PASS |
| Requirements | REQUIREMENTS.md v0.4 | PASS |
| Basic Design | BASIC_DESIGN.md v0.3 | PASS |
| UI Design | UI_DESIGN.md v0.3 | PASS |
| Screen Flow | SCREEN_FLOW.md v0.1 | PASS |
| DB Design | DB_DESIGN.md v0.2 | PASS |
| API Design | API_DESIGN.md v0.2 | PASS |
| Data Flow | DATA_FLOW.md v0.2 | PASS |
| Detail Design | DETAIL_DESIGN.md v0.3 | PASS |
| Evidence Export Design | EVIDENCE_EXPORT_DESIGN.md v0.1 | PASS |
| Security Review | SECURITY_REVIEW.md v0.2 PASS_WITH_CONTROLS | PASS |
| Test Plan | TEST_PLAN.md v0.3 | PASS |
| Product Decisions | CR-004 approved | PASS |
| Technical Decisions | AI側で確定 | PASS |
| Cost | 0円固定費 | PASS |
| BLOCKING | 0 | PASS |

## Implementation Scope P0
- Home優先順位再設計
- 求人サイト型案件カード
- Search/Detail/WATCH/Profile UI改善
- match band / feature tag / reason summary
- WATCH更新判定
- Profile完成度
- 応募準備チェック/NEXT ACTION導線
- mobile/desktop navigation
- release_version Event比較
- new events: application_prep_start/profile_update/watch_remove
- OIDC認証Evidence集計API
- GitHub Actions Evidence artifact export

## P1 Remaining
AIコンシェルジュ、応募準備永続進捗、閲覧履歴UI、高度締切、公共営業準備度、発注機関研究。

## Safety
CR-003 event名・既存D1行・検索/判定安全境界を破壊しない。Evidence APIは無認証公開しない。

# Decision
**READY_TO_BUILD = PASS / BLOCKING = 0**

実装開始を許可する。Target branch: `cr-004-ui-ux-v0.1`。
