# PRODUCTION UAT PLAN｜AIMOS-CR-004

- 文書ID: AIMOS-LP-UATPLAN-004
- 版数: v0.1
- 状態: READY

## Automated/System UAT
Productionで以下を確認する。
1. health = schema cr004
2. CR-004 app shell表示
3. 実官公需案件検索
4. synthetic企業profile登録
5. 案件詳細 + GO/WATCH/NO-GO + match band
6. NEXT ACTION + application prep
7. WATCH保存/一覧/view model
8. おすすめ品質
9. Homeのprofile completion / today actions / WATCH updates / OS suggestion
10. syntheticデータcleanup
11. Evidence API unauthenticated拒否
12. GitHub Actions OIDC authenticated Evidence export
13. Evidence artifactがsanitized aggregateのみ

## Human Visual UAT
`HUMAN_VISUAL_UAT_CR004.md` に従う。Automated/System UATでは代替しない。
