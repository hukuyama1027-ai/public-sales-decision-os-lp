# REQUIREMENTS｜公共営業 意思決定OS｜CR-003 + CR-004 統合要件

- 文書ID: AIMOS-LP-REQ-001
- 版数: v0.4
- 状態: APPROVED_FOR_DESIGN
- 上位変更: AIMOS-CR-003 v0.1 + AIMOS-CR-004 v0.1
- Production基準線: `baseline-cr003-production` / `e70182e343643cd738113df5e0e21a7d3ba67123`
- 事業HYPOTHESIS: 集客はGovReach型、収益はSaaS、価値はAI意思決定＋AI伴走支援、UI/UXは求人サイト型

## 1. システム目的
小規模IT企業が、公共案件を「探す」だけでなく、自社向け案件を見つけ、判断理由を理解し、WATCHし、次にやることへ進める無料版公共営業OSを提供する。同時に、実利用行動をM3 Evidenceとして計測し、CR-004適用前後のUX改善効果を比較できる状態を作る。

## 2. 対象ユーザー
従業員5〜30人程度を中心とするシステム開発、SI、AI、SaaS、Web制作、RPA/DX支援、ITコンサル企業。公共案件に関心はあるが専任公共営業担当を置きにくい企業。

## 3. ユーザーメンタルモデル
「公共案件版の求人・就活サイト」。
- 求人 → 公共案件
- 求職者プロフィール → 企業プロフィール
- おすすめ求人 → 自社おすすめ案件
- マッチ度 → 案件適合度
- 気になる → WATCH
- 応募 → GO / 応募準備開始
- 閲覧履歴 → 閲覧案件
- AI就活支援 → AI公共営業コンシェルジュ

既存求人サイトのロゴ・配色・コピー・HTML/CSSは模倣しない。情報設計とUXパターンのみ参考にする。

## 4. 利用シーン
1. SEO/LPから無料版へ進む
2. 企業プロフィールを作成する
3. Homeで今日やること・おすすめ・新着・WATCH更新を確認する
4. 条件検索で案件を探す
5. 求人サイト型カードで「見るべき案件か」を短時間判断する
6. 詳細で原典情報、GO/WATCH/NO-GO、理由、要確認、NEXT ACTIONを確認する
7. WATCHまたは応募準備を見る
8. 再訪し継続利用する
9. M3 Evidenceを自動集計する

## 5. 既存CR-003 P0機能（破壊禁止）
- REQ-F-001: 官公需情報ポータル検索APIを第一データ源とする実公共案件検索。
- REQ-F-002: 案件一覧。
- REQ-F-003: キーワード/地域/発注機関/公告期間/締切期間/カテゴリ/公示方式/新着等の検索・絞り込み。
- REQ-F-004: 案件詳細と原典URL。
- REQ-F-005: WATCH保存/解除/一覧。
- REQ-F-006: 企業プロフィール保存/再表示。
- REQ-F-007: 自社おすすめ案件。
- REQ-F-008: GO / WATCH / NO-GO。
- REQ-F-009: 判定理由・要確認・情報不足。
- REQ-F-010: NEXT ACTION。
- REQ-F-011: Product Usage Event。

既存検索品質、安全境界、deadline推測禁止、source/OS分離を維持する。

## 6. CR-004 P0 UI/UX要件
### REQ-UI-101 Home優先順位
Homeは検索フォーム中心にしない。表示優先順を原則以下とする。
1. 今日やること
2. あなたへのおすすめ案件
3. 新着案件
4. 締切間近
5. WATCH更新
6. OS/AIからの提案

AI実機能が未公開の場合、AI生成と誤認させず「OSからの提案」または「AI相談は準備中」と表示する。

### REQ-UI-102 求人サイト型案件カード
最低限、取得・判定可能な範囲で表示する。
- GO / WATCH / NO-GO
- マッチ度band（高/中/低。内部scoreの根拠のない精密表示を前面に出さない）
- 案件名
- 発注機関
- 地域
- カテゴリ/公示方式
- 公告日/取得日
- trusted deadlineのみ締切/残日数
- 根拠のある特徴tag
- おすすめ理由の要約
- 要確認事項
- 詳細を見る
- WATCH
- GO案件では応募準備を見る

