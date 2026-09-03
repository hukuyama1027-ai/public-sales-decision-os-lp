# UAT_RESULT｜AIMOS-CR-003 P0

- 文書ID: AIMOS-LP-UAT-003
- 版数: v0.1
- 状態: SYSTEM_UAT_PASS / HUMAN_VISUAL_UAT_PENDING
- 実施日: 2026-09-03
- 対象環境: Cloudflare Pages Production + Pages Functions + D1

## 1. 総合判定
**SYSTEM UAT = PASS**

本番環境で、官公需情報ポータル由来の実案件を利用したP0主要導線が成立することを確認した。

## 2. D1 / Deployment
- Production health: PASS
- DB binding: PASS
- CR-003 schema: PASS
- Cloudflare再デプロイ: PASS（main更新後の新Functions/AppをProduction E2Eで確認）

## 3. 実案件検索UAT
検索条件: `AI`
取得元: 官公需情報ポータルAPI

本番取得例:
1. 岡山大学クラウド型AI治験・研究参加候補者リクルートメント支援基盤検証作業業務 — 国立大学法人岡山大学
2. 次世代創薬逆提案プラットフォーム構築に向けた生成AI基盤開発及び実証支援業務 — 国立大学法人岡山大学
3. 被災者支援AIサービス概念実証用擬似データ生成業務 — 国立研究開発法人防災科学技術研究所
4. AI・ビッグシミュレーション・ビッグデータ解析の大規模実行実現のための評価システム — 国立研究開発法人理化学研究所
5. 医療用生成AI統合システム 1式 — 国立大学法人福井大学

確認:
- 実在する公共案件: PASS
- title / organization: PASS
- source URL: 取得可能案件でPASS
- source=`kkj`: PASS
- D1 cache: PASS
- API利用表記: PASS
- 非網羅性免責: PASS
- 取得できない期限を推測表示しない: PASS

## 4. 検索品質UAT
初回UATで検索ノイズを検出し、BUG-CR003-001として修正後再試験。

改善後:
- `mail` の内部文字列によるAI誤ヒット: 解消
- 長文後半のAIファイル形式/関連リンク由来ノイズ: 解消
- `生成AI` / `AI基盤` 等の主題案件: 維持

判定: PASS

## 5. Profile / Detail / Decision
本番合成匿名プロフィール:
- 業種: システム開発
- サービス: 生成AI / Web / システム開発
- 得意: AI / DX / RPA
- 対応地域: 全国

確認:
- profile save: PASS
- profile-scoped detail decision: PASS
- GO/WATCH/NO-GO: PASS
- 判定理由: PASS
- 情報不足表示: PASS
- 正式参加可否を保証しないnotice: PASS
- NEXT ACTION: PASS

実案件詳細例ではWATCH判定と複数の確認アクションを正常に返却。

## 6. WATCH UAT
- WATCH add: PASS
- D1 persistence: PASS
- WATCH GET after add: PASS
- Home WATCH反映: PASS
- E2E終了時cleanup: PASS

## 7. Recommendation UAT
初回Production E2Eで非IT案件混入を検出し、BUG-CR003-002として修正後再試験。

改善後Production上位5件:
- 生成AI基盤開発・実証支援
- 医療用生成AI統合システム
- 生成AIコードマッピングPoC
- AI/大規模解析評価システム
- AIドローン実証

確認:
- recommendation exists: PASS
- all `service_relevant=true`: PASS
- decisionはGO/WATCHのみ: PASS
- NO-GOをおすすめから除外: PASS
- 旅券輸送/土木工事/単純物品等の既知誤推薦除外: PASS

## 8. Home UAT
- profile_status complete: PASS
- recommendations: PASS
- new_items: PASS
- WATCH: PASS
- today_actions基礎表示データ: PASS

## 9. Evidence計測可能状態
P0により、以下の利用Evidenceを本番D1へ取得可能:
- public_search
- public_search_result_view
- opportunity_detail_view
- watch_add
- company_profile_complete
- recommended_opportunity_view
- go_view / watch_view / no_go_view
- next_action_view

`ai_support_start` はP1 AI機能公開後に実利用対象。

## 10. 残りUAT
**HUMAN VISUAL UAT = PENDING**

ユーザー本人に残す確認は画面/操作感のみ:
1. PCまたはスマホで `/app/` を開く
2. プロフィール作成
3. 実案件検索
4. 詳細→WATCH
5. 判定理由/NEXT ACTIONが直感的に理解できるか確認

API・DB・主要システム導線は自動Production E2EでPASS済み。

## 11. 結論
CR-003 P0は、**実公共案件を使った需要・利用Evidenceを取得できるSYSTEM状態へ到達**した。

ステータス: `P0_EVIDENCE_READY / HUMAN_VISUAL_UAT_PENDING`
