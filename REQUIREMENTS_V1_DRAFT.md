# REQUIREMENTS v1.0 DRAFT｜公共営業 意思決定OS

- 文書ID: AIMOS-LP-REQ-001
- 版数: v1.0-draft
- 状態: DRAFT / RE-BASELINE REVIEW
- 作成日: 2026-09-04
- 対象: 公共営業 意思決定OS
- 現Production基準線: CR-005 Production Candidate
- 旧要件: REQUIREMENTS.md v0.4
- 関連: AIMOS-CR-003 / CR-004 / CR-005 / Issue #22 / #23 / #24
- 正式化条件: Product Decision差分レビュー + BLOCKING 0 + ユーザー承認
- 注意: 本文中の HYPOTHESIS / PROPOSAL は未確定。料金・正式事業開始・有料サービス導入・実課金・有人サポート正式提供は別途ユーザー承認必須。

---

## 1. PURPOSE

公共営業 意思決定OSは、専任の公共営業担当を置きにくい小規模IT企業が、公共案件を単に検索するのではなく、

**案件発見 → 自社適合判断 → WATCH/GO判断 → NEXT ACTION → 応募準備 → AI伴走 → 継続管理**

までを低負荷で進められる公共営業支援SaaS候補である。

本v1.0は、初期の「需要検証LP + 無料検索MVP」から進化した現在の事業モデルを基準に、

- BUSINESS
- PRODUCT
- ACQUISITION
- ACTIVATION
- DECISION SUPPORT
- AI SUPPORT
- RETENTION
- MONETIZATION
- SUPPORT OPERATIONS
- EVIDENCE / M3
- OWNER HOURS

を一つの要件体系として再定義する。

---

## 2. TOP-LEVEL BUSINESS GOAL

### FACT / USER GOAL
AI経営OS上の最上位条件は、代表本人の直接労働への依存を継続的に下げながら、持続的に利益を生む仕組みを構築することである。

### TARGET
- 月間利益: 100万円以上を最終目標
- 安定後Owner Hours: 原則 約3時間/週を目標
- 初期費用 / 固定費: 可能な限り0円
- 顧客獲得: Inbound優先
- 代表本人による個別営業・個別サポート依存: 極小化

### REQ-BIZ-001
本製品の機能・運用・サポート・価格・集客施策は、売上だけでなく Owner Hours / Owner Contact Load / 自動化可能性 / 再現性を評価軸とする。

### REQ-BIZ-002
利益増加と同時にOwner Hoursが大幅増加する設計は、原則採用しない。

---

## 3. CURRENT BUSINESS MODEL

### DECISION
現在の事業モデル方向は以下とする。

> **集客はGovReach型、収益はSaaS、価値はAI意思決定＋AI伴走支援、UI/UXは求人サイト型。**

### REQ-BM-001 Acquisition
SEO、無料案件ページ、無料診断、無料ツール、比較/解説コンテンツ等を主導線とするInbound型を優先する。

### REQ-BM-002 Revenue
Freeから月額SaaSへ移行するFreemiumまたはFree-to-Paid構造を基本HYPOTHESISとする。

### REQ-BM-003 Value
有料価値は単純な案件一覧ではなく、以下の組み合わせで構築する。
- 自社向け案件発見
- 優先順位付け
- GO/WATCH/NO-GO支援
- 判断理由
- NEXT ACTION
- 応募準備
- AI公共営業コンシェルジュ
- 締切/更新/継続管理

### REQ-BM-004 Support
FAQ/ガイド → AI self-service → 標準化有人サポート → 必要時専門家、の順で解決する構造を想定する。

代表本人を通常サポート窓口にしない。

---

## 4. ICP / CUSTOMER

### HYPOTHESIS: Primary ICP
従業員5〜30人程度を中心とする以下の企業。
- システム開発
- SI
- AI開発
- SaaS
- Web制作
- RPA/DX支援
- ITコンサルティング

### CUSTOMER CONDITION
- 公共案件に関心がある
- 専任公共営業担当を置きにくい
- どの案件を見るべきか分からない
- 入札参加条件や準備事項の確認負荷が高い
- 能動営業以外の受注機会を増やしたい

