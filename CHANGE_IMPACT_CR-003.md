# CHANGE IMPACT ANALYSIS｜AIMOS-CR-003

- 文書ID: AIMOS-CR-003-IA-001
- 版数: v0.1
- 状態: COMPLETE
- 判定: LARGE / NOW
- 実装開始可否: 設計・テスト計画更新後に再判定

## 1. 影響概要
CR-003は、LP単体から「LP + 実無料プロダクト」へスコープを拡張するためLARGE変更。ただし既存Cloudflare Pages / Pages Functions / D1構成を維持でき、プラットフォーム全面変更は不要。

## 2. 影響マトリクス
| 対象 | 影響 | 対応 |
|---|---|---|
| REQUIREMENTS | 大 | 実案件検索、プロフィール、WATCH、推薦、判定、NEXT ACTION、Product Usage KPIを追加 |
| BASIC_DESIGN | 大 | LP + `/app/`、公式API連携、キャッシュ、推薦/判定サービスを追加 |
| UI_DESIGN | 大 | 求人サイト型ホーム/検索/詳細/WATCH/AI相談/マイページを追加 |
| DETAIL_DESIGN | 大 | API、識別トークン、マッチング、イベント、同期処理を詳細化 |
| DB | 大 | opportunities/company_profiles/watch_items/search_history/recent_views/sync_runs等を追加 |
| API | 大 | public search/detail/profile/watch/recommendations/recent/AI supportを追加 |
| データ | 大 | 官公需公式XML→正規化D1。欠損はNULLのまま扱う |
| 既存コード | 中 | LPは維持し、無料プロダクトへの導線を追加。既存診断/リード計測を回帰対象化 |
| テスト | 大 | 外部API、XML、DB migration、検索、WATCH、推薦、安全境界、UATを追加 |
| コスト | 中 | Cloudflare Free枠を継続。Workers AIはFree割当内のみ。超過時停止 |
| セキュリティ | 大 | 匿名端末トークン、プロファイル分離、外部API proxy、AI境界、CSPを追加 |
| スケジュール | 大 | 実無料プロダクト開発フェーズを追加 |
| 他機能 | 中 | 既存LP診断を企業プロフィール/準備度へ接続可能な形にする |

## 3. 公式API調査結果
- 官公需情報ポータル検索APIは中小企業庁の公開REST APIでレスポンスはXML。
- Query / Project_Name / Organization_Name / LG_Codeのいずれかが検索キーとして必要。
- Countは最大1000。
- Category、Procedure_Type、Certification、CFT_Issue_Date、Tender_Submission_Deadline、Opening_Tenders_Event、Period_End_Time等の絞り込み項目がある。
- 検索式はAND/OR/ANDNOT/NOTを利用可能。
- 一部出力項目は元データに存在しない場合がある。
- API利用サイトはAPI利用の明記と官公需情報ポータルへのリンクが必要。
- 同時・継続大量アクセスは禁止。具体上限は公開されていないため保守的にキャッシュ/低頻度同期を採用。
- ポータルはすべての入札情報を網羅する保証がない。

## 4. 技術判断
### TD-CR003-001 APIアクセス
Browser→Pages Function→官公需API。ブラウザから公式APIへ直接アクセスしない。

### TD-CR003-002 キャッシュ
検索結果をD1 `opportunities`へupsert。ユーザー検索はD1優先、必要時のみ公式APIへ1回取得して更新。定期同期は初期2回/日を上限目安とし、過剰アクセスを避ける。

### TD-CR003-003 UI
LPは既存URL `/` を維持。無料版は `/app/` のモバイルファーストSPA（Vanilla ES modules）とする。主要5ナビを固定。

### TD-CR003-004 匿名利用
v0.1では会員登録/パスワードを作らない。ブラウザ生成の高エントロピー `client_token` をlocalStorageに保持し、サーバーはSHA-256 hashのみ保存。プロフィール/WATCH/履歴は同一ブラウザで復元。クロスデバイス同期は対象外。

### TD-CR003-005 判定
ルールベースを主とする。適合度、根拠、情報充足度を表示し、正式参加可否とは表現しない。NO-GOは「現時点で優先度低」の意味に限定。

### TD-CR003-006 AI相談
P1でCloudflare Workers AI Free割当を利用可能。Free枠を超えたら停止し、有料化しない。モデルはFreeプランで利用可能なモデルに限定。回答範囲は当該案件、企業プロフィール、公開情報に限定。

### TD-CR003-007 締切
官公需APIの各日付フィールドは意味が異なり、真の提出締切が取得できない案件がある。明確に取得・解釈できる日付のみ「締切」として扱い、不明時は「原典で確認」と表示。推測補完しない。

## 5. CR-002
AIMOS-CR-002本文は正式ソース内で発見できず。現行mainの正式成果物を統合ベースラインとする。後日CR-002が見つかった場合、DONE前にCR-003との差分同期レビューを行う。現時点のBLOCKINGは0。

## 6. 結論
CR-003は既存Cloudflare構成を拡張して0円で実現可能。設計成果物・DB/API設計・TEST_PLANを更新すればREADY_TO_BUILD再判定可能。
