# CHANGE IMPACT｜AIMOS-CR-005

- 文書ID: AIMOS-LP-IMPACT-005
- 版数: v0.1
- 状態: APPROVED_FOR_BUILD
- Related Issue: #16

## 1. 変更分類
- データ正規化/WATCH不具合: SMALL / P0 BUG
- UI視覚表現強化: MEDIUM / NOW
- Architecture変更: なし
- DB変更: なし
- API contract変更: なし
- Cost変更: なし

## 2. 原因
`src/app/app.js` の `normalizeCard()` が `x.source` の型を判定せず、flat opportunity objectの `source: "kkj"` をnested source objectと誤認する。

このため `item.id/title/organization_name` が取得できず、表示欠落とWATCH `INVALID_INPUT` が連鎖した。

## 3. 影響範囲
### 要件
CR-004の「案件カード」「WATCH」「短時間把握」は未達だったためCR-005で補正。

### UI
- Home
- Search
- WATCH
- Detail
- Profile
- Mobile bottom navigation

### JavaScript
- normalizeCard
- opportunityCard
- toggleWatch防御
- visual helper

### API/DB
変更なし。既存API shapeをフロント側で正しく受ける。

### Tests
browser-facing static/logic regressionを追加する。API-only E2Eでは検出できなかったため、UI adapter shape testを必須化。

## 4. Security / Privacy
変更なし。外部画像/CDNを使わずinline SVG/CSSのみ。新規追跡SDKなし。

## 5. Rollback
Production基準線は `main` のCR-004受入前closeout状態。CR-005はフロント中心でDB migrationなし。問題発生時はCR-005 merge前mainへ戻せる。

## 6. 判定
追加ユーザー判断は不要。要望内容と参考画面が十分具体的であり、技術方式はAI判断で進める。

**BLOCKING = 0**
