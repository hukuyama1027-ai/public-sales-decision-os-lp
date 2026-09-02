import test from 'node:test';import assert from 'node:assert/strict';import {onRequestPost as postEvent,onRequestGet as getEvent} from '../functions/api/event.js';import {onRequestPost as postLead,onRequestGet as getLead} from '../functions/api/lead.js';
class DB { constructor(){this.calls=[];} prepare(sql){return {bind:(...args)=>({run:async()=>{this.calls.push({sql,args});return {meta:{last_row_id:1}};}})}} }
const req=(body)=>new Request('https://x.test/api',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
test('event accepts allowed event',async()=>{const db=new DB();const r=await postEvent({request:req({event_type:'page_view',session_id:'s'}),env:{DB:db}});assert.equal(r.status,200);assert.equal(db.calls.length,1)});
test('event rejects unknown event',async()=>{const r=await postEvent({request:req({event_type:'hack',session_id:'s'}),env:{DB:new DB()}});assert.equal(r.status,400)});
test('event GET is not public listing',async()=>assert.equal(getEvent().status,405));
const lead={company_name:'Example IT',industry:'AI開発',employee_scale:'10-30',services:'生成AI業務システム開発',region:'全国',public_experience:'considering',unified_qualification:'unknown',email:'a@example.com',price_interest:'19800',usage_interest:true,consent:true,website:''};
test('lead accepts valid payload',async()=>{const db=new DB();const r=await postLead({request:req(lead),env:{DB:db}});assert.equal(r.status,200);assert.equal(db.calls.length,1)});
test('lead requires consent',async()=>{const r=await postLead({request:req({...lead,consent:false}),env:{DB:new DB()}});assert.equal(r.status,400)});
test('lead rejects invalid email',async()=>{const r=await postLead({request:req({...lead,email:'bad'}),env:{DB:new DB()}});assert.equal(r.status,400)});
test('honeypot silently drops',async()=>{const db=new DB();const r=await postLead({request:req({...lead,website:'spam'}),env:{DB:db}});assert.equal(r.status,200);assert.equal(db.calls.length,0)});
test('lead GET is not public listing',async()=>assert.equal(getLead().status,405));
