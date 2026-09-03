# AI経営OS レビュー依頼｜公共営業 意思決定OS

- 文書ID: AIMOS-MGT-REV-REQ-001
- 版数: v0.1
- 状態: REVIEW_REQUESTED
- 作成日: 2026-09-04
- 対象Project: 公共営業 意思決定OS｜需要検証LP + 無料版公共営業OS
- 参照正本: `PROJECT_STATE.md`
- 連携資料: `AI_MANAGEMENT_OS_HANDOFF.md`
- 主レビュー先: `01｜AI経営OS・GOAL実行`
- 参照先: `00｜AI経営ダッシュボード`

## 1. レビュー目的
CR-005のProduction Technical PASS後、Human Visual re-UATおよびM3市場検証へ進む前に、AI経営OSの観点から事業・Evidence・運用方針をレビューする。

コード実装そのものの再レビューではなく、以下を中心に確認する。
- 現在のGOAL/MILESTONEの妥当性
- M3へ進む条件が十分か
- 取得すべきEvidence/KPIに欠落がないか
- 事業仮説を誤って肯定する設計になっていないか
- Owner Hours / Cost / 自動化方針が最上位GOALと整合しているか
- Human re-UAT後のNEXT ACTIONが適切か

## 2. 現在の前提
- CR-005 Design / Implementation / Automated Test / Production Deploy / Production Technical E2E完了。
- Automated Test: 109 PASS / 0 FAIL。
- Production real opportunity search: PASS。
- Production WATCH add / list / persistence: PASS。
- 技術BLOCKER: 0。
- 初期費用0円 / 月額固定費0円。
- Human Visual re-UATとユーザー受入は未完了。
- M3市場KPIの正式実績値はまだ本レビュー依頼時点でUNKNOWN。推測・0補完禁止。

## 3. レビュー観点
### R-01 GOAL整合性
公共営業OSが、AI経営OSの最上位GOAL「ユーザー本人の作業を増やさず、継続的に高利益を得られる事業を作る」に対し、継続検証する価値があるか。

### R-02 M3 Gate
Human Visual re-UAT PASS後、M3 Evidence accumulationへ進むことで不足するGateがないか。

### R-03 Evidence設計
最低限以下のKPI定義が事業判断に十分か。
- unique anonymous users
- unique sessions
- profile completion/update
- search users
- searches per user
- search → detail rate
- detail → WATCH rate
- recommendation views
- GO/WATCH/NO-GO
- NEXT ACTION views
- application prep starts
- repeat usage
- LP CTA / diagnosis / pricing / usage interest / lead count

不足する指標がある場合は、理由・優先度・取得方法を提案すること。

### R-04 Evidence Strength
「システムが動く」「ユーザーが操作できる」を需要Evidenceと混同していないか。

特に以下を分離して評価すること。
- Technical Evidence
- Human UAT Evidence
- Product Usage Evidence
- Purchase Intent Evidence
- Paid Conversion Evidence

### R-05 比較基準
CR-003/CR-004/CR-005の変更前後で、UI改善による行動変化を比較できる状態か。

### R-06 Owner Hours
運用・Evidence集計・改善レビューが代表本人の継続作業を増やさない設計か。

### R-07 Cost
0円構成を維持できているか。将来費用発生が必要になる場合、どのEvidence水準で費用投下判断すべきか。

### R-08 Risk
現在もっとも重大な事業Risk、Evidence Risk、運用Riskを優先順位付きで3件以内に整理すること。

### R-09 P1優先順位
以下P1候補をM3 Evidenceへの寄与で評価すること。
- AI公共営業コンシェルジュ
- 応募準備の永続進捗
- 閲覧履歴UI
- 高度締切管理
- 公共営業準備度
- 高度な今日やること
- 発注機関研究

Human re-UAT前に必要なもの、M3中に追加すべきもの、Evidence取得後まで待つものへ分類すること。

### R-10 NEXT ACTION
Human re-UAT PASSの場合、AI経営OSとして次にAUTO実行すべき工程を具体化すること。

## 4. レビュー回答フォーマット
以下の形式で回答すること。

1. **REVIEW RESULT**: APPROVED / APPROVED_WITH_CONDITIONS / REWORK
2. **M3 GO/NO-GO**: GO / CONDITIONAL_GO / NO-GO
3. **重大指摘**: 最大3件
4. **不足Evidence/KPI**: 必要な場合のみ
5. **P1優先順位**: NOW / M3 / LATER
6. **RISK**: 最大3件
7. **DECISION推奨**
8. **NEXT ACTION**: AUTO / USER_DECISION / EXTERNAL_WAITに分類
9. **AI経営OS CURRENT STATE更新案**
10. **代表判断待ち**: 本当に必要なものだけ

## 5. 禁止事項
- Human re-UAT未完了なのにDONE扱いしない。
- KPIの未取得値を0や推測値で埋めない。
- Technical PASSを市場需要PASSへ読み替えない。
- P1を「あると便利」だけで優先しない。Evidence・利益・Owner Hoursへの寄与で判断する。
- 追加ユーザーヒアリングはPRODUCT DECISIONまたはBLOCKING事項に限定する。

## 6. レビュー後の処理
レビュー回答は、AIシステム開発会社側で正式成果物として受領し、必要に応じて以下へ反映する。
- PROJECT_STATE
- AI_MANAGEMENT_OS_HANDOFF
- M3計画
- KPI/Evidence設計
- P1 backlog
- Change Request

レビューで技術判断のみの指摘が出た場合はユーザー確認なしで設計反映可能。PRODUCT DECISIONまたはBLOCKING事項のみユーザー判断へ戻す。
