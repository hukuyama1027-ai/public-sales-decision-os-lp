# UAT RESULT｜AIMOS-CR-004

- 文書ID: AIMOS-LP-UAT-004
- 版数: v0.1
- 状態: SYSTEM_UAT_PASS / HUMAN_VISUAL_UAT_PENDING
- 実施日: 2026-09-03
- Production URL: https://public-sales-decision-os-lp.pages.dev/
- Free App URL: https://public-sales-decision-os-lp.pages.dev/app/

## 1. System UAT判定

**PASS**

Production環境でAIMOS-CR-004 P0の主要業務シナリオを実行し、機能・データ・Evidence取得経路が成立することを確認した。

## 2. UAT項目

| No | 項目 | 結果 | Evidence |
|---|---|---|---|
| 1 | health / D1 schema = cr004 | PASS | live-smoke `33734876649` |
| 2 | CR-004 app shell | PASS | live-smoke `33734876649` |
| 3 | 実官公需案件検索 | PASS | live-smoke / P0 E2E |
| 4 | synthetic企業プロフィール登録 | PASS | P0 E2E `33734876525` |
| 5 | 案件詳細 + GO/WATCH/NO-GO + match band | PASS | P0 E2E `33734876525` |
| 6 | NEXT ACTION + 応募準備 | PASS | P0 E2E `33734876525` |
| 7 | WATCH保存 / 一覧 / CR-004 view model | PASS | P0 E2E `33734876525` |
| 8 | おすすめ案件品質 | PASS | P0 E2E `33734876525` |
| 9 | Home: profile completion / 今日やること / WATCH更新 / OS提案 | PASS | P0 E2E `33734876525` |
| 10 | syntheticデータcleanup | PASS | P0 E2E trap cleanup |
| 11 | Evidence APIの無認証拒否 | PASS | Automated Test |
| 12 | GitHub Actions OIDC authenticated Evidence export | PASS | run `33735462738` |
| 13 | Evidence artifactがsanitized aggregateのみ | PASS | artifact `9885535710` |

## 3. Productionデータ安全性

- D1 migrationは既存テーブル/データを削除しないadditive方式。
- CR-003 rollback baselineを維持。
- synthetic test sessionは市場Evidenceから除外。
- Evidence exportは長期shared secretを使用しない。
- PII、生session/client identifier、検索語、企業入力本文をEvidence artifactへ出力しない。

## 4. Human Visual UAT

**PENDING**

マスター規則上、ユーザー本人の主要操作確認がDONE条件であるため、System UAT PASSだけではAIMOS-CR-004をDONEにしない。

ユーザー確認は `HUMAN_VISUAL_UAT_CR004.md` の5項目のみ実施する。

## 5. 現在の受入状態

`PRODUCTION / SYSTEM_UAT_PASS / EVIDENCE_PIPELINE_PASS / HUMAN_VISUAL_UAT_PENDING`

Human Visual UATで問題がなければ正式受入候補。問題があればIssue / Change Request化して修正・回帰する。
