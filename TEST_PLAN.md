# TEST_PLAN｜公共営業 意思決定OS｜LP + 無料版 v0.1

- 文書ID: AIMOS-LP-TP-001
- 版数: v0.2
- 状態: APPROVED_BY_AI_TEST_DESIGN
- 対応: AIMOS-CR-003

## 1. Gate Policy
- P0必須機能: unit/component/integration/systemの実施可能試験をPASS。
- P0/P1 BLOCKING=0、重大=0で実環境UATへ。
- 外部官公需API実通信はCloudflare実環境でのみ最終確認可。mockだけで「実検索確認済み」としない。
- 既存LPは回帰必須。

## 2. Traceability
| Test Group | Requirement |
|---|---|
| TP-LP | REQ-LP-001..005 |
| TP-SEARCH | REQ-F-001..004, REQ-DATA-001..006 |
| TP-WATCH | REQ-F-005 |
| TP-PROFILE | REQ-F-006 |
| TP-MATCH | REQ-F-007..009, REQ-AI-001..005 |
| TP-NEXT | REQ-F-010 |
| TP-HOME | REQ-UI-001..007 |
| TP-EVENT | REQ-EVT-001..011 |
| TP-SEC | REQ-SEC-001..008 |
| TP-P1 | REQ-F-011..016 |

## 3. Automated Unit/Component Tests
### TP-LP
- TP-LP-001 existing main copy/price/CTA exists
- TP-LP-002 diagnosis required fields
- TP-LP-003 demand-validation disclaimer
- TP-LP-004 canonical/robots/sitemap stable URL
- TP-LP-005 `/app/` CTA exists after CR-003 implementation

### TP-XML
- TP-XML-001 0 result XML→[]
- TP-XML-002 single result→array[1]
- TP-XML-003 multiple results→array[N]
- TP-XML-004 missing optional tags remain null
- TP-XML-005 CDATA/entity safe decode
- TP-XML-006 API `<Error>` treated as error
- TP-XML-007 attachment list normalization
- TP-XML-008 no HTML execution from source text

### TP-SEARCH
- TP-SEARCH-001 input length/bad date rejected
- TP-SEARCH-002 limit max 50
- TP-SEARCH-003 local D1 search returns normalized cards
- TP-SEARCH-004 cache fresh→no upstream fetch
- TP-SEARCH-005 stale/empty + valid key→one upstream fetch max
- TP-SEARCH-006 upstream timeout + cache→stale result
- TP-SEARCH-007 upstream failure + no cache→503
- TP-SEARCH-008 opportunity upsert idempotent
- TP-SEARCH-009 missing deadline→`deadline_at=null`
- TP-SEARCH-010 arbitrary upstream URL impossible

### TP-TOKEN/PROFILE
- TP-PROFILE-001 token hash deterministic; raw token not stored
- TP-PROFILE-002 missing/invalid token rejected for private state
- TP-PROFILE-003 valid profile upsert/reload
- TP-PROFILE-004 boundary lengths
- TP-PROFILE-005 invalid enums rejected
- TP-PROFILE-006 cross-token profile access impossible
- TP-PROFILE-007 delete removes private state and rotates client token at UI level

### TP-WATCH
- TP-WATCH-001 add existing opportunity
- TP-WATCH-002 duplicate add stays one row
- TP-WATCH-003 nonexistent opportunity rejected
- TP-WATCH-004 only own watch returned
- TP-WATCH-005 delete own watch
- TP-WATCH-006 other token cannot delete

### TP-MATCH
- TP-MATCH-001 strong keyword/region match raises score
- TP-MATCH-002 unknown qualification does not produce formal NO-GO
- TP-MATCH-003 missing critical info tends WATCH
- TP-MATCH-004 score clamped 0..100
- TP-MATCH-005 reason arrays match scoring signals
- TP-MATCH-006 information completeness reflects missing source data
- TP-MATCH-007 no phrase claims legal/formal eligibility

### TP-NEXT
- TP-NEXT-001 default five checks
- TP-NEXT-002 missing qualification adds original-check action
- TP-NEXT-003 deadline null adds original deadline check
- TP-NEXT-004 no fabricated date/amount

### TP-EVENT
- TP-EVENT-001 all CR-003 events allowed
- TP-EVENT-002 unknown event rejected
- TP-EVENT-003 metadata allowlist strips/blocks email/company/services
- TP-EVENT-004 server WATCH/profile events record client_key only

