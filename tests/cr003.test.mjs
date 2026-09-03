import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseKkjXml, buildKkjUrl, normalizeDate, KKJ_PORTAL_URL } from '../lib/kkj-adapter.js';
import { normalizeOpportunity } from '../lib/opportunity-normalizer.js';
import { matchOpportunity } from '../lib/matcher.js';
import { nextActions } from '../lib/next-actions.js';
import { safeHttpUrl, validDate } from '../lib/validation.js';
import { __test as profileTest } from '../functions/api/profile.js';
import { __test as eventTest } from '../functions/api/event.js';

const one = `<Results><SearchResult><Key>K1</Key><ProjectName><![CDATA[生成AIシステム開発業務]]></ProjectName><OrganizationName>テスト省</OrganizationName><CftIssueDate>2026-09-01</CftIssueDate><Category>3</Category><ProcedureType>1</ProcedureType><Location>東京都</Location><Certification>A B</Certification><ProjectDescription>AI Web システム開発</ProjectDescription><ExternalDocumentURI>https://example.go.jp/tender/1</ExternalDocumentURI></SearchResult></Results>`;
const missing = `<Results><SearchResult><ProjectName>Web運用支援</ProjectName><OrganizationName>テスト庁</OrganizationName></SearchResult></Results>`;

test('KKJ XML single result normalizes to array',()=>assert.equal(parseKkjXml(one).length,1));
test('KKJ XML preserves title text',()=>assert.equal(parseKkjXml(one)[0].title,'生成AIシステム開発業務'));
test('KKJ XML missing optional fields remain null',()=>assert.equal(parseKkjXml(missing)[0].certification,null));
test('KKJ API error XML throws',()=>assert.throws(()=>parseKkjXml('<Root><Error>bad</Error></Root>'),/KKJ_ERROR/));
test('KKJ URL caps count at 50',()=>assert.equal(buildKkjUrl({q:'AI',count:999}).searchParams.get('Count'),'50'));
test('KKJ URL encodes Query',()=>assert.equal(buildKkjUrl({q:'AI システム'}).searchParams.get('Query'),'AI システム'));
test('official portal URL is configured',()=>assert.match(KKJ_PORTAL_URL,/kkj\.go\.jp/));
test('date parser accepts ISO-like',()=>assert.equal(normalizeDate('2026-9-1'),'2026-09-01'));
test('date validator rejects impossible date',()=>assert.equal(validDate('2026-02-31'),false));
test('safe URL rejects javascript scheme',()=>assert.equal(safeHttpUrl('javascript:alert(1)'),null));

test('opportunity normalizer never invents deadline',async()=>{const x=await normalizeOpportunity(parseKkjXml(one)[0],'2026-09-03T00:00:00Z');assert.equal(x.deadline_at,null);assert.equal(x.deadline_source,null)});
test('opportunity normalizer produces deterministic id',async()=>{const src=parseKkjXml(one)[0];const a=await normalizeOpportunity(src,'2026-09-03T00:00:00Z');const b=await normalizeOpportunity(src,'2026-09-04T00:00:00Z');assert.equal(a.id,b.id)});

const profile={services:'生成AI Web システム開発',strengths:'AI DX',industry:'システム開発',regions_json:'["東京都"]',public_experience:'once_or_more',unified_qualification:'yes'};
const opp={title:'生成AIシステム開発業務',description:'AI Web システム',category:'役務',procedure_type:'一般競争入札',prefecture_name:'東京都',city_name:null,location:'東京都',certification:'A',announced_at:'2026-09-01',source_url:'https://example.go.jp',deadline_at:null,organization_name:'テスト省'};
test('matcher returns a bounded score',()=>{const x=matchOpportunity(profile,opp,new Date('2026-09-03T00:00:00Z'));assert.ok(x.score>=0&&x.score<=100)});
test('matcher explains positive reasons',()=>assert.ok(matchOpportunity(profile,opp,new Date('2026-09-03T00:00:00Z')).positive_reasons.length>0));
test('missing deadline is reported as missing information',()=>assert.ok(matchOpportunity(profile,opp,new Date('2026-09-03T00:00:00Z')).missing_information.includes('提出締切')));
test('unknown qualification never becomes formal eligibility assertion',()=>{const x=matchOpportunity({...profile,unified_qualification:'unknown'},{...opp,certification:null},new Date('2026-09-03T00:00:00Z'));assert.ok(['WATCH','NO-GO','GO'].includes(x.decision));assert.equal(x.check_points.some(v=>/参加不可|法的/.test(v)),false)});
test('NO-GO wording explicitly avoids participation prohibition',()=>{const x=matchOpportunity({...profile,services:'印刷',strengths:'',regions_json:'["北海道"]',public_experience:'none'},{...opp,title:'清掃業務',description:'清掃',prefecture_name:'東京都',location:'東京都',category:null,procedure_type:null,certification:null,source_url:null},new Date('2026-09-03T00:00:00Z'));if(x.decision==='NO-GO')assert.ok(x.check_points.some(v=>/参加不可の判定ではありません/.test(v)))});