### REQ-CUS-001
M3では全ユーザーだけでなく、ICP-qualified usersを分離して利用行動を評価できること。

---

## 5. CUSTOMER JOB / PAIN / GAIN

### JOB
1. 自社が狙える公共案件を見つけたい
2. 応募価値を短時間で判断したい
3. 資格・実績・締切等の確認漏れを減らしたい
4. 応募までの次行動を知りたい
5. 専任担当なしでも継続的に公共営業を回したい

### PAIN
- 案件情報が分散している
- 公告を読んでも自社向けか分からない
- 参加条件確認が重い
- 案件を保存しても次の行動につながらない
- 締切/質問期限/書類準備が複雑
- 公共営業経験が少ないと判断基準がない

### GAIN
- 毎日短時間で見るべき案件が分かる
- 見送る理由も分かる
- WATCHだけで候補を管理できる
- 応募準備が手順化される
- AIに案件文脈を引き継いで相談できる

---

## 6. PRODUCT POSITIONING

### PRODUCT CONCEPT
**「公共営業担当がいない会社でも、案件発見から応募準備まで迷わず進められるAI公共営業OS」**

### REQ-PC-001
単なる「入札DB」「案件検索サイト」と誤認されないこと。

### REQ-PC-002
初見ユーザーが、検索・おすすめ・判断・WATCH・次行動まで支援するサービスだと理解できること。

### REQ-PC-003
AIが正式参加可否を保証するサービスとは表現しない。

---

## 7. END-TO-END CUSTOMER JOURNEY

### REQ-JRN-001
標準Journeyを以下とする。

`検索エンジン / SNS / 紹介`
→ `案件ページ / 解説ページ / 無料診断 / LP`
→ `無料版公共営業OS`
→ `企業プロフィール`
→ `おすすめ案件`
→ `検索・比較`
→ `案件詳細`
→ `GO / WATCH / NO-GO`
→ `WATCH / 応募準備`
→ `AI相談`
→ `再訪`
→ `有料価値認知`
→ `Paid conversion（将来）`

### REQ-JRN-002
LPを経由しなくても、検索流入から案件/カテゴリページへ直接到達し、その後無料OSへActivationできる構造を許容する。

### REQ-JRN-003
無料診断結果は孤立させず、企業プロフィール・おすすめ案件・NEXT ACTIONへ接続する。

---

## 8. SITE / INFORMATION ARCHITECTURE

### P0/P1候補
- `/` : Public LP
- `/app/` : Free/Public Sales OS
- `/opportunities/...` : SEO可能な案件ページ候補
- `/categories/...` : 技術/テーマ別案件ページ候補
- `/guides/...` : 公共営業ガイド候補
- `/tools/...` : 無料診断/無料ツール候補

### REQ-SITE-001
LPと実アプリの説明内容を常に同期し、実装済み機能を「未提供」と表示しない。

### REQ-SITE-002
LPからFree Appへの明確なCTAを設置可能とする。

### REQ-SITE-003
SEO用ページを量産する場合、duplicate/thin-contentを避ける設計とする。

### REQ-SITE-004
案件ページでは公的原典へのリンク、情報源、網羅性非保証等を適切に表示する。

---

## 9. ACQUISITION REQUIREMENTS

### REQ-ACQ-001
Primary acquisitionをOrganic / SEOとし、Direct / Referral / Otherも識別できるprivacy-safeな流入計測を実装する。

### REQ-ACQ-002
以下の検索意図へ対応可能なコンテンツ構造を持つ。
- 技術キーワード + 公共案件
- 自治体/省庁 + システム開発
- 入札参加資格
- 公共営業初心者向けHow-to
- 自社に合う公共案件診断

### REQ-ACQ-003
有料広告はM3の必須前提としない。

### REQ-ACQ-004
外部への大量DM、電話営業、能動的個別営業を標準獲得チャネルとしない。

---

## 10. ONBOARDING / COMPANY PROFILE

### REQ-ONB-001
Free利用開始時は必要最小限の企業プロフィールを登録可能とする。

### Profile候補
- 会社名
- 業種
- 従業員規模
- 主な提供サービス
- 得意技術
- 対応地域
- 希望案件規模
- 公共案件経験
- 全省庁統一資格
- その他資格/認証
- 公共/民間実績

