# UAT RESULT｜AIMOS-CR-004

- 文書ID: AIMOS-LP-UAT-004
- 版数: v0.2
- 状態: SYSTEM_UAT_PASS / HUMAN_VISUAL_UAT_FAIL / CHANGE_REQUIRED
- 実施日: 2026-09-03
- Production URL: https://public-sales-decision-os-lp.pages.dev/
- Free App URL: https://public-sales-decision-os-lp.pages.dev/app/
- Follow-up Change: AIMOS-CR-005 / Issue #16

## 1. System UAT判定
**PASS**

API/E2E/Evidence経路はProductionで成立した。

## 2. Human Visual UAT判定
**FAIL / CHANGE_REQUIRED**

ユーザー本人の実ブラウザ確認で以下を確認。

1. 検索結果件数は表示されるが、案件カードが「案件名なし」「発注機関情報なし」等となり、実案件情報を確認できない。
2. WATCH操作で `WATCHを更新できません: INVALID_INPUT` が表示され、登録できない。
3. UIが簡素すぎるため、カード・アイコン・イラストを使った視覚的な表現強化を希望。

主要導線である案件把握とWATCHが成立しないため、CONDITIONAL PASSではなくFAILとする。

## 3. 原因
`src/app/app.js` の `normalizeCard()` がAPI flat itemの `source: "kkj"` をnested source objectと誤認。案件本体が文字列扱いとなりid/title/organizationが欠落した。

## 4. 対応
AIMOS-CR-005をNOWとして起票。

- flat/nested data shape修正
- WATCH回帰
- browser-facing UI regression追加
- UI視覚表現強化
- Production再試験
- Human Visual UAT再実施

## 5. 現在の受入状態
`PRODUCTION / SYSTEM_UAT_PASS / HUMAN_VISUAL_UAT_FAIL / CR-005_BUILDING`

正式受入・DONEは禁止。CR-005修正後に再UATする。
