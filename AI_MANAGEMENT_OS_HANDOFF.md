# AI経営OS 連携資料｜公共営業 意思決定OS

- 文書ID: AIMOS-MGT-HO-001
- 版数: v0.1
- 状態: CURRENT_FOR_HANDOFF
- 作成日: 2026-09-04
- 対象Project: 公共営業 意思決定OS｜需要検証LP + 無料版公共営業OS
- 正式状態参照: `PROJECT_STATE.md`
- 開発ルール参照: AISC-PMP-001 / AIシステム開発会社 Project Master Prompt v0.1.3 CURRENT
- 主連携先: `01｜AI経営OS・GOAL実行`
- ダッシュボード反映先: `00｜AI経営ダッシュボード`

## 1. 最上位GOALとの関係
AI経営OSの既存最上位GOAL「できるだけ代表本人が楽をしながら、継続的に月100万円以上の利益を得られる事業を構築する」に対する、公共営業SaaS候補の需要・利用検証案件として扱う。

本案件自体の現在GOALは、従業員5〜30人程度の小規模IT企業向けに、公共案件を探す・判断する・WATCHする・次行動へ進む無料版公共営業OSを0円構成で公開し、M3市場検証に必要な実利用Evidenceを取得すること。

## 2. CURRENT STATE
- CR-005 Production Candidateを公開済み。
- Design / Implementation / Automated Test / Production Deploy / Production Technical E2Eは完了。
- Automated Test: 109 PASS / 0 FAIL。
- Productionで実案件 title / id / organization_name の取得を確認済み。
- ProductionでWATCH add / list / persistence / cleanupを確認済み。
- UIはHome/Search/WATCH/Profile/AIへオリジナルinline SVG illustrationを追加済み。
- 初回Cloudflare deployment failureは再deployで解消し、Issue #18はCLOSED。
- 技術BLOCKERは0。
- 未完了GateはHuman Visual re-UATとユーザー受入のみ。
- DONEではない。

## 3. 現在のMILESTONE
**M3｜市場・利用Evidence検証への移行直前**

現Gate:
`CR-005 Production Technical PASS → Human Visual re-UAT → User Acceptance → M3 Evidence accumulation/evaluation`

## 4. EVIDENCE
### 開発・品質Evidence
- CR-005 PR #17 merged
- Automated Test: 109 / 109 PASS
- Runtime implementation merge: `c03d05c44d17792f9547b66a4377421e8f135be8`
- Production main head: `a67e29023cd7f5afd06f908b552f94e18008a118`
- Cloudflare retry deployment id: `c338448f-ba62-468a-97ba-5745acf0b17c` / SUCCESS
- Post-deploy live-smoke job `100610621995`: SUCCESS
- Post-deploy production-e2e job `100610651453`: SUCCESS

### Human Evidence
2026-09-03のCR-004 Human UATで以下を確認。
- 案件名・発注機関が表示されない
- WATCH追加が `INVALID_INPUT`
- UIが簡素で、よりイラスト/アイコンが欲しい

このHuman EvidenceをCR-005へ反映済み。

## 5. DECISION
- Human UAT FAILを開発側の不具合/製品フィードバックとして正式処理した。
- 「案件表示」と「WATCH登録」は共通root causeとして修正した。
- UIは求人サイト型の情報設計を参考にするが、ロゴ・コピー・配色・HTML/CSSは模倣しない。
- オリジナルSVG/CSSのみで視覚的リッチさを追加し、外部有料assetは採用しない。
- 初期費用0円 / 月額固定費0円を維持する。
- AI未実装機能を実装済みと誤認させない。
- Human re-UAT PASS前にDONE扱いしない。

## 6. LEARNING
- API response shapeのflat/nested境界はフロントadapterで明示的に扱い、文字列`source`の存在だけでnested判定してはいけない。
- Production deploy完了前にlive-smokeを実行すると旧版へ成功判定する可能性がある。deploy完了後の再試験を正式Evidenceとする。
- 機能が動くだけでは受入にならず、ユーザーが感じる視覚的な豊かさ・分かりやすさも製品品質として扱う。
- Human UATのフィードバックを即Change Request化する運用は有効だった。

