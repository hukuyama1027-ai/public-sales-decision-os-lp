# TEST_PLAN｜公共営業 意思決定OS｜CR-004

- 文書ID: AIMOS-LP-TP-001
- 版数: v0.3
- 状態: APPROVED_BY_AI_TEST_DESIGN
- 対応: AIMOS-CR-003 + AIMOS-CR-004 + Issue #7

## 1. Gate Policy
- CR-003既存59テストを全回帰する。
- CR-004 P0/UI/API/Event/Evidence追加testを全PASS。
- BLOCKING/重大bug 0でmainへmerge。
- Production System UATはCloudflare本番で実施。
- Human Visual UATはユーザー本人の体感確認として別Gate。

## 2. Traceability
| Group | Requirements |
|---|---|
| T-REG | CR-003 P0全要件 |
| T-HOME | REQ-UI-101 |
| T-CARD | REQ-UI-102 |
| T-DETAIL | REQ-UI-103/104/108 |
| T-WATCH | REQ-UI-105 |
| T-SEARCH | REQ-UI-106 |
| T-PROFILE | REQ-UI-107 |
| T-NAV | REQ-UI-109/110 |
| T-EVENT | REQ-EVT-101..106 |
| T-METRICS | REQ-MET-001..008 |
| T-SEC | Security requirements |

## 3. CR-003 Regression
既存 `npm test` の59件を維持し、検索品質、recommendation品質、deadline推測禁止、CSP、profile/watch、official API、LP/lead/eventをPASSする。

## 4. Home Tests
- T-HOME-001 section DOM order: 今日やること→おすすめ→新着→締切間近→WATCH更新→提案
- T-HOME-002 search formがHome最上位主役になっていない
- T-HOME-003 profile missing CTA
- T-HOME-004 watch update priority
- T-HOME-005 recommendation empty state
- T-HOME-006 AI未実装時にAI生成済みと誤認させない

## 5. Card Tests
- T-CARD-001 GO card primary action=応募準備を見る
- T-CARD-002 WATCH card WATCH CTA
- T-CARD-003 NO-GO reason CTA/表示
- T-CARD-004 match band high/medium/low
- T-CARD-005 exact scoreを主要表示しない
- T-CARD-006 source fields missing→推測表示なし
- T-CARD-007 feature tag allowlist/deterministic only
- T-CARD-008 trusted deadline null→原典で確認
- T-CARD-009 textContent-safe render

## 6. Detail Tests
- T-DETAIL-001 decision hero first
- T-DETAIL-002 reasons/checks visible before raw long description
- T-DETAIL-003 source/OS sections separated
- T-DETAIL-004 application prep/NEXT ACTION visible
- T-DETAIL-005 formal eligibility disclaimer
- T-DETAIL-006 source link preserved
- T-DETAIL-007 application_prep_start only user action, not mere render

## 7. WATCH Tests
- T-WATCH-001 add stores source_hash_snapshot
- T-WATCH-002 unchanged raw_hash has_update=false
- T-WATCH-003 changed raw_hash has_update=true
- T-WATCH-004 legacy snapshot null=false
- T-WATCH-005 remove records watch_remove
- T-WATCH-006 cross-client isolation regression

## 8. Profile Tests
- T-PROFILE-001 completion 0..100
- T-PROFILE-002 completion reflects missing fields
- T-PROFILE-003 completion is not public-sales readiness wording
- T-PROFILE-004 first save company_profile_complete
- T-PROFILE-005 subsequent save profile_update only
- T-PROFILE-006 existing delete flow regression

## 9. Search Tests
- T-SEARCH-001 sort enum validation
- T-SEARCH-002 fit sort with profile
- T-SEARCH-003 fit sort without profile fallback
- T-SEARCH-004 deadline null last/no fabricated date
- T-SEARCH-005 search response includes decision/watched/update when token exists
- T-SEARCH-006 CR-003 short ASCII relevance regression

