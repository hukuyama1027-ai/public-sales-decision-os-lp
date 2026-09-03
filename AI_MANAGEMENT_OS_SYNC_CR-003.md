# AI経営OS連携書｜公共営業 意思決定OS CR-003 P0

- 文書ID: AIMOS-MGMT-SYNC-003
- 版数: v0.1
- 状態: ISSUED
- 発行日: 2026-09-03
- 送信元: AIシステム開発会社
- 連携先: `00｜AI経営ダッシュボード` / `01｜AI経営OS・GOAL実行`
- 対象: 公共営業 意思決定OS｜需要検証LP + 無料版公共営業OS
- Active Change: AIMOS-CR-003

## 1. 連携目的
M3「市場・需要検証」に対して、LP反応だけではなく、実公共案件を使ったプロダクト利用Evidenceを本番で取得できる状態へ到達したことをAI経営OSへ返却する。

**注意:** 今回の成果は「需要が証明された」ことではない。`実利用Evidenceを収集できるProduction基盤が完成した`ことを意味する。市場需要KPIの成否判定は、今後の実ユーザー利用データを取得した後に行う。

## 2. GOAL更新
### 上位GOAL
できるだけ代表本人が楽をしながら、継続的に月100万円以上の利益を得られる事業を構築する。

### 本案件GOAL
小規模IT企業向け「公共営業 意思決定OS」について、フル開発前に需要と継続利用可能性をEvidenceで検証する。

### 今回の到達点
需要検証LPに加え、実官公需案件を検索・判定・WATCH・おすすめ表示できる無料版P0をProductionへ投入し、利用Evidence計測可能状態へ移行した。

## 3. CURRENT STATE
- Phase: `P0_EVIDENCE_READY / HUMAN_VISUAL_UAT_PENDING`
- CR-003 P0実装: 100%
- SYSTEM UAT: PASS
- HUMAN VISUAL UAT: PENDING
- BLOCKING BUG: 0
- OPEN P0 BUG: 0
- Production: 稼働中
- Public URL: https://public-sales-decision-os-lp.pages.dev/
- Free App URL: https://public-sales-decision-os-lp.pages.dev/app/
- 初期費用: 0円
- 月額固定費: 0円（Free枠内）

## 4. MILESTONE更新
M3の状態を以下へ更新する。

`LP公開・反応計測準備` → `実プロダクト利用Evidence取得基盤 READY`

M3は未完了。次の判定対象は、技術完成ではなく実利用Evidenceである。

## 5. EVIDENCE
### 技術・Production Evidence
- GitHub Actions全自動テスト: 59/59 PASS / FAIL 0
- D1 CR-003 schema: PASS
- Cloudflare Production health: PASS
- `/app/` Production表示: PASS
- 官公需情報ポータル由来の実案件検索: PASS
- Profile save/read: PASS
- Opportunity detail: PASS
- GO/WATCH/NO-GO + 判定理由: PASS
- NEXT ACTION: PASS
- WATCH add/read/Home反映: PASS
- 自社おすすめ案件: PASS
- Production P0 E2E: SUCCESS
- E2Eテストデータcleanup: PASS

### 実公共案件Evidence例
Productionで `AI` 検索により以下を取得確認。
- 岡山大学クラウド型AI治験・研究参加候補者リクルートメント支援基盤検証作業業務
- 次世代創薬逆提案プラットフォーム構築に向けた生成AI基盤開発及び実証支援業務
- 被災者支援AIサービス概念実証用擬似データ生成業務
- AI・ビッグシミュレーション・ビッグデータ解析の大規模実行実現のための評価システム
- 医療用生成AI統合システム 1式

### Evidence計測可能イベント
本番D1で以下を収集可能。
- public_search
- public_search_result_view
- opportunity_detail_view
- watch_add
- company_profile_complete
- recommended_opportunity_view
- go_view / watch_view / no_go_view
- next_action_view

### Market Evidence
実顧客/実ユーザーによる需要KPIはまだ十分な観測値が確定していない。**0とはみなさず、未観測/未集計として扱う。**

## 6. DECISION
- Cloudflare Pages + Functions + D1のFree枠を継続利用する。
- 官公需情報ポータル公式APIをserver-side proxy経由で利用する。
- account/passwordを作らず匿名client token hash方式とする。
- source情報とOSの参考判断を分離する。
- 期限は取得できない場合に推測生成しない。
- おすすめは `service_relevant=true` のGO/WATCHのみ表示する。
- P1 AI機能は無料枠優先。費用発生はユーザー承認なしに採用しない。