### TP-AI（P1）
- TP-AI-001 no opportunity/profile leak across token
- TP-AI-002 prompt contains fixed safety guard
- TP-AI-003 AI error/quota does not break non-AI features
- TP-AI-004 UI displays AI reference label
- TP-AI-005 answer always includes original-source confirmation notice

## 4. DB Migration Tests
- TP-DB-001 existing events/leads data remains after migration
- TP-DB-002 new tables created
- TP-DB-003 event new columns nullable
- TP-DB-004 watch composite uniqueness
- TP-DB-005 profile PK client_key
- TP-DB-006 opportunity upsert no duplicate
- TP-DB-007 no DROP/DELETE in migration except explicit user profile-delete runtime

## 5. Security Tests
- TP-SEC-001 CSP/referrer/nosniff/permissions headers
- TP-SEC-002 source text rendered via textContent / escaped path
- TP-SEC-003 arbitrary external URL cannot be fetched
- TP-SEC-004 token not in URL/query/log response
- TP-SEC-005 guessed opportunity ID does not expose private profile/watch
- TP-SEC-006 PII not written to product events
- TP-SEC-007 profile delete scoped to current client_key
- TP-SEC-008 GET lead list remains unavailable
- TP-SEC-009 JSON body/schema validation
- TP-SEC-010 source link only http/https official/source URL; javascript: rejected

## 6. UI Tests
Desktop 1440px / tablet 768px / mobile 360px:
- TP-UI-001 app navigation usable
- TP-UI-002 home sections understandable
- TP-UI-003 search card readability
- TP-UI-004 filter panel usable mobile
- TP-UI-005 WATCH visual state
- TP-UI-006 source vs OS/AI separation
- TP-UI-007 unknown data explicitly labeled
- TP-UI-008 keyboard focus visible
- TP-UI-009 44px target
- TP-UI-010 empty/error/stale states

## 7. Performance/Cost Tests
- TP-PERF-001 static app assets target <250KB gzip
- TP-PERF-002 search result <=50
- TP-PERF-003 home sections <=5 each
- TP-PERF-004 upstream calls per user search <=1
- TP-PERF-005 repeat search within cache window avoids upstream
- TP-PERF-006 Free plan resources only; no paid dependency/API key required
- TP-PERF-007 D1 query count within platform invocation cap

## 8. Cloudflare Integration Tests
- TP-CF-001 Pages build/deploy success
- TP-CF-002 D1 migration applied production
- TP-CF-003 `/api/health` DB true
- TP-CF-004 官公需API実検索 returns real source item
- TP-CF-005 source link opens original/official page where provided
- TP-CF-006 search creates/updates D1 opportunity cache
- TP-CF-007 profile persists reload
- TP-CF-008 WATCH persists reload
- TP-CF-009 usage event stored
- TP-CF-010 scheduled sync executes if deployed
- TP-CF-011 Workers AI P1 only if binding configured; otherwise P1 NOT_EXECUTED not P0 blocker

## 9. P0 System Scenario
1. Open stable URL
2. LP→free app
3. Create profile
4. Search `AI` or `システム開発`
5. Verify real public opportunity title/organization/source attribution
6. Open detail
7. Check GO/WATCH/NO-GO + reasons
8. Check NEXT ACTION
9. Add WATCH
10. Reload and verify WATCH
11. Return Home, verify recommendation/new/watch sections
12. Check D1 events

Exit: all P0 scenario steps PASS.

## 10. UAT（ユーザーはこれだけ）
1. スマホまたはPCで本番URL→「実案件を探す」へ進む
2. プロフィールを1件保存
3. `AI`または`システム開発`で検索し、案件詳細を1件開く
4. WATCHを1件追加
5. GO/WATCH/NO-GO・理由・NEXT ACTIONを見て「何を次に確認すべきか分かるか」確認

迷う/意味が分からない/期待と違う場合は不具合またはCRとして扱う。

## 11. Exit Criteria
- P0 automated tests PASS
- P0 Cloudflare integration PASS
- major/blocking bugs 0
- real official opportunity search PASS
- D1 event measurement PASS
- responsive UAT PASS
- existing LP regression PASS
- monthly fixed cost 0円
