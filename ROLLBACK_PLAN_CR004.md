# ROLLBACK PLAN｜AIMOS-CR-004

- 文書ID: AIMOS-LP-RB-004
- 版数: v0.1
- 状態: READY
- Rollback source: `baseline-cr003-production` @ `e70182e343643cd738113df5e0e21a7d3ba67123`

## Trigger
Productionで検索・詳細・プロフィール・WATCH・推薦の主要機能が利用不能となり、hotfixで短時間に回復できない場合。

## 方針
CR-004のD1変更はadditiveであり、CR-003コードは追加列が存在しても動作可能な設計とする。rollback時もD1列をDROPしない。

## 手順
1. 障害Evidence保存。
2. mainをCR-003互換コードへ戻すための修正commitを作成する（履歴破壊のforce resetを通常運用では行わない）。
3. Cloudflare Pages再デプロイを確認。
4. `/api/health`、`/app/`、実案件検索、Profile/WATCHをsmoke test。
5. CR-004イベントの停止時刻を記録し、比較集計ではrelease_versionを維持する。

## 禁止
- D1 DROP
- CR-003/004既存イベント削除
- Evidence比較基準線branchの変更
