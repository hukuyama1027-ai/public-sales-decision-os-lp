# API_DESIGN｜公共営業 意思決定OS v0.1

- 文書ID: AIMOS-LP-API-001
- 版数: v0.1
- 状態: APPROVED_BY_AI_DESIGN
- Base: same-origin `/api/*`

## 1. 共通
- JSON API。官公需公式APIとの通信だけXML。
- 書込/個人状態APIは`X-Client-Token`を要求。サーバーでSHA-256化しraw tokenは保存しない。
- エラー: `{ok:false,error:"CODE",message:"..."}`。
- GET公開案件APIはPIIを返さない。
- source_urlはallowlist生成/公式レスポンス由来のみ。任意URL proxyは禁止。

## 2. GET /api/opportunities/search
Query:
- q <=100
- prefecture <=20
- organization <=100
- announced_from / announced_to YYYY-MM-DD
- deadline_from / deadline_to YYYY-MM-DD
- category <=30
- procedure <=30
- new=0|1
- deadline_days=7|14
- page >=1 default 1
- limit 1..50 default 20

Behavior:
1. D1 cache検索。
2. q/prefecture/organizationのいずれかがあり、cacheが古い/不足なら官公需APIを1回取得。
3. normalize/upsert。
4. D1からpage結果を返却。

Response:
`{ok:true,items:[],count,source:"kkj",cache:{fetched_at,stale},disclaimer}`

公式API障害時、cacheがあれば200 + `stale:true`。cacheなしは503。

## 3. GET /api/opportunities/:id
案件詳細。原典列を`source`、OS判定を`decision`に分離。
`decision`はprofile tokenが有効な場合のみ算出。profileなしはnull。

## 4. GET /api/home
`X-Client-Token` optional。
Response:
- recommendations[]
- new_items[]
- deadline_items[]
- watch_items[]
- today_actions[]
- profile_status

プロフィールなしでもnew_itemsを返す。

## 5. GET /api/profile
`X-Client-Token` required。
自端末profileのみ返す。

## 6. PUT /api/profile
Input:
- company_name 1..120
- industry 1..80
- services 2..1000
- regions array 1..20, each <=50
- employee_scale optional enum
- desired_project_size optional enum(small,medium,large,undecided)
- public_experience enum(none,considering,once_or_more)
- unified_qualification enum(yes,no,unknown)
- strengths optional <=1000

Upsert。成功時`company_profile_complete` eventをserver side記録。

## 7. GET /api/watch
Token required。自端末WATCH一覧。

## 8. POST /api/watch
Input `{opportunity_id}`。
案件存在チェック→INSERT OR IGNORE→`watch_add` event。
Response `{ok:true,watched:true}`。

## 9. DELETE /api/watch/:id
Token required。自端末の該当watchだけ削除。

## 10. GET /api/recommendations
Token required + profile required。
Query limit 1..30 default 10。
ルール計算結果を返す。

## 11. POST /api/recent
Token required。Input `{opportunity_id}`。upsert viewed_at。`opportunity_detail_view` eventも記録可能。

## 12. POST /api/event
既存APIを拡張。
Allowed:
`page_view,cta_click,diagnosis_start,diagnosis_complete,pricing_click,usage_interest,public_search,public_search_result_view,opportunity_detail_view,watch_add,company_profile_complete,recommended_opportunity_view,go_view,watch_view,no_go_view,next_action_view,ai_support_start`

Optional:
- session_id <=80
- entity_type enum(opportunity,profile,search,plan)
- entity_id <=128
- metadata: allowlisted primitive keys only

metadataにemail/company_name/services等を禁止。

## 13. POST /api/ai/support（P1）
Token required。
Input:
- opportunity_id required
- question 1..500

Server loads opportunity/profile; clientから原典本文を丸ごと受け付けない。
Workers AI binding `AI`へ最小contextを渡す。

System guard:
- 正式参加可否を断定しない
- 法的助言をしない
- 期限/金額/資格は構造化原典を引用して「原典確認」を促す
- 不明を生成しない

Response `{ok:true,answer,sources:[{label,url}],notice}`。
AI quota errorは429/503相当 + `AI_FREE_LIMIT`。他APIに影響させない。

## 14. Upstream 官公需API Adapter
Constant base URL only。URL user input禁止。
Upstream query mapping:
- q -> Query
- organization -> Organization_Name
- prefecture -> LG_Code（マッピング可能時）
- category -> Category
- procedure -> Procedure_Type
- announced range -> CFT_Issue_Date

Countは原則30、最大50。タイムアウト5秒目安。1ユーザー操作につきupstream 1回以下。

## 15. Rate/Abuse
- Cloudflare platform limitsを前提に、server側で同一client/searchの短時間重複fetchをD1 cacheで抑止。
- POSTは本文サイズを制限。
- AIは1 session連続実行を抑制可能な設計。
- 公開APIを汎用proxyとして利用できないこと。

## 16. Health
`GET /api/health` → `{ok:true,db:true,version}`。外部APIへ毎回問い合わせない。機密設定は返さない。