## 10. Event/Release Tests
- T-EVT-001 existing event names unchanged
- T-EVT-002 added event allowlist
- T-EVT-003 recordEvent server writes release_version=cr004
- T-EVT-004 request body release_version ignored
- T-EVT-005 metadata PII block regression
- T-EVT-006 legacy events remain readable

## 11. DB Migration Tests
- T-DB-001 events.release_version added idempotently
- T-DB-002 watch_items.source_hash_snapshot added idempotently
- T-DB-003 existing rows untouched
- T-DB-004 schema marker cr004
- T-DB-005 no DROP/DELETE migration

## 12. OIDC Unit Tests
JWT fixturesはテスト用RSA keypairで生成し、GitHub real keyをunit testへ依存させない。
- T-OIDC-001 valid RS256 JWT PASS
- T-OIDC-002 malformed JWT 401
- T-OIDC-003 wrong alg reject
- T-OIDC-004 bad signature reject
- T-OIDC-005 wrong issuer reject
- T-OIDC-006 wrong audience reject
- T-OIDC-007 wrong repository reject
- T-OIDC-008 wrong ref reject
- T-OIDC-009 wrong workflow_ref reject
- T-OIDC-010 expired reject
- T-OIDC-011 future nbf reject
- T-OIDC-012 unknown kid reject
- T-OIDC-013 token jku/x5u ignored

## 13. Evidence API Tests
- T-MET-001 no Authorization→401 before DB
- T-MET-002 invalid days→400
- T-MET-003 days only 7/30/90
- T-MET-004 no raw client_key/session_id/email/company/search keyword in JSON
- T-MET-005 release split legacy_cr003/cr004
- T-MET-006 denominator 0 rate=null
- T-MET-007 repeat user definition >=2 distinct dates
- T-MET-008 lead/pricing aggregate only
- T-MET-009 endpoint GET-only
- T-MET-010 arbitrary dimension/sql unsupported

## 14. Evidence Workflow Tests
- T-WF-001 permissions id-token:write, contents:read only
- T-WF-002 custom audience requested
- T-WF-003 token is not echoed/logged
- T-WF-004 endpoint response ok validated
- T-WF-005 evidence.json artifact upload
- T-WF-006 retention 30d
- T-WF-007 scheduled + manual trigger

## 15. Responsive/UI Static Tests
- T-UI-001 5 mobile nav labels
- T-UI-002 tap target min-height>=44px by CSS rule
- T-UI-003 focus-visible
- T-UI-004 desktop header nav
- T-UI-005 no Excel-style table primary layout
- T-UI-006 Home section headings present
- T-UI-007 card reason/check labels
- T-UI-008 profile progress
- T-UI-009 WATCH update badge

## 16. Production System UAT
GitHub Actions外部runnerから本番へ:
1. `/api/health` schema cr004
2. `/app/` CR-004 headings/card CSS marker
3. profile save
4. real `AI` search
5. result decision/match band
6. detail
7. application prep event
8. WATCH add/read/update flag
9. Home section data
10. recommendation
11. cleanup
12. internal evidence endpoint: unauthorized 401
13. GitHub OIDC workflow authenticated evidence export SUCCESS
14. artifact contains aggregate schema only

## 17. Baseline Comparison Test
- `baseline-cr003-production` branch exists at expected SHA
- event names shared between releases unchanged
- legacy event row count not reduced by migration
- CR-004 events contain release_version
- evidence response exposes both release groups when data exists

## 18. Human Visual UAT
PC/スマホで確認:
1. Homeを開いて最初に何をすべきか分かる
2. おすすめが検索より先に理解できる
3. カード1枚で見るべき案件か判断できる
4. GO/WATCH/NO-GOの意味が直感的
5. WATCHが自然
6. 応募準備/NEXT ACTIONへ迷わず進める
7. 公共営業支援サービスだと認識できる
8. スマホ5ナビが使いやすい

## 19. Exit Criteria
- Automated tests all PASS
- existing CR-003 regression PASS
- BLOCKING 0 / P0 bug 0
- Production deploy PASS
- System UAT PASS
- Evidence export authenticated PASS
- Fixed cost 0円
- Human Visual UAT statusを明記
