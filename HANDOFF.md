# HANDOFF｜AIMOS-CR-004

- 文書ID: AIMOS-LP-HO-001
- 版数: v0.2
- 状態: READY_FOR_BUILD
- Target branch: `cr-004-ui-ux-v0.1`
- Production baseline: `baseline-cr003-production`

## Goal
CR-003 Productionを破壊せず、公共案件版求人サイト型UXへ再設計し、CR-004適用前後のM3 Evidenceを自動比較可能にする。

## Must Read
AGENTS.md → CHANGE_REQUEST_CR-004.md → REQUIREMENTS.md → CHANGE_IMPACT_CR-004.md → BASIC_DESIGN.md → UI_DESIGN.md → SCREEN_FLOW.md → DB_DESIGN.md → API_DESIGN.md → DATA_FLOW.md → DETAIL_DESIGN.md → EVIDENCE_EXPORT_DESIGN.md → SECURITY_REVIEW.md → TEST_PLAN.md → READY_TO_BUILD.md。

## P0 Tasks
### DB-004
- events.release_version
- watch_items.source_hash_snapshot
- schema marker cr004
- non-destructive bootstrap

### API-004
- Home view model
- Search decision/watch/update/sort
- Detail match band/application prep
- Profile completion/event split
- WATCH update/event

### UI-004
- Home section priority
- job-site cards
- detail ordering
- WATCH update UX
- profile completion
- application prep checklist
- mobile/desktop nav

### EVT-004
- preserve existing event names
- add application_prep_start/profile_update/watch_remove
- server release_version=cr004

### EVIDENCE-004
- GitHub OIDC verify
- internal aggregate API
- daily/manual evidence-export workflow
- sanitized artifact

### TEST-004
- existing 59 regression
- CR-004 tests
- OIDC/evidence security tests
- Production E2E

## P1 Remaining
Workers AI concierge, persistent application-prep progress, history UI, advanced deadline management, public-sales readiness, organization research.

## Deployment
1. branch CI
2. P0 Gate
3. merge main
4. Cloudflare auto deploy
5. health/schema cr004
6. Production app/search/profile/watch/detail/evidence E2E
7. GitHub OIDC evidence export
8. Human Visual UAT
9. AIMOS-MGMT-SYNC-004

## Prohibitions
- CR-003 baseline rewrite
- event rename/delete
- fabricated tags/deadlines/eligibility
- public unauth metrics API
- raw identifiers in evidence artifact
- long-lived secret if OIDC works
- competitor design/code copying

## Completion
Automated + Production System UAT PASS, BLOCKING 0, Fixed Cost 0, Human Visual UAT status recorded, AI経営OS formal handoff issued.