### REQ-ONB-002
全項目入力を初回必須にせず、利用価値に必要な最小項目から開始できること。

### REQ-ONB-003
プロフィール完成度を表示し、不足項目を追加すると推薦精度がどう改善するか説明する。

### REQ-ONB-004
無料診断データと企業プロフィールを将来的に統合できる構造とする。

---

## 11. PUBLIC OPPORTUNITY DATA

### REQ-DATA-001
第一データ源は官公需情報ポータル等の正式・公開情報を優先する。

### REQ-DATA-002
競合サービスのデータ無断取得・転載を行わない。

### REQ-DATA-003
取得不能情報をAIやルールで事実として補完しない。

### REQ-DATA-004
原典情報・構造化事実・OS判定・AI生成情報をデータ/UI上で識別可能にする。

### REQ-DATA-005
API障害時は既存キャッシュ等による安全な縮退を可能とする。

---

## 12. OPPORTUNITY SEARCH / DISCOVERY

### CURRENT BASELINE / MUST PRESERVE
- 実公共案件検索
- 案件一覧
- 案件詳細
- キーワード検索
- 地域/発注機関等絞り込み
- 原典URL

### REQ-SRCH-001
求人検索型の直感的な検索UIとする。

### REQ-SRCH-002
検索条件候補:
- キーワード
- 技術/業務カテゴリ
- 地域
- 発注機関
- 公告期間
- trusted deadline
- 新着
- 公示方式

### REQ-SRCH-003
検索結果の並び替えは、データ上成立する範囲で以下を提供可能とする。
- おすすめ順
- 新着順
- 締切順
- 適合度順

---

## 13. RECOMMENDATION / DECISION ENGINE

### REQ-DEC-001
企業プロフィール + 案件情報を用いて自社向け案件を推薦する。

### REQ-DEC-002
判定は以下を分離する。
- Hard Gate / structured rule
- Fit / relevance
- AI explanatory assistance

### REQ-DEC-003
出力:
- GO
- WATCH
- NO-GO

ただしこれは正式な参加資格判定ではなく、営業優先順位の参考判定とする。

### REQ-DEC-004
必ず理由を表示する。
例:
- 技術領域一致
- 対応地域一致
- 規模一致
- 資格要確認
- 実績要件要確認

### REQ-DEC-005
不足データがある場合は「情報不足 / 要確認」と表示する。

---

## 14. WATCH

### CURRENT BASELINE / MUST PRESERVE
WATCH追加・解除・一覧・永続化。

### REQ-WATCH-001
WATCHは求人サイトにおける「気になる」に相当する軽量な保存行動とする。

### REQ-WATCH-002
WATCH一覧で以下を確認可能にする。
- 案件名
- 発注機関
- 現在判定
- trusted deadline
- 更新有無
- 適合度/理由

### REQ-WATCH-003
将来の通知・締切・応募準備へ接続できるデータ構造とする。

---

## 15. NEXT ACTION / APPLICATION PREP

### CURRENT BASELINE
非永続NEXT ACTION / 応募準備チェック。

### REQ-APP-001
GO案件では「次に何をするか」を段階表示する。

例:
1. 原典確認
2. 参加資格確認
3. 説明会/質問期限確認
4. 必要書類確認
5. 見積/提案準備
6. 提出

### REQ-APP-002
P1では応募準備進捗を永続保存可能にする。

### REQ-APP-003
応募準備開始はM3上の強いProduct Usage Evidenceとして計測する。

---

## 16. AI PUBLIC SALES CONCIERGE

### P1 CORE VALUE
AI公共営業コンシェルジュを、現在の事業価値の重要構成要素とする。

### REQ-AIC-001
案件詳細から現在の案件コンテキストを引き継いで質問できること。

### Quick Questions候補
- この案件は自社に合いそう？
- 何を確認すべき？
- 参加条件を整理して
- 注意点は？
- 次に何をすればいい？
- 見送る理由は？

### REQ-AIC-002
回答は公的原典、案件情報、企業プロフィールを優先し、回答根拠を示す。

### REQ-AIC-003
AIは以下を単独決定しない。
- 正式参加資格
- 法的適格性
- 必須資格の充足
- 締切
- 金額
- 原典の参加条件