取得不能情報や「公共実績不要」等を推測tag化しない。

### REQ-UI-103 案件詳細情報順
「概要 → 判断 → 条件 → 行動」を基本とする。
1. GO/WATCH/NO-GO
2. マッチ度band
3. 案件名・発注機関
4. 取得できる契約/規模情報
5. trusted deadline
6. おすすめ理由
7. 注意・不足条件
8. 案件概要
9. 参加条件/資格情報
10. スケジュール情報
11. 応募準備チェック/NEXT ACTION
12. 原典
13. AIへ質問（P1導線）

### REQ-UI-104 GO/WATCH/NO-GO UX
- GO: 応募検討を進める価値が高い。CTA「応募準備を見る」。
- WATCH: 監視価値あり。CTA「WATCHに追加」。
- NO-GO: 現時点で優先度低。理由を必ず表示。正式参加不可とは表現しない。

### REQ-UI-105 WATCH
WATCH一覧で、取得可能な範囲で現在状態、マッチ度、締切、更新ありを表示する。保存時source hashと現在source hashが異なる場合のみ「更新あり」とする。

### REQ-UI-106 検索
求人検索型条件UI。キーワード、技術/カテゴリ、地域、発注機関、公告日、新着、trusted deadline条件を提供する。並び順はおすすめ順/新着順/締切順/適合度順のうちデータ上安全に成立するものを提供する。

### REQ-UI-107 企業プロフィール
基本情報、得意分野、対応地域、希望案件規模、資格/認証、公共実績のセクションとして表示。入力済み必須項目から軽量プロフィール完成度を表示し、不足項目のメリットを説明する。

### REQ-UI-108 NEXT ACTION / 応募準備
CR-003 NEXT ACTIONを、P0では非永続の「応募準備チェック」として視覚化する。GOカード/詳細の「応募準備を見る」で同セクションへ到達できる。永続チェック進捗はP1。

### REQ-UI-109 Navigation
スマホ下部固定: ホーム / 検索 / WATCH / AI相談 / マイページ。PCは同等の主要ナビ。主要操作は44px以上、focus-visible、色以外でも状態表現する。

### REQ-UI-110 公共営業支援サービス認知
「入札DB」だけではなく、「おすすめ・判断・WATCH・次行動を支援する公共営業OS」と初見で理解できること。

## 7. P1統合バックログ
- REQ-P1-001: AI公共営業コンシェルジュ（Workers AI Free枠優先）。
- REQ-P1-002: 応募準備ナビの永続進捗、完了状態。
- REQ-P1-003: 閲覧履歴UI。
- REQ-P1-004: trusted deadlineを使う高度締切管理。
- REQ-P1-005: 公共営業準備度統合。
- REQ-P1-006: 高度な「今日やること」。
- REQ-P1-007: おすすめ理由詳細。
- REQ-P1-008: 発注機関研究。

軽量プロフィール完成度と非永続応募準備チェックはP0へ前倒しする。

## 8. AI安全要件
- REQ-AI-001: LLM単独で正式参加資格、法的適格性、必須資格、期限、金額、原典条件を決定しない。
- REQ-AI-002: 構造化データ/原典/ルールを優先。
- REQ-AI-003: source情報とOS/AI参考情報をUI上で分離。
- REQ-AI-004: 不明は不明と表示。
- REQ-AI-005: AI未実装機能をAI生成済みと誤認させない。

## 9. Event / Evidence要件
### 既存Event維持
page_view, cta_click, diagnosis_start, diagnosis_complete, pricing_click, usage_interest, public_search, public_search_result_view, opportunity_detail_view, watch_add, company_profile_complete, recommended_opportunity_view, go_view, watch_view, no_go_view, next_action_view, ai_support_start。

### CR-004追加Event
- REQ-EVT-101: application_prep_start
- REQ-EVT-102: profile_update
- REQ-EVT-103: watch_remove

### Release比較
- REQ-EVT-104: CR-004以後のeventへserver-sideで`release_version='cr004'`を付与する。
- REQ-EVT-105: 既存eventを削除/改名しない。
- REQ-EVT-106: event metadataへPII、会社入力本文、検索語、生tokenを保存しない。

