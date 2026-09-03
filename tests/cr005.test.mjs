import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {normalizeCardData,hasValidOpportunityId,watchRequestBody} from '../src/app/ui-adapter.js';

const flat={id:'opp-1',title:'生成AI開発業務',organization_name:'テスト庁',prefecture_name:'東京都',source:'kkj',decision:{decision:'WATCH',positive_reasons:['AI一致'],check_points:[]},match_band:'medium'};
const nested={source:{id:'opp-2',title:'Webシステム開発',organization_name:'テスト市'},decision:{decision:'GO',positive_reasons:['Web一致'],check_points:[]},match_band:'high',watched:true};

test('CR-005 flat KKKJ item is not mistaken for nested source object',()=>{
  const x=normalizeCardData(flat);
  assert.equal(x.item.id,'opp-1');
  assert.equal(x.item.title,'生成AI開発業務');
  assert.equal(x.item.organization_name,'テスト庁');
  assert.equal(x.item.source,'kkj');
  assert.equal(x.decision.decision,'WATCH');
});

test('CR-005 nested view model remains supported',()=>{
  const x=normalizeCardData(nested);
  assert.equal(x.item.id,'opp-2');
  assert.equal(x.item.title,'Webシステム開発');
  assert.equal(x.watched,true);
  assert.equal(x.decision.decision,'GO');
});

test('WATCH request body always carries valid opportunity id',()=>{
  assert.deepEqual(watchRequestBody(flat),{opportunity_id:'opp-1'});
  assert.equal(hasValidOpportunityId(flat),true);
  assert.throws(()=>watchRequestBody({title:'no id'}),/INVALID_OPPORTUNITY_ID/);
});

test('browser app uses adapter and accessible WATCH state',()=>{
  const js=fs.readFileSync(new URL('../src/app/app.js',import.meta.url),'utf8');
  assert.match(js,/normalizeCardData/);
  assert.match(js,/watchRequestBody/);
  assert.match(js,/aria-pressed/);
  assert.doesNotMatch(js,/item\.title\|\|'案件名なし'/);
});

test('CR-005 visual stylesheet is loaded',()=>{
  const h=fs.readFileSync(new URL('../src/app/index.html',import.meta.url),'utf8');
  assert.match(h,/visual-cr005\.css/);
  assert.match(h,/公共営業OS CR-005/);
});

test('CR-005 visual layer contains original inline SVG illustrations without external image dependency',()=>{
  const css=fs.readFileSync(new URL('../src/app/visual-cr005.css',import.meta.url),'utf8');
  assert.match(css,/data:image\/svg\+xml/);
  assert.match(css,/#view-home \.page-head::after/);
  assert.match(css,/#view-search \.page-head::after/);
  assert.match(css,/#view-watch \.page-head::after/);
  assert.match(css,/#view-profile \.page-head::after/);
  assert.doesNotMatch(css,/https?:\/\//);
});

test('CR-005 mobile visual layer prevents horizontal overflow and preserves touch-friendly cards',()=>{
  const css=fs.readFileSync(new URL('../src/app/visual-cr005.css',import.meta.url),'utf8');
  assert.match(css,/body\{overflow-x:hidden\}/);
  assert.match(css,/\.card-actions\{display:grid;grid-template-columns:1fr 1fr\}/);
});