### REQ-AIC-004
不明な場合は推測せず「原典確認が必要」と回答する。

### REQ-AIC-005
将来的にAI self-resolution率を取得できる設計を検討する。

---

## 17. HOME / DAILY OPERATING EXPERIENCE

### REQ-HOME-001
Homeは検索フォーム中心ではなく、公共営業を日々回すための画面とする。

優先候補:
1. 今日やること
2. あなたへのおすすめ案件
3. 新着案件
4. 締切間近
5. WATCH更新
6. OS/AIからの提案

### REQ-HOME-002
代表/利用者が短時間で「今日見るべきこと」を把握できること。

---

## 18. UI / UX

### DECISION
「公共案件版の求人・就活サイト」をメンタルモデルとする。

### REQ-UX-001
求人サイトの情報設計・操作パターンを参考にしてよいが、ブランド・ロゴ・配色・コピー・具体レイアウトを模倣しない。

### REQ-UX-002
モバイル主要ナビ候補:
- ホーム
- 検索
- WATCH
- AI相談
- マイページ

### REQ-UX-003
案件カードは最低限以下を短時間で理解できること。
- 案件名
- 発注機関
- GO/WATCH/NO-GO
- 適合理由
- 要確認
- 締切（trustedのみ）
- CTA

### REQ-UX-004
原典情報とAI/OS判断を視覚的に区別する。

### REQ-UX-005
主要操作はスマホで無理なく実行可能とする。

---

## 19. RETENTION REQUIREMENTS

### REQ-RET-001
単発検索ツールではなく、継続利用する理由を構築する。

Retention Driver候補:
- 新着おすすめ
- WATCH更新
- 締切通知
- 応募準備進捗
- AI相談履歴
- 公共営業準備度
- 発注機関研究

### REQ-RET-002
通知機能は、Free枠/コスト/ユーザー価値を確認して段階導入する。

---

## 20. FREE / PAID MODEL

### HYPOTHESIS
Free → Starter / Standard / Pro等の月額SaaSを検討する。

### REQ-MON-001
料金額・プラン数は現時点で正式決定しない。

### REQ-MON-002
実課金導入前にユーザー承認を必須とする。

### PROPOSAL: Value Boundary
#### Free候補
- 基本案件検索
- 基本プロフィール
- 限定WATCH
- 基本おすすめ
- GO/WATCH/NO-GO概要
- 基本NEXT ACTION

#### Paid候補
- 高度推薦
- AIコンシェルジュ
- WATCH/通知拡張
- 応募準備永続管理
- 高度締切管理
- 発注機関研究
- 高度分析
- チーム共有
- サポート拡張

### REQ-MON-003
Freeで価値体験を成立させ、有料化のために基本価値を意図的に壊さない。

### REQ-MON-004
有料化前に、Activated ICP usersのpurchase intentを計測する。

---

## 21. SUPPORT MODEL

### PROPOSAL
Support階層:
1. FAQ / ガイド
2. AI Concierge
3. 標準化有人サポート
4. 必要時のみ専門家エスカレーション

### REQ-SUP-001
代表本人が通常問い合わせへ直接対応しなくても運営可能な設計を優先する。

### REQ-SUP-002
AIで回答できない法的・契約的・正式資格判断を無理にAIで処理しない。

### REQ-SUP-003
有人サポートを正式に提供する場合、対象範囲・対応時間・責任境界・コストを事前定義する。

---

## 22. EVIDENCE / ANALYTICS

### CURRENT BASELINE
D1 Product Usage Event + GitHub Actions OIDCによるsanitized Evidence exportを維持する。

### REQ-EVD-001
以下を分離する。
- Technical Evidence
- Human UAT
- Product Usage
- Purchase Intent
- Paid Conversion
- Retention

### REQ-EVD-002
未取得KPIを0や推測で補完しない。

### REQ-EVD-003
test/smoke/e2e等の合成利用を市場Evidenceへ混入させない。

### REQ-EVD-004
release_versionを正しく付与し、CR-005以降も版別比較可能にする。

### REQ-EVD-005
生のPII / company text / keyword / client identifierをEvidence artifactへ出力しない。

---

## 23. M3 KPI

### Acquisition
- organic / direct / referral / other
- landing page users
- LP→Free App transition

