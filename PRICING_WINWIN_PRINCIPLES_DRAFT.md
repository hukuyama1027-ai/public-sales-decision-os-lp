# PRICING WIN-WIN PRINCIPLES DRAFT｜公共営業 意思決定OS

- 文書ID: AIMOS-PRC-001
- 版数: v0.1-draft
- 状態: DRAFT / HYPOTHESIS
- 作成日: 2026-09-04
- 関連: REQUIREMENTS_V1_DRAFT.md / Issue #24
- 注意: 正式価格・正式課金開始・有料プラン確定を意味しない。すべてユーザー承認前の料金設計原則・検証仮説。

## 1. PURPOSE
顧客と事業者の双方が継続的に利益を得られる料金体系を設計する。短期売上最大化より、顧客価値・継続率・Owner Hours・粗利益の両立を優先する。

## 2. WIN-WIN原則
### PRC-001 Customer Value First
料金は顧客が受け取る価値の一部とし、顧客が保守的に見積もった価値を上回る価格を前提としない。

### PRC-002 Downside Protection
Freeまたは十分な無料体験で価値確認後に有料へ移行できることを基本とする。正式課金時には解約条件・課金単位・更新条件を明瞭化し、不要なロックインを避ける。

### PRC-003 Free Must Be Useful
Freeを機能不全の体験版にしない。案件発見・基本検索・原典確認等、公共営業を試すための独立した価値を残す。

### PRC-004 Paid Sells Outcomes, Not Access
有料価値は単なるデータ閲覧権より、時間削減・判断支援・継続管理・応募準備・AI伴走等の追加Outcomeに置く。

### PRC-005 NO-GO Is Value
不要な案件を見送れることも顧客価値とする。GO件数や応募件数を増やすために判定を歪めない。

### PRC-006 No Guaranteed Winning Claims
落札・受注・利益を保証しない。料金根拠として不確実な落札期待値を過度に使用しない。

## 3. CUSTOMER VALUE FORMULA（HYPOTHESIS）
月間保守価値は、まず観測しやすい以下を中心に算定する。

Customer Conservative Value =
- 案件探索・公告確認の削減時間 × 顧客側時間単価
- 参加条件/期限/次行動整理の削減時間 × 顧客側時間単価
- 既存ツール・外注等を代替した場合の回避コスト

案件獲得確率向上や契約額の期待値はUpsideとして別表示し、価格の主要根拠にはしない。

## 4. PRICE-TO-VALUE GUARDRAIL（HYPOTHESIS）
正式価格候補は、M3で実測した顧客価値との比率で評価する。

初期仮説:
- 月額料金は顧客の保守的な月間実現価値の概ね1/4〜1/3以下を目安候補とする。
- 少なくとも顧客側に料金の約3倍以上の保守価値余地がある状態を狙う。

この比率はFACTではなくM3検証用HYPOTHESIS。WTP、Retention、解約理由、実測時間削減で更新する。

## 5. PLAN DESIGN HYPOTHESIS
### Free
目的: 集客・Activation・価値確認。
候補:
- 公共案件検索
- 原典確認
- 基本案件詳細
- 限定的WATCH/プロフィール/おすすめ等

### Paid Core
目的: 時間削減・意思決定・継続運用。
候補:
- 高度おすすめ/判定理由
- WATCH/通知/締切管理
- 応募準備進捗
- AI公共営業コンシェルジュ
- 継続管理

### Higher Tier
目的: 複数人利用・高度運用。
候補:
- チーム共有
- 高度分析
- 発注機関研究
- より高いAI利用枠

正式なプラン名・機能境界・価格は未決定。

## 6. FAIRNESS / CUSTOMER PROTECTION
- 隠れた初期費用を前提にしない。
- 自動的な長期契約を初期標準にしない。
- 長期契約を採用する場合は割引等の明確な顧客メリットを必須とする。
- 利用量超過で予期せぬ高額請求が発生する設計を避ける。
- 価格変更は既存顧客へ事前通知し、重要変更時は移行選択肢を用意する。
- AI/データ品質の制約を明示する。

## 7. M3 PRICING EVIDENCE
正式価格決定前に最低限取得する候補:
- 実利用者のprice interest
- Activated ICP userのWTP
- 実測時間削減
- repeat/7日/14日Retention
- 有料機能候補の利用意向
- 解約/非利用理由
- Freeで十分と感じる範囲
- 支払うなら何の価値に払うか

## 8. BUSINESS SIDE GUARDRAIL
Win-Winでも事業が赤字では継続できないため、同時に以下を評価する。
- 粗利益率
- AI/API等の変動費
- Support Cost
- Owner Hours
- Profit / Owner Hour
- CAC
- LTV（実績取得後）

顧客価値を守りつつ、事業側も再現可能・自動化可能・継続可能な価格であることを正式価格条件とする。

## 9. DECISION STATUS
PROPOSAL:
『顧客が保守的に見積もった価値の一部だけを受け取り、Freeで価値確認でき、不要なロックインを避ける』を公共営業OSのPricing Principleとする。

正式価格のDECISIONはM3の実利用・WTP・時間削減Evidence取得後にユーザー承認で行う。