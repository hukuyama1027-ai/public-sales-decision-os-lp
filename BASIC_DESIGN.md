# BASIC_DESIGN｜公共営業 意思決定OS 需要検証LP

- 文書ID: AIMOS-LP-BD-001
- 版数: v0.1
- 状態: APPROVED_BY_AI_DESIGN

## 1. システム構成
Browser → Cloudflare Pages（HTML/CSS/JS）→ /api/event, /api/lead（Pages Functions）→ Cloudflare D1。

JavaScript無効時もLP本文と料金・FAQは閲覧可能。診断送信のみJS/APIを必要とする。

## 2. 技術選定
- HTML5 / CSS3 / Vanilla JavaScript
- Cloudflare Pages + Pages Functions
- Cloudflare D1 (SQLite互換)
- ビルド工程なし。依存パッケージなし。

理由: 0円、低保守、軽量、第三者Cookie不要、今回の小規模検証に十分。フレームワークを入れないことで依存更新とOwner Hoursを抑える。

## 3. 画面構成
単一LP + モーダル/セクション型診断。
1. Header
2. Hero
3. Problems
4. How it works
5. Decision sample
6. Comparison
7. Benefits
8. Pricing
9. Diagnosis
10. FAQ
11. Privacy
12. Footer

## 4. データフロー
### Page View
初回表示 → anonymous_session_id生成(sessionStorage) → /api/eventへ page_view。

### CTA
CTA押下 → cta_click → 診断セクションへ移動 → diagnosis_start（セッション1回）。

### 診断送信
入力検証 → /api/leadへPOST → D1保存 → diagnosis_completeイベント → ブラウザ側で簡易フィット結果表示。

### 料金関心
料金カードCTA → pricing_click(plan) → 診断フォームのprice_interestへ反映。

### 利用希望
フォーム usage_interest=true → lead保存と同時に usage_interestイベント。

## 5. 簡易診断ロジック
実案件マッチングは行わない。以下の準備度のみクライアント側で説明用に算出する。
- ITサービス具体性
- 対応地域の明確さ
- 公共応募経験
- 全省庁統一資格
結果は「先行診断（需要検証用）」と明示し、GO/WATCH/NO-GOの実案件判定とは区別する。

## 6. エラー処理
- API 400: 入力内容を確認するメッセージ
- API 429: 時間をおいて再試行
- API 5xx: 送信できなかった旨を表示。入力値は画面上に保持。
- D1未バインド: 503。公開前テストで検知。

## 7. 保存・バックアップ
D1に保存。Free planではTime Travel 7日が利用可能。検証終了後はCSV等でエクスポートしてEvidence保全する運用を推奨。

## 8. 運用
通常は無操作。KPI確認時のみD1から集計。管理画面は作らないため、初期はCloudflare Dashboard / SQL queryを利用する。

## 9. 費用
Cloudflare Free plan内を前提に月額0円。Free枠超過時はエラーとなり、自動課金前提にしない。