### ICP
- ICP-qualified profiles/users
- ICP ratio

### Activation
正式定義候補:
`profile complete → search/recommendation → opportunity detail → WATCH/GO/NEXT ACTIONのいずれか`

計測:
- activation users
- activation rate
- time to activation

### Decision Funnel
- search → detail
- recommendation → detail
- detail → WATCH
- detail → GO
- detail → application_prep
- NEXT ACTION views

### Retention
- repeat use
- 7-day retention candidate
- 14-day retention candidate

### Monetization
- pricing view/click
- usage interest
- activated ICP purchase intent
- paid conversion（将来）

### Operations
- support interactions
- AI self-resolution candidate
- Owner Hours

---

## 24. M3 EXIT CRITERIA

### REQ-M3-001
Technical PASSをMarket Demand PASSへ読み替えない。

### REQ-M3-002
M3正式判定前に、判定対象期間・最低母数・主要KPI閾値をHYPOTHESISとして固定する。

### CONTINUE条件の方向性
複数のICPユーザーにおいて、検索だけでなくWATCH/GO/NEXT ACTION/再訪等のLevel 4行動が確認され、かつpurchase intentが観測されること。

### MODIFY条件の方向性
流入はあるがActivationが弱い、非ICP利用が中心、検索は使われるが意思決定行動へ進まない、Retentionが弱い等。

### HOLD / STOP条件の方向性
合理的なInbound検証期間・最低母数を確保した後も、ICP利用・Activation・再訪・Purchase Intentがほぼ確認できず、改善仮説にも支持Evidenceがない場合。

### REQ-M3-003
数値閾値は初回正式snapshot取得前に別途M3 Measurement Planで固定する。後付けで有利な閾値へ変更しない。

---

## 25. FINANCIAL REQUIREMENTS

### REQ-FIN-001
正式有料化前に以下をモデル化する。
- ARPU
- 顧客数
- 売上
- 固定費
- 変動費
- AI利用費
- サポート費
- 粗利益
- 粗利益率
- 損益分岐点
- Owner Hours
- 利益 / Owner Hour

### REQ-FIN-002
月100万円利益目標に対して、必要顧客数と運営負荷が現実的か確認する。

### REQ-FIN-003
費用発生するインフラ・AI API・SaaS・有人サポート採用はユーザー承認前に導入しない。

---

## 26. OWNER HOURS / AUTOMATION

### REQ-OH-001
Evidence集計・データ更新・定型レポート・基本サポートは可能な限りAI/システムへ移管する。

### REQ-OH-002
M3からOwner Hoursを実績計測する。

### REQ-OH-003
以下をOwner Hoursに含める。
- 障害対応
- 手動データ確認
- 顧客対応
- Evidence確認
- 例外処理
- 運用作業

### REQ-OH-004
安定運用時に代表3時間/週程度へ近づけられない構造は再設計候補とする。

---

## 27. SECURITY / PRIVACY / AI GOVERNANCE

### REQ-SEC-001
HTTPS / same-origin / XSS / CSRF / SSRF / IDOR等、既存対策を維持する。

### REQ-SEC-002
PIIや顧客入力を外部AIへ送信する場合は、利用範囲・送信先・目的を明確化しユーザー承認要件を確認する。

### REQ-SEC-003
AI生成結果を正式条件と誤認させない。

### REQ-SEC-004
重要判断では原典へのアクセス手段を提供する。

---

## 28. NON-FUNCTIONAL

### REQ-NF-001
Cloudflare / GitHub等のFree枠を優先し、初期0円・月額固定0円を可能な限り維持する。

### REQ-NF-002
無料枠上限到達時に自動で有料プランへ移行しない。

### REQ-NF-003
スマホ/PC対応。

### REQ-NF-004
主要画面は通常利用で高速に表示され、過剰なAPI呼び出しを避ける。

### REQ-NF-005
データソース障害時に壊れた判定を表示せず、縮退/エラー状態を明示する。

---

## 29. CURRENT PRODUCTION BASELINE

### FACT / IMPLEMENTED
- 実公共案件検索
- 案件一覧/詳細
- 原典リンク
- 企業プロフィール
- おすすめ案件
- GO/WATCH/NO-GO
- 判定理由
- WATCH
- NEXT ACTION
- Product Usage Event
- Evidence export
- 求人サイト型UI
- スマホ/PC
- 初期0円/月額固定0円

