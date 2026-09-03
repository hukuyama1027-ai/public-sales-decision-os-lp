# UI DESIGN DELTA｜AIMOS-CR-005

- 文書ID: AIMOS-LP-UI-005
- 版数: v0.1
- 状態: APPROVED_FOR_BUILD
- 基準: UI_DESIGN.md / CR-004

## 1. デザイン方向
「公共案件版の求人サービス」という既存メンタルモデルを維持しつつ、文字と枠だけの業務画面から、視覚的に意味が伝わるSaaS UIへ改善する。

ユーザー提示の就活/求人サイトは以下のみ参考にする。
- 大きな検索導線
- アイコン付きカテゴリ/機能入口
- カード型おすすめ情報
- 視覚的な余白とまとまり
- モバイル下部ナビ

ブランド・ロゴ・固有配色・具体的な装飾は模倣しない。

## 2. Visual Language
- Base: 白 + 淡いブルー背景
- Accent: 公共/信頼を表すBlue、行動を表すGreen/Amber
- Shape: 16〜24px角丸のカード
- Illustration: inline SVGのオリジナル線画/フラット図形
- Icon: Search / Star / Briefcase / Compass / Profile / Calendar等の簡潔なSVG
- Shadow: 弱いカードshadowのみ
- Animation: 不要

## 3. Home
上部に「今日やること」のHero Cardを置き、右側/背景に公共案件探索をイメージするオリジナルイラストを配置する。

その下に4つのQuick Access Tileを配置する。
- おすすめ案件
- 新着案件
- WATCH
- マイページ

各Tileにアイコンを付ける。

おすすめ案件カードは、判定Badge→案件名→発注機関/地域→タグ→理由→CTAの順で視線が流れるようにする。

## 4. Search
検索フォーム上部にSearch illustration付きタイトルを配置。
人気条件chipはアイコン/色差を追加する。
検索結果カードは空値時に「案件名なし」を通常表示せず、データ不整合として防御する。

## 5. WATCH
星アイコンを主要モチーフにし、保存済み状態が一目で分かる。
WATCH追加/解除後はbutton labelだけでなくaria-pressedも更新する。

## 6. Profile
プロフィール完成度を単なるbarだけでなく、企業カード風に見せる。Profile/Building iconを付与。

## 7. Mobile
- 下部5ナビ維持
- 各ナビはSVG icon + label
- 主要CTA 44px以上
- Card内actionは1〜2列で折返す
- illustrationは高さ120px程度まで縮小し情報を圧迫しない
- 横スクロール禁止

## 8. Accessibility
- SVGは装飾用途なら `aria-hidden=true`
- buttonはtext labelを保持
- WATCHは `aria-pressed`
- focus-visible維持
- 色だけでGO/WATCH/NO-GOを伝えない

## 9. Asset Policy
外部画像、外部font、外部icon CDN、有料素材は追加しない。HTML/CSS/inline SVGのみで実装する。
