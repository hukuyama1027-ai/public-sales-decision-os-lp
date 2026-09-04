# PUBLIC SALES / ADJACENT OPPORTUNITY SCAN

- 文書ID: AIMOS-OPP-001
- 版数: v0.1
- 状態: DRAFT / STRATEGIC_CHECKPOINT_INPUT
- 作成日: 2026-09-04
- Related: Issue #25
- 目的: 強競合を前提に、公共営業市場内外で相対的に競争が弱く、低Owner Hours・低固定費・月100万円利益と整合する未解決課題を再探索する。

## 1. 結論

現時点で、以下はレッドオーシャン寄りと判断する。
- 入札案件検索
- AI案件推薦 / Bid-No-Bid
- 仕様書AI要約
- 提案書自動生成
- 入札参加資格の期限管理
- 落札価格/競合分析

相対的な空白候補として最も有望なのは、

> **Public-Sector SaaS Readiness OS**
> SaaS / AI / IT企業が「行政に売れる状態」になるまでの準備・適合・証跡を一元管理するOS。

DMP単体ではなく、全省庁統一資格、DMP、ISMAP / ISMAP-LIU、自治体セキュリティ要件、生成AI調達ルール、契約・知財、必要証跡、更新差分を統合対象とする。

## 2. Evidence

### E-001 Public procurement entry remains procedurally complex
デジタル庁DMPは中小・スタートアップ参入促進を目的とする一方、事業者登録には全省庁統一資格、GビズID、参加要領・基本契約への適合が必要。
Source: デジタル庁 DMP / 2026年度DMP申請募集
Evidence Strength: L2

### E-002 Security/compliance requirements are evolving
2026-06-12改定のDS-920は生成AI調達・利用についてNormativeなガイドラインとなり、高リスク判定、調達チェック、契約チェック等を含む。ISMAP-LIUも2025以降拡張され、SaaS事業者の行政販売要件は変化が続いている。
Source: デジタル庁 DS-920 / ISMAP-LIU
Evidence Strength: L2

### E-003 Public procurement support is an active policy priority
政府・自治体はスタートアップ公共調達拡大を政策的に推進し、東京都も公共調達サポート窓口を設置。政府資料ではスタートアップ側・調達側双方のノウハウ不足、契約・資金負担等が課題として明示されている。
Source: METI / 内閣府 / 東京都
Evidence Strength: L2

### E-004 Qualification management alone is already served
NJSS系「入札資格ポータル」は資格一元管理、更新通知、受付情報提供を無料/有料で提供。
Conclusion: 資格管理単体は参入優先度を下げる。
Evidence Strength: L3

### E-005 Bid/No-Bid and proposal AI are crowded
NJSS、Labid、入札LAB、BidNavigator、提案書系AI等が推薦・仕様書解析・提案書生成・競合分析へ拡張。
Conclusion: 現行総合公共営業OSの正面競争は不利。
Evidence Strength: L3

### E-006 Public-specific readiness tooling appears less consolidated
Web探索では、自治体SaaS適合セルフチェックや個別コンサル/セキュリティ回答SaaSは確認できるが、DMP + 資格 + ISMAP/LIU + DS-920 + 契約/知財 + 証跡を公共調達文脈で統合するセルフサービスOSは目立たない。
注意: 検索で見つからないことは「競合ゼロ」の証明ではない。
Evidence Strength: L2

## 3. Opportunity Candidates

| Candidate | Pain | Competition White-space | WTP | Automation | Inbound Fit | Owner Hours Fit | Asset Reuse | Overall |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| A. Public-Sector SaaS Readiness OS | 5 | 4 | 4 | 4 | 5 | 4 | 3 | 4.2 |
| B. DMP Registration / Optimization Navigator | 4 | 4 | 3 | 5 | 5 | 5 | 2 | 4.0 |
| C. Public Procurement Compliance / Evidence Vault | 4 | 3 | 4 | 4 | 4 | 4 | 2 | 3.6 |
| D. Bid / No-Bid Decision AI | 5 | 1 | 4 | 4 | 3 | 4 | 5 | 3.4 |
| E. Tender Amendment / Q&A Monitor | 3 | 2 | 2 | 5 | 3 | 5 | 4 | 3.2 |
| F. Partner / Consortium Matching | 4 | 3 | 4 | 2 | 2 | 1 | 2 | 2.8 |
| G. Qualification Management Only | 4 | 1 | 3 | 4 | 3 | 4 | 2 | 2.8 |

※数値は現時点のAI評価/HYPOTHESIS。市場FACTではない。

## 4. Recommended Wedge

### PRODUCT HYPOTHESIS
**「あなたのSaaS/AIは行政に売れる状態か？」を5〜10分で判定し、足りないものを順番に埋める公共SaaS参入準備OS。**

### Target
- SaaS / AI / Web / DX系の小規模〜中小企業
- 民間向けには販売実績があるが公共販売経験が浅い企業
- 公共調達に参入したいが、資格・DMP・セキュリティ・契約要件が分からない企業

### Core Jobs
1. 自社サービスが国/自治体へ販売可能な状態か知る
2. 必要な資格/認証/アカウント/文書を知る
3. DMP登録可能性と不足条件を知る
4. ISMAP/ISMAP-LIU/LGWAN等の必要性を誤解なく整理する
5. 生成AI製品ならDS-920対応ギャップを確認する
6. 行政提出用のセキュリティ・契約・AI説明証跡を再利用可能な形で管理する
7. 制度改定時に「自社に何が影響するか」だけ知る

### MVP
- 無料 Public-Sector Readiness診断
- Requirement route判定（国 / 自治体 / DMP / AI等）
- Gap list
- Priority / next action
- Evidence vault
- Source/date付き根拠
- Regulation update impact alert

### Differentiation
案件情報量では競争しない。
「公共営業を始める前に、行政へ売れる状態をつくる」ことに集中する。

## 5. Business Model HYPOTHESIS

### Free
- Readiness診断
- 主要要件のギャップ表示
- 公開ガイド

### Paid
- 継続Readiness管理
- 複数サービス管理
- Evidence Vault
- DS-920/セキュリティ回答支援
- 制度変更差分通知
- DMP/資格/認証ロードマップ
- 公共案件ごとのReadiness照合

正式料金は未決定。Win-Win Pricing原則を適用し、顧客の工数削減・外注回避・商談機会価値の一部のみを取得する。

## 6. Risks

- 法務・セキュリティ判断をAIが保証すると高リスク。公式根拠 + 参考判定 + 専門家確認境界が必要。
- DMPだけに絞るとTAMが狭い可能性。
- 制度変更追従が必要。
- ISMAP等は専門性が高く、完全自動回答は不可。
- generic security questionnaire SaaSは既に存在するため、公共調達特化が必要。

## 7. Current Recommendation

- 現行「総合公共営業OS」の大型P1拡張はHOLD。
- Public-Sector SaaS Readiness OSを最優先HYPOTHESISとして追加調査/需要検証する。
- 現行検索/WATCH基盤は、将来「Readinessを満たした企業へ狙える案件を提示」する補助機能として再利用可能。
- 事業停止/Pivotは未決定。次GateでEvidence比較後にユーザー決定。

## 8. NEXT ACTION

1. Readiness OSの競合深掘り
2. 対象検索需要/公開相談・FAQ・制度資料からPain Evidence強化
3. MVP / Free tool仮説作成
4. 月100万円利益に必要な顧客数・ARPU・粗利益試算
5. 現行Public Sales OS継続案との比較
6. CONTINUE / PIVOT / HOLD提案
