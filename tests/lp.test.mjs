import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const html=fs.readFileSync(new URL('../src/index.html',import.meta.url),'utf8');
test('required hero copy exists',()=>assert.match(html,/入札情報を探す時間を、/));
test('at least four CTA placements exist',()=>assert.ok((html.match(/data-cta=/g)||[]).length>=4));
test('three prices exist',()=>{for(const p of ['¥9,800','¥19,800','¥29,800'])assert.match(html,new RegExp(p.replace('¥','\\¥')))});
test('validation disclaimer exists',()=>assert.match(html,/実案件のリアルタイム照合はまだ提供していません/));
test('form required fields exist',()=>{for(const n of ['company_name','industry','services','region','public_experience','unified_qualification','email','price_interest','consent'])assert.match(html,new RegExp(`name="${n}"`));});
test('SEO essentials exist',()=>{for(const x of ['meta name="description"','rel="canonical"','property="og:title"','name="robots"'])assert.match(html,new RegExp(x));});
test('robots and sitemap exist',()=>{assert.ok(fs.existsSync(new URL('../src/robots.txt',import.meta.url)));assert.ok(fs.existsSync(new URL('../src/sitemap.xml',import.meta.url)));});
