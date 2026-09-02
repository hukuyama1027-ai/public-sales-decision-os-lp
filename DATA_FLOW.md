# DATA_FLOW｜公共営業 意思決定OS v0.1

- 文書ID: AIMOS-LP-DF-001
- 版数: v0.1
- 状態: APPROVED_BY_AI_DESIGN

## DF-01 LP→無料版
LP閲覧→既存イベント→診断/CTA→`/app/`。LP lead情報と無料版profileは自動結合しない。メールを無料版匿名IDへ紐付けない。

## DF-02 匿名クライアント識別
Browser生成client_token→localStorage→`X-Client-Token`→Function SHA-256→client_key→D1 profile/watch/history/event。
raw tokenはD1へ保存しない。

## DF-03 検索
Browser filters→search Function→D1 cache query→必要時のみ官公需API→XML parse→normalize→opportunities upsert→D1 query→Browser cards。
公式API通信はserver sideのみ。cache時刻/網羅性免責も返す。

## DF-04 詳細
opportunity_id→D1 opportunity→profile存在時rule engine→source情報 + OS参考判断を別objectで返す→UI別セクション表示→detail event/recent upsert。

## DF-05 WATCH
WATCH click→token hash→opportunity existence check→watch_items upsert→watch_add event→UI状態更新。
削除はclient_key + opportunity_idの一致時のみ。

## DF-06 Profile
フォーム→server validation→token hash→company_profiles upsert→company_profile_complete→recommendations再計算。
PIIメールは扱わない。

## DF-07 Recommendation
profile + recent opportunities→deterministic rule engine→fit score/reasons/checks/missing info→Browser。判定結果はv0.1では永続キャッシュ必須にせず都度計算可能。

## DF-08 Scheduled Sync
Cron→curated IT query set→official API→normalize→opportunities upsert→sync_runs。失敗時既存opportunitiesを削除しない。

## DF-09 AI（P1）
Browser question + opportunity_id→server loads opportunity/profile→safety context→Workers AI→reference answer→Browser→ai_support_start event。lead/emailは送らない。

## DF-10 Evidence
Browser/server action→event allowlist→events。M3集計はD1 SQL。イベントmetadataは非PII限定。
