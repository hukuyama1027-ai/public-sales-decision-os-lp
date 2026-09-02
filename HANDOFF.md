# HANDOFF｜AIMOS-CR-003

- 文書ID: AIMOS-LP-HO-001
- 版数: v0.1
- 状態: READY_FOR_BUILD
- Target branch: `cr-003-free-os-v0.1`
- Base branch: `main`

## Goal
既存需要検証LPを維持しつつ、実公共案件を検索・保存・比較・判断できる無料版「公共営業OS v0.1」を同一Cloudflareプロジェクトに実装し、M3 Product Usage Evidenceを取得可能にする。

## Must Read
AGENTS.md → CHANGE_REQUEST_CR-003.md → REQUIREMENTS.md → BASIC_DESIGN.md → UI_DESIGN.md → DB_DESIGN.md → API_DESIGN.md → DATA_FLOW.md → DETAIL_DESIGN.md → SECURITY_REVIEW.md → TEST_PLAN.md。

## P0 Tasks
### DB-CR003-001
`migration_cr003.sql` / full `schema.sql` 更新。既存events/leads保持。
Done: DB_DESIGN準拠、破壊的DROPなし、migration test。

### DATA-CR003-001
官公需XML adapter/normalizer。固定公式endpoint、Count<=30/50、欠損NULL、deadline推測禁止。
Done: fixtures unit test + upstream failure handling。

### API-CR003-001
search/detail/home/profile/watch/recommendations/recent/health/event拡張。
Done: API_DESIGN response/validation/security test。

### MATCH-CR003-001
ルール型fit/GO-WATCH-NO-GO/reasons/information completeness/NEXT ACTION。
Done: TP-MATCH/TP-NEXT PASS。

### UI-CR003-001
`/app/` job-site型UI、5ナビ、home/search/detail/watch/profile。LP→app導線。
Done: desktop/mobile states + source/OS separation。

### EVIDENCE-CR003-001
Product Usage events追加。
Done: event allowlist + D1 event recording。

### SEC-CR003-001
client token hash、IDOR scope、CSP、URL validation、profile delete。
Done: TP-SEC PASS。

### TEST-CR003-001
unit/component/regression/system。実Cloudflareはmerge後。
Done: local runnable tests PASS、未実行項目を明記。

## P1 after P0 PASS
- deadline grouping/today tasks/recent UI/readiness
- AI concierge via Workers AI Free allocation
P1でP0 releaseを遅らせない。AI bindingが未設定でもP0は完成可能。

## Deployment
1. branch tests
2. merge to main
3. Cloudflare Pages auto deploy
4. production D1 migration
5. actual official API search
6. D1 persistence/events
7. UAT

Scheduled Worker/CronはPages deployとは別設定が必要な場合がある。on-demand search/cacheをP0主経路として必ず成立させる。

## Prohibitions
- payment/paid API without approval
- competitive-service scraping
- autonomous bidding/submission
- eligibility/legal guarantee
- fabricated deadlines/amounts/requirements
- storing raw client token
- cross-client private data
- arbitrary SSRF proxy

## Known Unknown
AIMOS-CR-002本文は現在の正式ソースで未発見。current mainを統合ベースラインとする。CR-002が後日見つかったらDONE前差分レビュー。

## Completion
P0 success criteria + TEST_PLAN Exit Criteria + production UAT。User acceptanceまではDONEにしない。
