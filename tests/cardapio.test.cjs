const assert=require('node:assert/strict'),P=require('../assets/pizzaria-core'),S=require('../assets/estado');
for(const r of P.RECIPES){
 const p=P.fresh();P.newOrder(p);p.active.recipe=r.id;assert(P.start(p),r.id);
 for(const [x,y] of P.CELLS){P.brush(p,'molho',{x,y});P.brush(p,P.base(p.active),{x,y});}
 for(const kind of r.toppings)for(let i=0;i<6;i++)assert(P.topping(p,kind,{x:.5+Math.cos(i*Math.PI/3)*.23,y:.5+Math.sin(i*Math.PI/3)*.23}),kind);
 p.active.bakeMs=8000;p.active.cuts=[0,Math.PI/3,Math.PI*2/3];
 assert.equal(P.evaluate(p.active).score,100,r.id);
 const restored=S.unpack(S.pack({...S.fresh(),pizzaria:p})).state.pizzaria;
 assert.equal(P.evaluate(restored.active).score,100,r.id+' save');assert.deepEqual(restored.stock,p.stock);
 if(r.base){assert(!P.brush(p,'queijo',{x:.5,y:.5}));assert.equal(p.stock.queijo,5);assert.equal(p.stock[r.base],2);}
}
let p=P.fresh(),seed=123;const rng=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296),seen=new Set();
for(let i=0;i<200;i++){const recent=[...p.recent],prev=p.last,clients={...p.clientOrders};const a=P.newOrder(p,rng);assert(!recent.includes(a.recipe));if(prev)assert.notEqual(a.client,prev.client);assert.notEqual(a.recipe,clients[a.client]);seen.add(a.recipe);a.stage='serve';P.settle(p);p=P.normalize(p);}
assert.equal(seen.size,P.RECIPES.length);
const legacy=P.normalize({cash:123,served:5,stock:{massa:0,queijo:7},active:{recipe:'marguerita',stage:'prep',used:{massa:true},sauce:[0],cheese:[1],toppings:[],cuts:[],client:2}});
assert.equal(legacy.cash,123);assert.equal(legacy.stock.massa,0);assert.equal(legacy.stock.queijo,7);assert.equal(legacy.stock.ovo,3);assert.equal(legacy.active.recipe,'marguerita');
p=P.fresh();P.newOrder(p);p.active.recipe='portuguesa';p.cash=5;p.stock.presunto=0;p.stock.ovo=0;assert(P.help(p));assert(P.start(p));
console.log('PASS: all 16 recipes, cheese substitutions, 200 varied orders, recurring customers, full saves and migration');
