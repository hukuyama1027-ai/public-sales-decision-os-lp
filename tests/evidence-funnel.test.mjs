import test from 'node:test';
import assert from 'node:assert/strict';
import { __test } from '../lib/evidence.js';

test('search to detail uses search/detail user intersection',()=>{
  assert.match(__test.FUNNEL_RELEASE_SQL,/FROM s JOIN d/);
  assert.match(__test.FUNNEL_OVERALL_SQL,/FROM s JOIN d/);
});

test('detail to WATCH uses detail/watch intersection independent of search',()=>{
  assert.match(__test.FUNNEL_RELEASE_SQL,/FROM d JOIN w/);
  assert.match(__test.FUNNEL_OVERALL_SQL,/FROM d JOIN w/);
});

test('market evidence excludes automated and anonymous session classes',()=>{
  for(const x of ['anonymous','server','p0-e2e-%','live-smoke-%']) assert.match(__test.MARKET_EVENT_FILTER,new RegExp(x.replace('%','%')));
  assert.match(__test.FUNNEL_RELEASE_SQL,/MARKET_EVENT_FILTER|p0-e2e|live-smoke/);
});
