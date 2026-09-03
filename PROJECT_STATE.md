# PROJECT_STATE

- Project: 公共営業 意思決定OS｜需要検証LP + 無料版公共営業OS
- Active Change: AIMOS-CR-003 v0.1
- Goal: M3をLP反応検証から実プロダクト利用Evidence検証へ拡張する
- Phase: P0_EVIDENCE_READY / HUMAN_VISUAL_UAT_PENDING
- Progress: CR-003 P0 100% / System UAT PASS / P1 Pending
- Stable Version: 無料版公共営業OS v0.1（Production）
- Public URL: https://public-sales-decision-os-lp.pages.dev/
- Free App URL: https://public-sales-decision-os-lp.pages.dev/app/
- READY_TO_BUILD: PASS（AIMOS-LP-RTB-003 v0.1）
- P0 BUILD GATE: PASS
- SYSTEM UAT: PASS
- HUMAN VISUAL UAT: PENDING
- Current Task: ユーザー画面受入確認 → P1/定期同期の次工程判定

## Completed Tasks
- CR-003受領 / PRODUCT DECISION確認
- 変更影響分析
- 官公需情報ポータルAPI / Cloudflare Free枠技術調査
- REQUIREMENTS v0.3
- BASIC_DESIGN v0.2
- UI_DESIGN v0.2
- DB_DESIGN
- API_DESIGN
- DATA_FLOW
- DETAIL_DESIGN v0.2
- SECURITY_REVIEW
- TEST_PLAN v0.2
- AGENTS / HANDOFF
- READY_TO_BUILD再判定 PASS
- `cr-003-free-os-v0.1` 実装
- 官公需XML adapter / normalizer
- 案件検索 / 一覧 / 詳細
- 企業プロフィール
- WATCH / WATCH一覧
- 自社おすすめ案件
- GO / WATCH / NO-GO
- 判定理由 / information completeness
- NEXT ACTION
- Product Usage event
- 匿名client token hash
- security headers
- D1 schema bootstrap / migration
- GitHub main統合
- Cloudflare Production再デプロイ
- GitHub Actions automated tests 59/59 PASS
- 本番health / app / 実案件検索 live-smoke PASS
- Production P0 E2E PASS
- BUG-CR003-001 検索ノイズ修正・CLOSED
- BUG-CR003-002 おすすめ品質修正・CLOSED
- TEST_RESULT_CR-003 v0.1
- UAT_RESULT_CR-003 v0.1

## Production Evidence
- D1 schema: `cr003` / PASS
- Real official search: `q=AI` / PASS
- Official source: `kkj` / PASS
- Production cache: PASS
- Profile save/read: PASS
- Opportunity detail: PASS
- Decision + reasons: PASS
- NEXT ACTION: PASS
- WATCH add/read/Home reflect: PASS
- Recommendation quality: PASS
- Synthetic E2E cleanup: PASS

## Automated Test Evidence
- Latest full CR-003 test set: 59 tests / 59 PASS / 0 FAIL
- Recommendation quality PR #6: PASS / merged
- Production P0 E2E run `33713292290`: SUCCESS

## Open Questions
なし（P0 technical）。

## Unknown
AIMOS-CR-002本文未発見。current mainを統合baselineとしている。CR-002本文が後日発見された場合はDONE前に差分同期レビュー必須。

## Open Issues
- BLOCKING: 0
- P0 BUG: 0
- UAT-001（旧LP診断結果視認性）: 修正済み / 非BLOCKING

## Pending Tasks
### Human Acceptance
- PC/スマホでの画面・操作感UAT

### P1
- F-011 締切管理（trusted deadlineのみ）
- F-012 「今日やること」UX強化
- F-013 閲覧履歴UI
- F-014 おすすめ理由詳細
- F-015 公共営業準備度統合
- AI公共営業コンシェルジュ

### Operations / Completion
- Cron等の定期同期（現在はオンデマンド公式API取得 + D1 cache）
- USER_MANUAL / SETUP_GUIDEをCR-003へ同期
- Human UAT後の受入判定
- AI経営OSへP0 Evidence-ready状態を返却

## Risks
- 官公需情報ポータルは全案件網羅を保証しない
- 原典によって項目欠損がある
- deadline意味を誤認しないため自動期限確定を保守的に制限
- Cloudflare D1/Workers Free枠上限
- 匿名token消失時は端末状態を復元できない
- 公式API仕様変更

## Decisions
- server-side official API proxy + D1 cache
- account/passwordなしclient token hash
- rule-first matching
- source informationとOS参考判断を分離
- deadline推測禁止
- short ASCII検索は主題範囲で関連性確認
- おすすめはservice_relevant=trueのGO/WATCHのみ
- P1 AIは無料枠優先、有料化はユーザー承認なしに行わない

## Cost
- Initial: 0円
- Monthly Fixed Cost: 0円（Cloudflare/GitHub Free枠内）

## Last Updated
2026-09-03

## Next Action
1. ユーザー本人のPC/スマホ画面UAT
2. UAT PASS後、P0をM3 Evidence取得基盤として受入
3. BLOCKING 0ならP1 / Cron / manual同期へ進行
