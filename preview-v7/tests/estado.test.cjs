const assert=require('node:assert/strict');
const S=require('../assets/estado.js');
function memory(seed={}){const d=new Map(Object.entries(seed));return {getItem:k=>d.get(k)||null,setItem:(k,v)=>d.set(k,v),d};}
const original={...S.fresh(),fase:'adulto',roupinha:6,roupinhasCompradas:[1,2,3,6],estrelinhas:35,estoque:{maca:7},familia:[{nome:'Primeiro'}]};
delete original.look;
let m=memory({[S.OLD]:JSON.stringify(original)}),r=S.repository(m),load=r.load();
assert.equal(load.status,'migrated');assert.equal(load.state.estrelinhas,35);assert.equal(load.state.estoque.maca,7);assert.deepEqual(load.state.look,[6]);assert.equal(load.state.familia[0].nome,'Primeiro');
assert(r.save(load.state).ok);const old=m.getItem(S.OLD);load.state.estrelinhas=36;assert(r.save(load.state).ok);assert.equal(r.previous().state.estrelinhas,35);assert.equal(m.getItem(S.OLD),old);
m.setItem(S.KEY,'{broken');r=S.repository(m);load=r.load();assert.equal(load.status,'recovered');assert.equal(load.state.estrelinhas,35);assert.equal(r.save(load.state).ok,false);assert(r.save(load.state,{confirm:true}).ok);assert.equal(m.getItem(S.KEY+'.damaged'),'{broken');
const r2=S.repository(m);r2.load();load.state.estrelinhas=40;assert(r.save(load.state).ok);assert.equal(r2.save(S.fresh()).conflict,true);
const packed=S.pack(original);assert(Math.abs(S.unpack(packed).savedAt-Date.now())<5000,'Save timestamp must survive reload');assert.equal(S.unpack(packed).state.estrelinhas,35);assert.throws(()=>S.unpack(packed.replace('"estrelinhas":35','"estrelinhas":999')));assert.throws(()=>S.unpack('{}'));assert.throws(()=>S.unpack('[]'));
const denied=S.repository({getItem:()=>null,setItem:()=>{throw Error('quota');}});denied.load();assert.equal(denied.save(S.fresh()).ok,false);
for(const level of [1,2,3])for(const mode of ['mul','div','mix'])for(let i=0;i<500;i++){const q=S.question(mode,level);assert(q.b>=2);assert(Number.isInteger(q.answer));if(q.op==='mul')assert.equal(q.answer,q.a*q.b);else{assert.equal(q.a,q.answer*q.b+q.remainder);assert(q.remainder>=0&&q.remainder<q.b);if(level<3)assert.equal(q.remainder,0);}}
console.log('PASS: migration, round-trip, corruption recovery, previous snapshot, tab conflict, storage failure, 4500 math cases');