## 7. RISK / BLOCKER
### BLOCKER
- 技術BLOCKER: 0
- 受入Gate: Human Visual re-UAT待ち

### RISK
- Human re-UATで追加UI改善が必要になる可能性。
- M3の実利用母数が不足し、事業判断に十分なEvidenceが集まらない可能性。
- 正式な利用KPI集計値がない期間に0や推測値を補完しないこと。
- 官公需情報ポータルAPI、Cloudflare/D1/GitHub Free枠への依存。

## 8. KPI
### 正式に追跡するM3 KPI
- unique anonymous users
- unique sessions
- profile completions / profile updates
- search users
- search count / searches per user
- search → detail rate
- detail → WATCH rate
- recommendation views
- GO / WATCH / NO-GO distribution
- NEXT ACTION views
- application prep starts
- repeat usage（2日以上利用）
- LP CTA / diagnosis / pricing / usage interest / lead count

### CURRENT KPI VALUE
現時点の正式な市場KPI集計値は本連携資料では取得していない。**UNKNOWNとして扱い、推測・0補完禁止。**

Evidence export経路はGitHub Actions OIDC + 集計artifact方式で実装済み。M3移行後はAI経営OS側で定期Evidence取得・比較へ接続する。

## 9. Owner Hours
- CURRENT: UNKNOWN / 未計測
- 方針: Owner Hoursは極小化する。
- AI実行可能な調査・集計・比較・レビュー・改善案・状態更新はAI側で実行する。
- ユーザーへ残す作業は製品判断・Human UATなど不可避なものだけとする。

## 10. NEXT ACTION
### USER ACTION / PRODUCT GATE
CR-005 Productionで次の3点のみHuman re-UATする。
1. AI等で検索し、案件名・発注機関が表示されること。
2. WATCH追加がエラーなく完了し、WATCH画面へ反映されること。
3. イラスト/カード/UIが前回より好みに近いか確認する。

### AUTO ACTION after PASS
ユーザーがPASSしたらAI側は確認待ちで停止せず、以下を連続実行する。
1. UAT結果を正式成果物へ反映
2. `PROJECT_STATE.md` をUSER_ACCEPTED / M3へ更新
3. 必要なTEST_RESULT / RELEASE_NOTES / USER_MANUAL同期
4. M3 Evidence集計経路の最新稼働確認
5. 正式KPI snapshot取得
6. AI経営OSのCURRENT STATE / EVIDENCE / KPI / NEXT ACTIONを更新
7. 市場Evidenceに基づき継続・改善・撤退/ピボット候補を比較

### AUTO ACTION after FAIL
ユーザーがFAILまたは追加要望を出した場合は、新Change Requestとして登録し、仕様・設計・TEST_PLAN・READY_TO_BUILDを経て修正する。

## 11. AI経営OS側へ反映する状態
### GOAL
公共営業SaaS候補について、ユーザー負担と固定費を抑えながら実利用Evidenceを取得し、継続投資すべき事業かを判断する。

### CURRENT STATE
CR-005 Production Technical PASS / Human re-UAT pending / technical blocker 0。

### MILESTONE
M3市場検証へ入る直前のUser Acceptance Gate。

### 代表判断待ち
CR-005 Human Visual re-UATのPASS / CHANGE_REQUIREDのみ。

### 重大RISK / BLOCKER
技術Blockerなし。最大リスクはM3の市場Evidence母数不足とUI再受入失敗。

### EVIDENCE
109/109 automated PASS、Production real search PASS、WATCH add/list PASS、CR-005 visual layer Production配信確認。

### DECISION
0円構成維持、Human UAT feedbackをCR-005で修正、ユーザー受入前DONE禁止。

### LEARNING
Production post-deploy validation必須。UI/UXの視覚品質も受入品質。data shape adapter境界テストを維持。

### Owner Hours
UNKNOWN。今後計測するまで推測禁止。

### KPI
M3 KPI定義済み。正式実績値は現在UNKNOWN。

### NEXT ACTION
Human re-UAT → PASSならM3 Evidence収集/評価をAUTO実行。
