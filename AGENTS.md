# AGENTS.md

## Project
公共営業 意思決定OS｜需要検証LP + 無料版公共営業OS v0.1

## Source of Truth Priority
1. CHANGE_REQUEST_CR-003.md
2. REQUIREMENTS.md
3. CHANGE_IMPACT_CR-003.md
4. BASIC_DESIGN.md
5. UI_DESIGN.md
6. DB_DESIGN.md
7. API_DESIGN.md
8. DATA_FLOW.md
9. DETAIL_DESIGN.md
10. SECURITY_REVIEW.md
11. TEST_PLAN.md
12. PROJECT_STATE.md
13. HANDOFF.md

上位文書と下位文書が矛盾する場合は上位を優先し、コードで独断解決せずIssue/設計同期する。

## Scope Rules
- 官公需情報ポータル検索APIを第一データ源とする実公共案件検索はP0。
- 競合サービスデータを無断取得しない。
- 全国自治体独自スクレイピングは対象外。
- 実課金・契約・自動入札・電子入札操作を実装しない。
- 有料サービス/APIをユーザー承認なしで導入しない。
- Cloudflare Free枠内で月額固定費0円を維持する。

## Source / AI Safety
- 原典データとOS/AI生成情報をUI/response objectで分離する。
- 欠損値を推測補完しない。
- 信頼できない日付を締切と断定しない。
- LLM単独で正式参加資格、法的適格性、必須資格、期限、金額、原典参加条件を決定しない。
- NO-GOは「正式参加不可」ではなく「現時点で優先度低」。
- AIは要約、説明、類似性、優先順位、NEXT ACTION、限定質問回答のみ。

## Privacy / Security
- Product profileにemail/passwordを要求しない。
- raw client tokenをDB/logへ保存しない。SHA-256 client_keyのみ。
- private state queryは常にclient_keyでscopeする。
- lead emailをproduct events/AIへ送らない。
- arbitrary URL fetch endpointを作らない。
- source/user dataをinnerHTMLへ直接挿入しない。
- CSP等のsecurity headersを維持する。

## Implementation Rules
- CR-003はREADY_TO_BUILD PASS後のみコード実装する。
- 実装は原則 `cr-003-free-os-v0.1` branchで行い、テスト後mainへmergeする。
- DB migrationは破壊的DROP/既存lead/event削除をしない。
- P0を先に完成。P1はP0 PASSかつBLOCKING 0のときのみ同サイクルで進める。
- 実環境で官公需API通信を確認するまで「実案件検索確認済み」と表現しない。

## Completion
- REQUIREMENTS/設計/TEST_PLAN同期済み
- P0実装済み
- automated tests PASS
- existing LP regression PASS
- major/blocking bugs 0
- Cloudflare Pages + D1 production migration
- actual official opportunity search PASS
- product usage event D1 recording PASS
- smartphone/PC UAT PASS
- SETUP_GUIDE / USER_MANUAL更新
- user acceptance後のみDONE
