# DATA_FLOW｜公共営業 意思決定OS CR-004

- 文書ID: AIMOS-LP-DF-001
- 版数: v0.2
- 状態: APPROVED_BY_AI_DESIGN

## DF-01 LP→App
LP→無料診断/無料版CTA→`/app/`。既存LP leadと匿名product profileは自動結合しない。

## DF-02 Anonymous State
Browser client_token→header→server SHA-256→client_key→profile/WATCH/recent/event。raw tokenはDB/logへ保存しない。

## DF-03 Home
client_key→profile/WATCH/recent opportunities→matcher→today_actions/recommendations/new/deadline/watch_updates/profile_completion→Browser。

## DF-04 Search
Browser filters/sort→search Function→D1 cache→必要時官公需API→normalize/upsert→profileがあればmatcher→card view model→Browser。

## DF-05 Detail
opportunity→source facts + profile→decision/reasons/checks/match_band→NEXT ACTION/application prep→Browser。sourceとOS判断は別object/section。

## DF-06 WATCH
WATCH add→current raw_hash snapshot保存→watch_add event。後日GET時current raw_hashと比較→has_update。解除→watch_remove。

## DF-07 Profile
Profile PUT→existing有無判定→upsert→completion計算→first=company_profile_complete / update=profile_update→Home recommendations再評価。

## DF-08 Application Prep
GO card/detail CTA→application_prep_start→Detail prep section→NEXT ACTION checklist。P0では完了状態を保存しない。

## DF-09 Release Event
server recordEvent→APP_RELEASE=cr004→events.release_version。Browser指定値は利用しない。legacy rowsはNULL保持。

## DF-10 Evidence Export
GitHub Actions scheduled/manual
→ GitHub OIDC JWT request
→ `GET /api/internal/evidence`
→ fixed GitHub JWKS signature/claims verify
→ D1 fixed aggregate queries
→ sanitized JSON
→ Actions Artifact
→ AI経営OS GitHub connector。

## DF-11 Evidence Privacy
D1 raw events/leads→aggregate SQL→count/rate only。client_key/session_id/email/company/search keyword/opportunity-level historyはexportしない。

## DF-12 Error Isolation
Evidence export失敗はpublic appへ影響させない。官公需API失敗時はcache縮退。AI(P1)失敗時もrule features継続。
