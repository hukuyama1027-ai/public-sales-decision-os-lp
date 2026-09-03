# BASIC_DESIGN｜公共営業 意思決定OS｜CR-004

- 文書ID: AIMOS-LP-BD-001
- 版数: v0.3
- 状態: APPROVED_BY_AI_DESIGN
- 対応: AIMOS-CR-003 + AIMOS-CR-004 + Issue #7
- Production基準線: `baseline-cr003-production`

## 1. 全体構成
```text
Browser
 ├─ /                         需要検証LP
 └─ /app/                     無料版公共営業OS
      ├─ Home
      ├─ Search
      ├─ Opportunity Detail
      ├─ WATCH
      ├─ AI Support(P1)
      └─ My Page/Profile
          │
          └─ Pages Functions API
               ├─ D1
               ├─ 官公需情報ポータルAPI（公式/XML）
               └─ Workers AI（P1）

GitHub Actions Evidence Export
  ├─ GitHub OIDC short-lived JWT
  ├─ GET /api/internal/evidence
  └─ sanitized evidence.json → Actions Artifact
```

CR-003 Productionの検索・D1・判定ロジックを基盤として維持し、CR-004は主にApp Shell/UI/表示用APIレスポンスを拡張する。

## 2. UI情報アーキテクチャ
### Home
1. 今日やること
2. あなたへのおすすめ案件
3. 新着案件
4. 締切間近
5. WATCH更新
6. OSからの提案 / AI相談導線

### Search
検索条件 → 結果カード → 詳細 → WATCH/応募準備。
Homeからも各案件へ同じ詳細画面へ遷移する。

### Detail
概要 → 判断 → 条件 → 行動 → 原典。
原典情報とOS参考判断を独立セクションにする。

## 3. 案件カードView Model
APIのsource/decisionをUI向けに組み合わせる。
- decision: GO/WATCH/NO-GO
- match_band: high/medium/low
- title/org/region/category/procedure
- notice_date_label: `公告日/取得日`
- deadline_label: trustedのみ、未確定は`原典で確認`
- feature_tags[]: 原典またはdeterministic ruleのみ
- reason_summary[] max2
- check_summary[] max2
- watched
- has_update
- primary_action: GO=応募準備を見る / WATCH=WATCH / NO-GO=理由を見る

内部scoreはsortに使えるが、UIはbandを主表示する。

## 4. Home Aggregation
`GET /api/home`を拡張。
- today_actions[]
- recommendations[]
- new_items[]
- deadline_items[]
- watch_updates[]
- os_suggestion
- profile_status
- profile_completion

各sectionは最大5件程度。検索フォームはHome主役にしない。

## 5. Search
既存公式API proxy/D1 cacheを維持。
検索APIはtokenがある場合、各itemへ`decision`、`watched`、`has_update`を付与する。
並び順:
- relevance/default: source検索順 + cache
- new: announced_at desc
- deadline: deadline_at non-null asc
- fit: profileあり時 decision score desc

trusted deadlineがない案件をdeadline sortの上位へ推測配置しない。

## 6. WATCH更新判定
`watch_items.source_hash_snapshot`へ保存時の`opportunities.raw_hash`を保持。
現在raw_hashと異なる時だけ`has_update=true`。
期限/状態スナップショットも既存どおり保持。

## 7. Profile Completion
永続列は追加しない。
必須/推奨9項目の入力状態をserverまたはclientで算出し0〜100へ丸める。
UI表示は例:`プロフィール完成度 78%`。これは入力充足率であり公共営業能力スコアではない。

## 8. 応募準備チェック(P0 light)
既存NEXT ACTIONを表示用checklistに変換。
- 永続完了状態なし
- GOカードの「応募準備を見る」でdetailの該当sectionへscroll
- 初回表示/CTAで`application_prep_start`

P1で進捗保存tableを追加可能なcomponent境界にする。

## 9. Evidence Release Comparison
`events.release_version`追加。
server-side `recordEvent()`がCR-004コードから記録するeventへ`cr004`を自動付与する。
Browserからrelease_versionを自由指定させない。
既存event_typeは変更しない。

## 10. Evidence自動集計
### Authentication
GitHub Actions workflowが`id-token: write`でOIDC JWTを取得。
Cloudflare Functionは:
1. Bearer JWT parse
2. GitHub fixed JWKS fetch/cache
3. RS256署名検証
4. `iss`
5. custom `aud`
6. `repository`
7. `ref=refs/heads/main`
8. expected `workflow_ref`
9. exp/nbf
を検証する。

### Output
`GET /api/internal/evidence?days=7|30|90`
- raw event rowを返さない
- raw client_key/session_id/search term/profileを返さない
- 集計値とrelease別比較のみ

### Delivery
`.github/workflows/evidence-export.yml`
- daily + workflow_dispatch
- OIDC token取得
- evidence endpoint call
- JSON schema validation
- artifact upload
- retention 30日

AI経営OSはGitHub connectorから最新run/artifactを取得する。

## 11. DB
既存tables保持。
Migration CR-004:
- events.release_version TEXT NULL
- watch_items.source_hash_snapshot TEXT NULL
schema marker `cr004`。
破壊的DROPなし。

## 12. Event
既存eventは継続。
追加:
- application_prep_start
- profile_update
- watch_remove

profile初回保存はcompany_profile_complete、2回目以降はprofile_update。

## 13. セキュリティ
既存client token hash/IDOR/XSS/SSRF/CSPを維持。
Evidence endpointはGitHub OIDC限定read-only。
JWKS/issuer hostは固定し、JWTのjku等を信頼しない。
集計APIは任意SQL、event filter、raw ID exportを提供しない。

## 14. Error/縮退
- Evidence OIDC invalid: 401/403、DB queryしない
- JWKS unavailable: 503
- Evidence export workflow失敗: artifactなし、Production public appへ影響なし
- CR-004 UI JS error:既存APIは維持し回帰testで検出
- watch update hash欠損: update=false、安全側

## 15. 費用
Cloudflare Pages/Functions/D1 + GitHub Actions Free枠内。固定費0円。
長期secret不要。

## 16. リリース方式
1. baseline branch固定済み
2. `cr-004-ui-ux-v0.1`で設計/実装
3. CI
4. P0 Gate
5. main merge
6. Cloudflare auto deploy
7. schema bootstrap cr004
8. Production smoke/E2E
9. baseline vs cr004 Evidence確認
10. Human Visual UAT
