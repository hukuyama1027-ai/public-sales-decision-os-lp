# SCREEN_FLOW｜公共営業 意思決定OS CR-004

- 文書ID: AIMOS-LP-SF-001
- 版数: v0.1
- 状態: APPROVED_BY_AI_DESIGN

## 1. 全体導線
```text
LP /
 ├─ 無料診断
 └─ 無料版を使う
      ↓
App /app/#home
 ├─ 今日やること
 ├─ おすすめ案件
 ├─ 新着
 ├─ 締切間近
 ├─ WATCH更新
 └─ OSからの提案
      ↓
案件カード
 ├─ 詳細を見る → Detail
 ├─ WATCH → WATCH state
 └─ 応募準備を見る(GO) → Detail#application-prep
```

## 2. Home
Home → Today Action click → Detail
Home → Recommendation click → Detail
Home → New click → Detail
Home → WATCH update click → Detail
Home → Search CTA → Search
Home → Profile completion CTA → My Page

## 3. Search
Search条件入力 → Search Result Cards
Result Card → Detail
Result Card → WATCH add/remove
GO Card → 応募準備を見る → Detail応募準備section
Filter → result再取得/再描画
Sort → result並び替え

## 4. Detail
Detail Hero
 ↓
判断サマリー
 ↓
公式・原典情報
 ↓
応募準備チェック / NEXT ACTION
 ↓
原典リンク
 ↓
AI相談(P1)

Back → 直前のHome/Search/WATCHへ戻れる。

## 5. WATCH
WATCH一覧
 ├─ 更新ありfilter
 ├─ GO候補filter
 ├─ 要確認filter
 ├─ Detail
 └─ WATCH解除

## 6. My Page
Profile read
 ↓
完成度表示
 ↓
編集
 ↓
Save
 ↓
Homeおすすめ再評価

無料版データ削除は既存安全フローを維持。

## 7. AI相談
P0: 説明/準備中。
P1: Detailからopportunity contextを引継ぎ → AI相談 → 原典確認へ戻る。

## 8. Mobile Navigation
全主要viewから1タップ:
- Home
- Search
- WATCH
- AI
- My Page

Detailではbottom navを維持しつつ、Backも提供。

## 9. Evidence Flow
UI action → existing/new event → D1 events(release_version=cr004)
Daily GitHub Actions → OIDC → internal evidence API → sanitized artifact → AI経営OS。

## 10. Human UAT Flow
Home理解 → Search → Detail → WATCH → 応募準備 → Home戻り。
迷いが出た箇所をUAT Issue化する。
