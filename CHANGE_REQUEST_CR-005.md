# CHANGE REQUEST｜AIMOS-CR-005

- 文書ID: AIMOS-CR-005
- 版数: v0.1
- 状態: APPROVED / NOW
- 受領日: 2026-09-03
- 起票元: AIMOS-CR-004 Human Visual UAT
- Related Issue: #16
- Product Decision: ユーザーフィードバックにより承認済み

## 1. 目的
CR-004 Human Visual UATで判明した主要操作不具合を解消し、視覚的に分かりやすく親しみのある公共営業OSへ改善する。

## 2. 変更内容
### P0 BUG
1. 検索結果カードで実案件名・発注機関・地域等を正しく表示する。
2. WATCH追加/解除を正常に動作させる。

### UI/UX
3. 現行の簡素な業務画面から、カード・アイコン・軽量イラストを使った視覚的なUIへ強化する。
4. ユーザー提示の就活/求人サイト画面はメンタルモデル・情報整理の参考にのみ使用し、ロゴ・ブランド・配色・具体レイアウトは模倣しない。
5. Home/Search/WATCH/Profileの主要入口で、各機能の意味が一目で分かるオリジナルのSVGアイコン/イラストを使用する。
6. 外部画像CDN・有料素材を使わず0円構成を維持する。

## 3. 優先度
- 案件表示/WATCH: NOW / P0
- UI視覚表現強化: NOW / Human UAT受入条件

## 4. 完了条件
- flat/nested双方の案件データshapeを安全に正規化できる。
- 実案件のid/title/organizationを用いたカード表示テストがPASS。
- WATCH POSTへ有効なopportunity_idが送られる。
- Productionで検索→カード表示→WATCH追加→WATCH一覧→解除が成立する。
- スマホで横スクロールや主要CTA崩れがない。
- オリジナルのイラスト/アイコンが主要画面に追加され、情報把握を妨げない。
- CR-003/CR-004回帰、Evidence計測、0円構成を維持する。
- 再Human Visual UATが実施可能になる。
