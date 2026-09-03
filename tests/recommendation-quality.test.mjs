import test from 'node:test';
import assert from 'node:assert/strict';
import { keywordSignals, matchOpportunity } from '../lib/matcher.js';

const profile={
  services:'生成AI Web システム開発',
  strengths:'AI DX RPA',
  industry:'システム開発',
  regions_json:'["全国"]',
  public_experience:'considering',
  unified_qualification:'unknown'
};
const base={organization_name:'テスト機関',prefecture_name:'東京都',city_name:null,location:null,announced_at:'2026-09-03',deadline_at:null,category:'役務',procedure_type:null,certification:null,source_url:'https://example.go.jp'};

test('actual AI procurement keeps meaningful service relevance',()=>{
  const o={...base,title:'生成AI基盤開発及び実証支援業務',description:'生成AIを用いた業務システムの実証・開発を行う。'};
  const d=matchOpportunity(profile,o,new Date('2026-09-03T00:00:00Z'));
  assert.equal(d.service_relevant,true);
  assert.ok(['GO','WATCH'].includes(d.decision));
  assert.ok(keywordSignals(profile,o).includes('AI'));
});

test('passport delivery with late related AI link becomes NO-GO',()=>{
  const o={...base,title:'旅券（パスポート）等輸送業務委託',description:'旅券等を各拠点へ輸送する業務。'.repeat(40)+'関連リンク：クラウドサービス型生成AIサービス共同調達',category:'役務'};
  const d=matchOpportunity(profile,o,new Date('2026-09-03T00:00:00Z'));
  assert.equal(d.service_relevant,false);
  assert.equal(d.decision,'NO-GO');
});

test('civil engineering electronic bidding system wording does not create IT relevance',()=>{
  const o={...base,title:'河岸保護外工事',description:'河川の維持管理を目的に根固め工を施工する。電子入札システムを利用する。受注者の取組としてAI活用を評価する場合がある。',category:'工事',procedure_type:'一般競争入札'};
  const d=matchOpportunity(profile,o,new Date('2026-09-03T00:00:00Z'));
  assert.equal(d.service_relevant,false);
  assert.equal(d.decision,'NO-GO');
});

test('generic system keyword counts when it is procurement title itself',()=>{
  const o={...base,title:'業務システム保守運用業務',description:'既存業務システムの保守運用を行う。'};
  const signals=keywordSignals(profile,o);
  assert.ok(signals.includes('システム'));
  const d=matchOpportunity(profile,o,new Date('2026-09-03T00:00:00Z'));
  assert.equal(d.service_relevant,true);
  assert.ok(['GO','WATCH'].includes(d.decision));
});

test('missing certification alone never upgrades unrelated opportunity to WATCH',()=>{
  const o={...base,title:'ビニールシート購入',description:'選挙投票所用ビニールシートを購入する。',category:'物品',certification:null};
  const d=matchOpportunity(profile,o,new Date('2026-09-03T00:00:00Z'));
  assert.equal(d.decision,'NO-GO');
});
