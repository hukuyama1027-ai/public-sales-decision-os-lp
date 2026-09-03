# TEST_RESULT｜AIMOS-CR-003 P0

- 文書ID: AIMOS-LP-TR-003
- 版数: v0.1
- 状態: PASS
- 実施日: 2026-09-03
- 対象: 需要検証LP + 無料版公共営業OS v0.1 P0

## 1. 総合判定
**P0 AUTOMATED / INTEGRATION / PRODUCTION E2E = PASS**

- BLOCKING BUG: 0
- OPEN P0 BUG: 0
- 月額固定費: 0円
- 既存LP回帰: PASS
- 実官公需案件検索: PASS
- D1 migration/schema: PASS
- Production E2E: PASS

## 2. 自動テスト
GitHub Actions / Node 22で `npm test` を実施。

- Tests: 59
- PASS: 59
- FAIL: 0
- SKIP: 0

主要試験範囲:
- 既存LP/API回帰
- lead/event API validation
- 官公需XML parser / missing field / Error response
- API search URL / Count上限
- safe URL / XSS・危険scheme対策
- deadlineを推測生成しないこと
- stable opportunity ID
- short ASCII keyword検索品質
- `mail` 内 `ai` 誤ヒット防止
- 長文後半のAIファイル形式/関連リンクノイズ防止
- 日本語検索の部分一致維持
- match score / GO-WATCH-NO-GO / 判定理由
- 資格不明を正式参加可否と断定しないこと
- NEXT ACTION
- profile validation
- CR-003 event allowlist / PII metadata除外
- `/app/` shell / 5主要ナビ
- 官公需API利用表記 / 非網羅性表示
- `公告日/取得日` 保守的表示
- CSP
- 非破壊migration
- P0 Functions import
- 推薦品質: AI案件維持、旅券輸送/土木工事/物品購入のNO-GO化

Evidence:
- PR #6 test run: `33713236218`
- job: `100516967987`
- result: 59/59 PASS

## 3. D1 Migration / Health
本番:
`GET /api/health`

確認結果:
```json
{"ok":true,"db":true,"version":"0.1-cr003","schema":"cr003","migrated":false}
```

`schema=cr003` を確認。`migrated=false` は既にschema markerが存在し、再migrationが不要であることを示す。

判定: PASS

## 4. Cloudflare Live Smoke
GitHub Actionsから本番CloudflareへHTTP実通信。

確認:
- `/api/health`: PASS
- `/app/`: PASS
- 官公需情報ポータル由来の実案件検索 `q=AI`: PASS
- `source=kkj`: PASS
- D1 cache `stale=false`: PASS

## 5. Production P0 E2E
Workflow: `.github/workflows/p0-e2e.yml`
Run: `33713292290`
Job: `100517135797`
Result: SUCCESS

合成匿名プロフィールを使い、終了時にテストデータを削除した。

実施シナリオ:
1. 企業プロフィール保存
2. 実公共案件 `AI` 検索
3. 案件詳細取得
4. GO/WATCH/NO-GO確認
5. 判定理由確認
6. NEXT ACTION確認
7. WATCH追加
8. WATCH再取得・永続化確認
9. おすすめ案件取得
10. おすすめ品質確認
11. Home反映確認
12. テストWATCH/profile削除

結果: 全項目PASS

## 6. UAT中に発見・修正した不具合
### BUG-CR003-001
短い英字検索 `AI` が `mail`、ファイル形式AI、ページ後半の関連リンクへ誤ヒット。

対応:
- 英数字境界判定
- short ASCIIは案件タイトル + 原典本文冒頭600文字を関連性判定
- 日本語検索は全文部分一致維持
- UI日付を `公告日/取得日` に修正

状態: RESOLVED / CLOSED

### BUG-CR003-002
おすすめ案件へ旅券輸送、河川/舗装工事、物品購入等が混入。

対応:
- 案件主題ベースのサービス一致
- 強いIT語はタイトル/概要冒頭で判定
- 工事カテゴリはIT語がタイトルにある場合のみ主題一致
- `システム/開発/保守/運用` はタイトル一致時のみ独立加点
- 主題一致なしはNO-GO
- recommendations/HomeからNO-GO除外

状態: RESOLVED / CLOSED

## 7. 本番推薦品質確認
本番E2Eおすすめ上位例:
- 次世代創薬逆提案プラットフォーム構築に向けた生成AI基盤開発及び実証支援業務
- 医療用生成AI統合システム １式
- 生成AIによる検査項目コードマッピングに関する実用性評価（PoC） 一式
- AI・ビッグシミュレーション・ビッグデータ解析の大規模実行実現のための評価システム
- 令和8年度AIドローンによる密漁監視実証試験委託業務

すべて:
- `service_relevant=true`
- decision = GO or WATCH

既知ノイズ（旅券輸送、河岸保護、舗装維持、ビニールシート、マシニングセンタ）はおすすめ上位から除外された。

## 8. 未実施 / P0外
- ユーザー本人によるスマホ/PC画面操作UAT: PENDING
- AI公共営業コンシェルジュ: P1 / NOT IMPLEMENTED
- 高度な締切管理、閲覧履歴UI、公共営業準備度統合等: P1
- Cron定期同期: PENDING（現在はオンデマンド公式API取得 + D1 cacheで実検索可能）

## 9. Exit判定
P0技術・システム試験: **PASS**

ただしプロジェクト全体をDONEとはしない。正式DONEにはユーザー受入、必要なP1範囲の処理、マニュアル同期等を別Gateで確認する。
