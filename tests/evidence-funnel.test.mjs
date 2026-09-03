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