### QUALITY
- Automated Test: 109/109 PASS
- Production Technical E2E: PASS
- Human re-UAT: 案件表示 PASS / WATCH PASS / Visual acceptance PENDING

---

## 30. GAP FROM CURRENT PRODUCTION

### P0 / M3 READY
1. Human Visual UAT最終受入
2. CR-005 release_version Evidence Integrity修正
3. LP文言を現Productionへ同期
4. LP → `/app/` Activation導線
5. acquisition_source計測
6. M3 Measurement Plan / Exit Criteria固定
7. Owner Hours計測開始

### P1 / VALUE VALIDATION
1. AI公共営業コンシェルジュ
2. 応募準備永続進捗
3. 公共営業準備度統合
4. trusted deadlineベース締切管理
5. 高度な今日やること
6. retention導線

### P2 / SCALE / MONETIZATION
1. SEO案件/カテゴリ/ガイドページ拡張
2. 発注機関研究
3. チーム共有
4. 高度分析
5. plan entitlement
6. billing/payment
7. 標準化有人サポート

※P2の課金/正式有人サポートは別途APPROVAL必須。

---

## 31. PRIORITY PRINCIPLE

機能追加数ではなく、以下の順に優先する。

1. M3 Evidence Integrity
2. Activation
3. Decision Value
4. Retention
5. Purchase Intent
6. Owner Hours
7. Monetization
8. Scale

Evidence不足の状態で高度機能を大量開発しない。

---

## 32. HUMAN APPROVAL GATES

以下は明示承認なしに正式決定・実行しない。
- 正式料金
- 実課金
- 有料外部サービス契約
- 有料広告
- 本格事業開始/正式公開方針
- 有人サポート正式提供
- 個人情報の新しい外部利用
- 顧客情報の外部送信
- 大規模な追加投資
- 事業停止/撤退

---

## 33. SUCCESS CRITERIA FOR REQUIREMENTS v1.0

本Requirementsの目的は「文書を作ること」ではない。

以下が成立して初めて再ベースライン完了とする。

1. 現在の事業モデルと製品要件が矛盾していない
2. 現Productionの保全対象が明確
3. Free/Paid未決事項がHYPOTHESISとして分離されている
4. Acquisition→Activation→Retention→Monetizationの流れが定義されている
5. AI安全境界が定義されている
6. M3 KPIとEvidence Integrity要件が定義されている
7. Owner Hours要件が組み込まれている
8. P0/P1/P2の優先順位が明確
9. 実装変更箇所のみ再設計/READY_TO_BUILD対象にできる
10. 料金・課金・重大戦略をユーザー承認なしで確定していない

---

## 34. NEXT DEVELOPMENT FLOW

Requirements v1.0 DRAFTレビュー後:

1. BUSINESS_MODEL_SPEC v1.0整合確認
2. PRODUCT_CONCEPT整合確認
3. CUSTOMER_JOURNEY / FUNNEL確定
4. FREE / PAID FEATURE MATRIX HYPOTHESIS作成
5. M3 MEASUREMENT PLAN作成
6. CURRENT Production GAP確定
7. BASIC_DESIGN impact
8. UI_DESIGN impact
9. DETAIL_DESIGN impact
10. DATA/API/Event impact
11. SECURITY REVIEW
12. TEST_PLAN更新
13. BLOCKING判定
14. READY_TO_BUILD再判定
15. P0のみ実装
16. M3市場Evidence取得
17. Evidenceに応じP1/P2を再評価

---

## 35. CURRENT STATUS AFTER RE-BASELINE DRAFT

- Business Model: direction defined
- Current Production: technically operational
- Human UAT: partial pass
- Requirements v1.0: DRAFT
- Market Demand: UNKNOWN
- Purchase Intent: UNKNOWN / formal aggregated snapshot pending
- Paid Conversion: NOT STARTED
- Owner Hours: UNKNOWN
- Formal SaaS launch: NOT DECIDED
- Formal Pricing: NOT DECIDED
- Next milestone: Requirements v1.0 review + M3 readiness
