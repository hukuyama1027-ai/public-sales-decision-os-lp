# BASIC_DESIGN｜公共営業 意思決定OS｜LP + 無料版 v0.1

- 文書ID: AIMOS-LP-BD-001
- 版数: v0.2
- 状態: APPROVED_BY_AI_DESIGN
- 対応: AIMOS-CR-003

## 1. 全体構成

```text
Browser
 ├─ /                     既存需要検証LP
 └─ /app/                 無料版公共営業OS
      │
      ├─ Pages Functions API
      │    ├─ D1
      │    ├─ 官公需情報ポータル検索API（公式/XML）
      │    └─ Workers AI（P1 / Free枠内のみ）
      │
      └─ 原典リンク → 各発注機関/官公需ポータル

Scheduled Worker（P0）
 └─ 1日2回程度 → 官公需API → D1 opportunities upsert
```

既存LPは壊さず維持し、無料版への導線を追加する。無料版は同一Cloudflare Pagesプロジェクト配下で提供する。

## 2. 技術選定
- HTML5 / CSS3 / Vanilla JavaScript ES Modules
- Cloudflare Pages
- Cloudflare Pages Functions
- Cloudflare D1
- Cloudflare Worker + Cron Trigger（定期同期）
- Cloudflare Workers AI（P1、Free allocationのみ）
- XML parser: `fast-xml-parser` をサーバー側Functions/Workerのみで使用

フロントフレームワークは採用しない。M3検証でのOwner Hoursと依存更新負荷を抑えつつ、JSはモジュール分割して保守性を確保する。

## 3. 画面構成
### 3.1 LP `/`
既存Hero/課題/仕組み/価格/診断/FAQ/Privacyを維持。診断完了後またはHeroから「無料版で実案件を探す」導線を追加する。

### 3.2 無料版 `/app/`
SPA型。主要ビュー:
1. HOME
2. SEARCH
3. OPPORTUNITY DETAIL
4. WATCH
5. AI SUPPORT
6. MY PAGE / COMPANY PROFILE

スマホ下部ナビ: ホーム / 案件検索 / WATCH / AI相談 / マイページ。
PCは上部ナビ+コンテンツ2カラムを基本とする。

## 4. HOME
優先順:
1. あなたへのおすすめ案件
2. 新着案件
3. 締切間近
4. WATCH中
5. 今日やること
6. AIからの提案（P1）

プロフィール未登録時は、検索を妨げず「おすすめ精度を上げるためプロフィール登録」を案内する。

## 5. 公共案件取得フロー
### 5.1 定期同期
Cron → curated query（IT/AI/DX/Web/システム等）→ 官公需API → XML parse → normalize → D1 upsert → sync_runs記録。

初期頻度は1日2回。API利用条件と実負荷を優先し、頻度は固定しない。

### 5.2 ユーザー検索
検索入力 → `/api/opportunities/search` → D1検索。
必要条件でD1結果が不足/古い場合のみ、Pages Functionが官公需APIへ1回問い合わせ → normalize/upsert → D1からレスポンス。

外部API障害時はD1キャッシュ結果を返し、取得時刻を表示する。

## 6. 官公需API正規化
主な公式タグを内部項目へ変換する。
- ProjectName → title
- OrganizationName → organization_name
- CftIssueDate → announced_at
- Category → category
- ProcedureType → procedure_type
- Location / LG code / names → region fields
- Certification → certification
- ProjectDescription → source_description
- Attachments → attachments_json
- ExternalDocumentURI等 → source_url

フィールド欠損はNULL。日付の意味が不明/締切ではないものを「締切」として推測しない。

## 7. 匿名利用・プロフィール
v0.1ではアカウント登録を作らない。

初回 `/app/` 利用時:
1. Browserで32-byte相当の `client_token` を生成
2. localStorageへ保存
3. APIリクエストヘッダ `X-Client-Token` で送信
4. ServerでSHA-256化し `client_key` としてD1利用

D1にはraw tokenを保存しない。プロフィール/WATCH/閲覧履歴は同一ブラウザで復元。クロスデバイスは対象外。

## 8. WATCH
WATCH追加時に `client_key + opportunity_id` を一意制約で保存。保存時刻、期限スナップショット、案件状態を保存。現在値はopportunitiesから表示し、将来の変更通知を追加できる構造とする。

## 9. おすすめ/GO-WATCH-NO-GO
### 9.1 ルール主体
- サービス/得意分野とタイトル・概要のキーワード一致
- 対応地域一致
- カテゴリ一致
- 希望案件規模（信頼できる金額がある場合のみ）
- 資格一致/不足/不明
- 公共案件経験
- 新しさ

### 9.2 出力
- fit_score 0-100
- information_completeness 0-100
- decision: GO / WATCH / NO-GO
- positive_reasons[]
- check_points[]
- missing_information[]

NO-GOは「参加不可」ではなく「現時点で優先度低」。重要条件が不明な場合はWATCHへ寄せる。

## 10. NEXT ACTION
ルール生成を基本とする。
- 原典公告を開く
- 参加資格を確認
- 質問期限を確認
- 説明会の有無を確認
- 提出資料を確認

取得済み情報に応じて「資格情報が未取得」「締切情報は原典確認」等を追加する。

## 11. AI公共営業コンシェルジュ（P1）
Cloudflare Workers AI binding `AI` を使用。Free planで利用可能なモデルのみ。入力は当該案件の正規化情報、原典由来テキスト、企業プロフィール、ユーザー質問のみ。リードメール等は送らない。

AI回答には必ず参考情報ラベルを付け、正式参加可否/法的適格性/期限/金額をAI単独で確定しない。Free allocation超過時は「本日のAI無料枠上限」と表示して停止し、有料化しない。

## 12. イベント/Evidence
既存イベントにProduct Usageイベントを追加。`session_id`と、利用可能な場合はサーバー側で算出した`client_key`を保存。PIIはmetadataへ入れない。

Product KPIはD1集計SQLで算出し、初期は管理画面を作らない。

## 13. エラー処理
- 官公需API 4xx/5xx/timeout/XML error: キャッシュ結果+警告、または再試行案内
- D1 limit: 503 + 「一時的に利用上限」表示。自動課金しない
- AI Free limit: AI相談のみ停止。他機能継続
- profile/watch validation: 400
- token missing/invalid: 401相当ではなく新規匿名token再生成を案内。データ漏洩を避ける

## 14. 保存・バックアップ
D1 Time Travel（Free 7日）を利用。既存leads/eventsを保持。schema migrationは破壊的DROPを避け、CREATE/ALTERの後方互換を原則とする。需要検証Evidenceは定期CSV export可能なSQLを用意する。

## 15. 実行環境・費用
- Cloudflare Pages/Functions/D1/Workers/Cron/Workers AI Free枠
- 月額固定費0円
- Free枠超過時は機能停止/縮退し、自動的にPaidへ移行しない

## 16. バックアップ/縮退運転
- 官公需API停止: キャッシュ表示
- AI停止: ルール判定/NEXT ACTIONのみで継続
- Cron停止: ユーザー検索時のオンデマンド更新で継続
- D1停止/Free上限: 静的LPは継続表示、動的操作は明示的エラー
