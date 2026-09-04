# COMPETITIVE POSITIONING DRAFT｜公共営業 意思決定OS

- 文書ID: AIMOS-CMP-001
- 版数: v0.1-draft
- 状態: DRAFT / STRATEGY REVIEW
- 作成日: 2026-09-04
- 対象: 公共営業 意思決定OS
- 関連: REQUIREMENTS_V1_DRAFT.md / Issue #24

## 1. PURPOSE

主要競合（Labid / NJSS / GovReach等）に対し、機能数・データ件数の単純な追随ではなく、対象顧客にとっての意思決定価値、使いやすさ、価格公平性、低Owner Hours運営を軸に勝ち筋を定義する。

## 2. CURRENT COMPETITIVE FINDING

### FACT / PUBLIC EVIDENCE
- NJSSは大規模な最新案件・過去落札データ、AIレコメンド、案件管理、AIリサーチ、提案書作成支援等を提供している。
- Labidは案件検索、AI要約、レコメンド、案件管理、提案書作成、行政リサーチ等へ拡張している。
- GovReachは公共営業初心者向けの無料診断・案件検索・複数無料ツール・解説コンテンツを広く提供している。

### CONCLUSION
「情報量No.1」「機能数No.1」「AI機能最多」を短期の勝ち筋にしない。

## 3. PROPOSED POSITIONING

> **小規模IT企業が、専任公共営業担当なしでも、毎日短時間で『見るべき案件・見送る案件・次にやること』を判断できる公共営業OS**

競争軸を以下へ移す。

1. 情報量 → **意思決定密度**
2. 高機能 → **迷わなさ**
3. 案件数 → **自社に関係ある案件率**
4. GO件数 → **無駄打ち削減を含む判断品質**
5. 多機能ダッシュボード → **30秒把握**
6. 営業支援一般 → **5〜30人IT企業特化**
7. 高額・見積型 → **顧客価値を残すWin-Win価格**
8. 人的CS依存 → **AI self-service中心**

## 4. UX STRATEGY

### 4.1 Home
最上部は検索窓ではなく次を優先する。
- 今日見るべき案件
- GO候補
- WATCH更新
- 締切/要確認
- 今日のNEXT ACTION

### 4.2 Card
情報を増やすだけではなく、判断に必要な順番で表示する。
- GO/WATCH/NO-GO
- 案件名 / 発注機関
- 自社に合う理由 2〜3点
- 要確認 1〜3点
- trusted deadline
- 応募負荷の目安（根拠が取れる範囲）
- 原典
- CTA: WATCH / 応募準備 / AI相談

### 4.3 Detail
詳細画面は「全文表示」ではなく二層構造にする。

第一層: 30秒判断
- 結論
- 理由
- Hard Gate
- 期限
- NEXT ACTION

第二層: 深掘り
- 仕様概要
- 資格・条件
- 発注機関
- 関連資料
- 原典
- AI質問

### 4.4 Information Density
競合より情報量が少なく見える問題は、単純な文字追加ではなく、
- 情報カテゴリ
- KPI/タグ
- 要約
- 展開式詳細
- 原典リンク
で「必要なら深く見られる」構造にする。

## 5. DIFFERENTIATION FEATURES

### P0 / M3
- Small-IT ICP特化
- GO/WATCH/NO-GOの明確化
- NO-GO理由の価値化
- NEXT ACTION
- 原典とAI判断の分離
- LP→Free App導線
- Acquisition/Activation計測

### P1
1. AI公共営業コンシェルジュ
2. 応募準備ナビ永続化
3. 公共営業準備度
4. trusted deadline管理
5. 今日やること
6. 案件比較（2〜3件を判断軸で比較）
7. Decision Log（なぜGO/NO-GOにしたか）

### P2 / Evidence after demand
- 提案書作成支援
- 発注機関/行政リサーチ
- チーム共有
- 高度分析

Labid/NJSSの全機能をM3前に追随しない。

## 6. SUCCESS METRICS

競合比較の主KPIを「情報件数」ではなく以下とする。
- Time to First Value
- 30秒以内に見るべき案件を判断できる率
- recommendation→detail
- detail→WATCH/GO
- NO-GOによる無駄打ち回避
- NEXT ACTION到達率
- repeat / retention
- 顧客の公共営業時間削減
- paid willingness / value-to-price ratio
- Owner Hours

## 7. RISK

### R-01 Feature Gap
競合の機能量が大きく、見た目で劣後と判断される。
対応: 情報階層と意思決定画面を強化。必要な深さを確保する。

### R-02 Data Breadth
NJSS等の独自収集データ量に短期では勝てない。
対応: 網羅性を誇張せず、ICP適合率・意思決定価値で競う。

### R-03 Competitor Expansion
Labid/NJSSが意思決定支援領域へさらに進出する。
対応: Small-IT特化、透明なHard Gate、Win-Win価格、Free-first、初心者UXを深掘りする。

## 8. DECISION RECOMMENDATION

PROPOSAL:
**競争戦略を『競合と同じ情報OSを作る』から『小規模IT企業向けDecision-First Public Sales OS』へ明確化する。**

これは正式な重大戦略変更のユーザー承認前提。Requirements v1.0では差分候補として扱う。