## 10. AI経営OS Evidence自動集計要件（Issue #7）
- REQ-MET-001: 無認証公開メトリクスAPIを作らない。
- REQ-MET-002: AI経営OSが手動D1確認なしで集計Evidenceを取得できる経路を提供する。
- REQ-MET-003: 長期shared secretを可能な限り使わず、GitHub Actions OIDCの短命JWTで認証する。
- REQ-MET-004: issuer/audience/repository/ref/workflowを検証する。
- REQ-MET-005: 出力は集計値のみ。PII、会社情報、検索語、生session_id/client tokenを含めない。
- REQ-MET-006: GitHub Actions artifactへEvidence snapshotを保存し監査可能にする。
- REQ-MET-007: 手動実行 + 1日1回程度の定期実行を可能にする。
- REQ-MET-008: CR-003 legacyとCR-004 releaseを比較可能にする。

## 11. M3集計KPI
- unique anonymous users（client_keyがある範囲）
- unique sessions
- profile completions / profile updates
- search users
- search count / searches per user
- search → detail rate
- detail → WATCH rate
- recommendation views
- GO/WATCH/NO-GO distribution
- NEXT ACTION views
- application prep starts
- repeat usage（2日以上利用したclient_key）
- LP CTA / diagnosis / pricing / usage interest / lead count

正式集計値がない期間は推測・0補完しない。

## 12. データ/DB要件
既存events/leads/opportunities/company_profiles/watch_items/search_history/recent_views/sync_runsを保持。
追加:
- events.release_version TEXT NULL
- watch_items.source_hash_snapshot TEXT NULL

既存行を破壊しない後方互換migrationとする。

## 13. 非機能・コスト
- REQ-NF-001: 初期0円/月額固定費0円を維持。
- REQ-NF-002: Cloudflare/GitHub Free枠を優先し自動Paid移行しない。
- REQ-NF-003: スマホ/PC対応。
- REQ-NF-004: 官公需API障害時はD1 cache縮退。
- REQ-NF-005: UI変更で検索/API call数を不必要に増やさない。
- REQ-NF-006: Owner Hoursを極小化しEvidence集計を自動化。
- REQ-NF-007: CR-003基準線と比較可能。

## 14. セキュリティ・プライバシー
既存のHTTPS/same-origin、token hash、IDOR scope、CSP、XSS/SSRF対策を維持。
追加:
- OIDC JWT署名をGitHub JWKSでRS256検証。
- `iss=https://token.actions.githubusercontent.com`、custom audience、repository、main ref、expected workflowを必須検証。
- JWKS URLは固定。
- 集計APIはGETのみ、D1 read-only SQLのみ。
- 集計JSONにraw identifierを含めない。

## 15. 対象外
- 求人サイトのデザインコピー
- 実際の電子入札/自動応募
- 決済/契約
- 全国自治体独自スクレイピング
- AIによる正式参加可否保証
- 応募準備の永続進捗（P1）
- 本格発注機関研究（P1/P2）

## 16. SUCCESS CRITERIA
1. CR-003 P0全機能が回帰PASS。
2. Homeが「今日やること→おすすめ→新着→締切間近→WATCH更新→提案」中心になる。
3. 案件カードが短時間判断に必要な理由/要確認/CTAを表示。
4. 詳細が概要→判断→条件→行動の順で理解できる。
5. WATCH更新をsource hash差分で表示可能。
6. Profile完成度を表示。
7. GOから応募準備チェックへ進める。
8. スマホ5ナビが利用可能。
9. 既存Eventを破壊せずCR-004 release識別が可能。
10. OIDC認証Evidence APIがraw identifier/PIIなしの集計値のみ返す。
11. GitHub Actions artifactでEvidence snapshotを自動取得できる。
12. Automated Test PASS / BLOCKING 0。
13. Cloudflare Production再デプロイ + System UAT PASS。
14. Human Visual UAT対象を明示。
15. 月額固定費0円維持。

## 17. 未決事項
PRODUCT DECISION未決はなし。
Human Visual UATの体感評価はProduction反映後にユーザー受入として実施する。

## 18. BLOCKING
BLOCKING: 0。設計工程へ進行可。