## 7. LEARNING
1. 公共調達データは本文全文の単純キーワード一致だけでは誤推薦が発生する。
2. `AI` のような短い英字は `mail` や関連リンク等のノイズを拾うため、主題範囲と英数字境界が必要。
3. `システム / 開発 / 保守 / 運用` の一般語は、案件タイトル等の主題位置で評価しないと非IT案件を過大評価する。
4. Production E2Eを実案件で回すことで、単体テストだけでは見えない推薦品質問題を検出できた。
5. 技術Gate PASSと市場需要PASSは別物。今後は実利用Evidenceを主判定材料とする必要がある。

## 8. RISK / BLOCKER
### BLOCKER
- 技術BLOCKER: 0
- P0 BUG: 0

### RISK
- 官公需情報ポータルは全公共案件の網羅を保証しない。
- 原典により資格・締切等の項目欠損がある。
- Cloudflare D1 / Workers Free枠上限。
- 匿名token消失時に端末状態を復元できない。
- 公式API仕様変更。
- 最大の事業RISKは、基盤完成後も実ユーザー利用が集まらず需要Evidenceが得られないこと。

## 9. KPI更新
### System KPI
- Automated Tests: 59/59 PASS
- P0 Blocking Bugs: 0
- Production E2E: PASS
- Monthly Fixed Cost: 0円

### M3 Market KPI
既存の需要検証KPIは継続する。今回の開発によりプロダクト利用系Evidenceを追加取得可能になった。

現時点の実績値は、正式集計Evidenceがない項目について推測・0補完しない。

追加で見るべき利用指標:
- profile completion rate
- search users / searches per user
- search result → detail rate
- detail → WATCH rate
- recommended opportunity views
- GO/WATCH/NO-GO distribution
- next action views
- repeat usage / return rate（取得可能化後）

## 10. Owner Hours
- 今回のOwner Hours実績値: 未計測。推定しない。
- 残るユーザー必須作業: PC/スマホでの画面・操作感UAT。
- 技術実装・自動試験・Production E2E・品質修正・成果物同期はAI側で実施済み。

## 11. 代表判断待ち
現時点で新たな製品仕様判断は不要。

人間による受入として以下のみ残る。
- `/app/` のPC/スマホ操作感
- 検索→詳細→WATCHの分かりやすさ
- 判定理由/NEXT ACTIONが直感的に理解できるか

## 12. NEXT ACTION
優先順:
1. HUMAN VISUAL UATを実施・受入判定。
2. PASS後、P0をM3の正式Evidence取得基盤としてACCEPTEDにする。
3. 実ユーザー利用Evidence収集を開始・継続し、M3 KPIを更新する。
4. 実Evidenceで離脱/不足が見えた箇所を優先改善する。
5. P1（締切管理、今日やること、閲覧履歴、おすすめ理由、準備度、AIコンシェルジュ）は、M3 Evidence取得を阻害しない範囲で優先順位を決める。
6. Cron定期同期・USER_MANUAL/SETUP_GUIDE同期を完了条件に従い処理する。

## 13. AI経営OSへの状態反映指示
`00｜AI経営ダッシュボード` と `01｜AI経営OS・GOAL実行` は、この文書をEvidenceとして以下を反映すること。

- CURRENT STATE: `公共営業 意思決定OS CR-003 P0 = EVIDENCE_READY`
- MILESTONE: `M3 実プロダクト利用Evidence取得基盤 READY / 市場需要判定は継続中`
- EVIDENCE: 本書§5
- RISK: 本書§8
- DECISION: 本書§6
- LEARNING: 本書§7
- NEXT ACTION: 本書§12
- Owner Hours: `未計測 / 推定禁止`
- KPI: 本書§9
- 代表判断待ち: `Human Visual UATのみ`

## 14. 根拠成果物
- `PROJECT_STATE.md`
- `TEST_RESULT_CR-003.md` / AIMOS-LP-TR-003 v0.1
- `UAT_RESULT_CR-003.md` / AIMOS-LP-UAT-003 v0.1
- PR #6 `fix: improve CR-003 recommendation relevance`
- Production P0 E2E Run `33713292290`
