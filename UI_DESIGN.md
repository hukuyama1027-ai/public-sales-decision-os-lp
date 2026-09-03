# UI_DESIGN｜公共営業 意思決定OS｜CR-004

- 文書ID: AIMOS-LP-UI-001
- 版数: v0.3
- 状態: APPROVED_BY_AI_DESIGN
- コンセプト: 公共案件版の求人・就活サイト

## 1. デザイン原則
- 信頼感 / 公共・法人向け / モダンSaaS / 初心者でも分かる / 軽い / 行動しやすい。
- 官公庁サイト風の文字過多、Excel一覧だけ、派手なAI未来表現を避ける。
- 白を基調に濃紺・青をアクセント。色だけで状態を伝えない。
- 1画面で「見るべき案件か」「なぜか」「次に何をするか」が分かる。
- 原典情報とOS/AI参考判断を視覚的に分離。

## 2. App Shell
### PC
- 上部固定header: ロゴ / ホーム / 案件検索 / WATCH / AI相談 / マイページ
- content max 1200px
- Home/Detailはカード中心、Searchはfilter + cards
- 表形式を主画面にしない

### Mobile
- 上部: コンパクトheader
- 下部固定5ナビ: ホーム / 検索 / WATCH / AI相談 / マイページ
- 1カラム
- 主要CTA 44px以上

## 3. Home
### A. 今日やること
最上段。最大3〜5件。
カード例:
- `おすすめGO案件の原典を確認`
- `WATCH案件の更新を確認`
- `プロフィールをあと2項目入力`

### B. あなたへのおすすめ案件
横/縦カード。上位3〜5件。
プロフィール未登録なら登録CTA。

### C. 新着案件
小型カード。新着badge。

### D. 締切間近
trusted deadlineのみ。データなしなら「原典期限を確認すべきWATCH案件」へ無理に置換しない。

### E. WATCH更新
`has_update=true`を優先。その後WATCH中を表示。

### F. OSからの提案 / AI相談
AI未実装時は`OSからの提案`としてrule-based提案を表示し、AI相談はP1準備中であることを明記。

## 4. 案件カード
構造:
1. status row: GO/WATCH/NO-GO + マッチ度band + 新着/更新
2. title
3. organization / region
4. category / procedure / notice date / trusted deadline
5. feature tags（直接根拠のみ）
6. `おすすめ理由` max2
7. `要確認` max2
8. actions

### マッチ度
- 高: score>=70かつcritical unknownなし
- 中: WATCH相当
- 低: NO-GO相当
UIでは精密scoreを主表示しない。

### CTA
- GO: `応募準備を見る` + `詳細を見る` + WATCH
- WATCH: `WATCHに追加` / `詳細を見る`
- NO-GO: `理由を見る` / `詳細を見る`

## 5. 詳細
### Hero
GO/WATCH/NO-GO、マッチ度band、案件名、発注機関、WATCH。

### 判断サマリー
- おすすめ理由
- 要確認
- 情報不足
- 「正式な参加可否を保証しない」notice

### 公式・原典情報
- 公告日/取得日
- 地域
- カテゴリ/公示方式
- 資格情報
- trusted deadline or 原典で確認
- 概要
- 添付/原典

### 応募準備チェック
NEXT ACTIONをchecklist表示。P0ではチェック状態を保存しない。
`応募準備を見る`遷移時にsectionへfocus/scroll。

### AI相談
P1。未実装時は説明+準備中表示のみ。

## 6. WATCH
カードに:
- 更新あり
- GO/WATCH/NO-GO
- マッチ度
- 案件名
- trusted deadline
- 詳細
- WATCH解除

filter候補のうち、P0は`更新あり / GO候補 / 要確認`をclient-sideで成立させる。高度期限filterはP1。

## 7. Search
上部に求人検索型bar。
- キーワード
- 地域
- 発注機関
- 追加条件を開閉

popular chipsはデータ上保証可能なもののみ:
- 新着
- AI
- Web
- DX
- RPA

`公共実績不要`、`オンライン提出`等は原典の確実な構造化判定がない限り表示しない。

sort:
- おすすめ順（profileあり）
- 新着順
- 締切順（trustedのみ）
- 適合度順（profileあり）

## 8. Profile
セクション:
- 基本情報
- 得意分野
- 対応地域/案件規模
- 資格・公共実績

上部に`プロフィール完成度` progress bar。
`おすすめ精度を上げるためあとN項目`を表示。
これは入力充足率で、公共営業能力スコアではない。

## 9. States
- Loading: skeleton
- Empty: 次行動CTA
- Stale: `キャッシュ済み情報を表示中`
- Upstream error: 公式API取得失敗notice
- No profile: おすすめ精度向上CTA
- Deadline unknown: `期限は原典で確認`
- AI unavailable: 他機能継続

## 10. LP補足
既存LPは壊さず、無料版実機能を示すセクションを追加可能:
- おすすめ案件card例
- GO/WATCH例
- 応募準備チェック例
- AI相談(P1)例

Main Copyは維持。

## 11. Accessibility
- semantic heading
- label/aria-live
- focus-visible
- button/link用途分離
- contrast AA目標
- bottom nav active状態は色+形/太字

## 12. Human Visual UAT Oracle
初見30秒以内に:
1. 今日やることが分かる
2. 自社おすすめが分かる
3. GO/WATCH/NO-GOの意味が分かる
4. WATCHの使い方が分かる
5. 詳細で理由とNEXT ACTIONを見つけられる
6. 「公共営業支援サービス」と認識できる
7. スマホで主要5機能へ1タップで到達できる