test('NEXT ACTION always includes original notice check',()=>assert.ok(nextActions(opp,profile).some(v=>/公告原文/.test(v))));
test('NEXT ACTION adds deadline original check when unknown',()=>assert.ok(nextActions(opp,profile).some(v=>/提出期限.*原典/.test(v))));
test('NEXT ACTION adds qualification status check for unknown profile',()=>assert.ok(nextActions(opp,{...profile,unified_qualification:'unknown'}).some(v=>/全省庁統一資格/.test(v))));

test('profile sanitizer trims and accepts valid profile',()=>{const p=profileTest.sanitize({company_name:' Test ',industry:'IT',services:'AI開発',regions:['東京都'],employee_scale:'10-30',desired_project_size:'undecided',public_experience:'considering',unified_qualification:'unknown',strengths:'AI'});assert.equal(profileTest.valid(p),true);assert.equal(p.company_name,'Test')});
test('profile rejects missing regions',()=>{const p=profileTest.sanitize({company_name:'Test',industry:'IT',services:'AI開発',regions:[],employee_scale:'',desired_project_size:'undecided',public_experience:'none',unified_qualification:'unknown'});assert.equal(profileTest.valid(p),false)});
test('CR-003 events are allowed',()=>{for(const e of ['public_search','public_search_result_view','opportunity_detail_view','watch_add','company_profile_complete','recommended_opportunity_view','go_view','watch_view','no_go_view','next_action_view','ai_support_start'])assert.ok(eventTest.ALLOWED_EVENTS.has(e))});
test('event metadata does not retain arbitrary PII keys',()=>{const x=eventTest.safeMetadata('public_search',{has_keyword:true,email:'secret@example.com',company_name:'X'});assert.deepEqual(x,{has_keyword:true})});

test('free app static shell exists',()=>assert.ok(fs.existsSync(new URL('../src/app/index.html',import.meta.url))));
test('free app contains five main navigation labels',()=>{const h=fs.readFileSync(new URL('../src/app/index.html',import.meta.url),'utf8');for(const x of ['ホーム','案件検索','WATCH','AI相談','マイページ'])assert.match(h,new RegExp(x))});
test('free app contains official API attribution and coverage disclaimer',()=>{const h=fs.readFileSync(new URL('../src/app/index.html',import.meta.url),'utf8');assert.match(h,/官公需情報ポータル.*API/);assert.match(h,/すべての公共調達案件を網羅するものではありません/)});
test('security headers include CSP',()=>{const h=fs.readFileSync(new URL('../src/_headers',import.meta.url),'utf8');assert.match(h,/Content-Security-Policy/);assert.match(h,/frame-ancestors 'none'/)});
test('migration is non-destructive',()=>{const sql=fs.readFileSync(new URL('../migration_cr003.sql',import.meta.url),'utf8');assert.doesNotMatch(sql,/\bDROP\b/i);assert.doesNotMatch(sql,/DELETE\s+FROM\s+(events|leads)/i)});

test('all P0 function modules import successfully',async()=>{for(const p of ['../functions/api/health.js','../functions/api/home.js','../functions/api/profile.js','../functions/api/watch.js','../functions/api/watch/[id].js','../functions/api/recommendations.js','../functions/api/recent.js','../functions/api/opportunities/search.js','../functions/api/opportunities/[id].js'])await import(p)});
