# CHANGE IMPACT ANALYSIS｜AIMOS-CR-004

- 文書ID: AIMOS-CR-004-IA-001
- 版数: v0.1
- 状態: COMPLETE
- 対象: AIMOS-CR-003 Production + AIMOS-CR-004 + GitHub Issue #7
- 基準線: `baseline-cr003-production` / commit `e70182e343643cd738113df5e0e21a7d3ba67123`
- 判定: LARGE UI/UX + SMALL DB/Event/API Extension

## 1. 統合関係
- CR-003 = 実機能・検索・判定・WATCH・プロフィール・Evidence計測の基準機能
- CR-004 = 求人サイト型UI/UXの上位補足
- Issue #7 = AI経営OS向けEvidence集計の安全な自動取得経路

CR-004はCR-003を取消ししない。既存Productionの機能・イベントを回帰対象として固定する。

## 2. 変更前後比較基準
GitHub branch `baseline-cr003-production` をCR-004適用前コード基準線とする。
D1の既存eventsは保持する。CR-004以後のイベントには`release_version='cr004'`をサーバー側で自動付与し、既存NULLイベントをlegacy/cr003として比較可能にする。

## 3. 影響マトリクス
| 対象 | 影響 | 方針 |
|---|---|---|
| 公共案件検索 | 低 | API/公式データ取得は維持。検索UI/並び順を改善 |
| Home | 大 | 今日やること→おすすめ→新着→締切間近→WATCH更新→OS提案へ再構成 |
| 案件カード | 大 | 求人カード型へ再設計。マッチ度band、理由、要確認、WATCH、応募準備CTA |
| 案件詳細 | 大 | 概要→判断→条件→行動の順へ変更 |
| GO/WATCH/NO-GO | 中 | 判定ロジック維持、意味・理由・CTAの視認性改善 |
| WATCH | 中 | update判定のためsource_hash_snapshot追加 |
| Profile | 中 | セクション化、完成度を算出 |
| NEXT ACTION | 中 | 軽量応募準備チェックとしてP0 UIへ格上げ。永続進捗はP1 |
| AI | 低/P1 | 本格コンシェルジュはP1。P0では誤認させず準備中表示 |
| DB | 小 | events.release_version、watch_items.source_hash_snapshotを追加 |
| Event | 小 | 既存event維持 + application_prep_start/profile_update/watch_remove追加 |
| Evidence | 中 | release別集計 + OIDC認証集計API + artifact export |
| Security | 中 | OIDC JWT検証・JWKS固定endpoint・集計出力最小化 |
| Cost | 低 | GitHub Actions/Cloudflare Free枠。固定費0円維持 |

## 4. P0実装判断
### CR-004 P0
- 求人サイト型案件カード
- Home再設計
- 検索UI/並び順
- 詳細UI順序
- GO/WATCH/NO-GO UX
- WATCH更新表示
- Profileセクション化 + 軽量完成度
- NEXT ACTIONを応募準備チェックとして表示
- スマホ主要ナビ
- Event release識別

### 同時実装するP0-Ops
Issue #7 Evidence自動集計はM3比較に直接必要で、UI変更効果測定とOwner Hours削減に依存するため同サイクル実装する。

### P1へ残す
- Workers AIによるAI公共営業コンシェルジュ
- 応募準備の永続進捗/完了状態
- 閲覧履歴UI
- trusted deadlineを使う高度締切管理
- 公共営業準備度統合
- 高度な今日やること
- 発注機関研究

## 5. Evidence自動取得方式比較
### A. 公開無認証集計API
実装容易だが事業KPIが公開され、要件に不適合。却下。

### B. Shared Secret Bearer API
安全だがCloudflare/GitHub双方へ長期Secret設定が必要。Owner Hoursとsecret運用が増える。第二候補。

### C. GitHub Actions OIDC認証 + 集計API + Actions Artifact
採用。
- 長期secret不要
- `id-token: write`のworkflowだけが短命JWTを取得
- CloudflareでGitHub issuer/audience/repository/ref/workflow claimを検証
- APIは集計値のみ返却
- GitHub Actions artifactへ保存し監査可能
- AI経営OSはGitHub connectorから最新artifactを取得可能

## 6. 比較可能性
CR-004適用前後比較用に以下を維持する。
- event_typeの既存名称を変更しない
- eventsの既存行をmigrationで変更/削除しない
- `release_version`を追加
- UI改善で新規行動が増える場合のみ新event追加
- KPI定義をEVIDENCE_EXPORT_DESIGNで固定

## 7. BLOCKING
PRODUCT DECISIONはCR-004で承認済み。
技術的BLOCKING: 0。
設計成果物・TEST_PLAN更新後READY_TO_BUILD再判定へ進行可能。
