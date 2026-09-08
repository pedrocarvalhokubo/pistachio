/* Pizzeria rules. All durable actions share the main game's save transaction. */
(function(root){
'use strict';
const ITEMS={massa:{name:'Massa',pack:5,cost:5},molho:{name:'Molho',pack:5,cost:5},queijo:{name:'Muçarela',pack:5,cost:10},tomate:{name:'Tomate',pack:5,cost:5},calabresa:{name:'Calabresa',pack:5,cost:5},cogumelo:{name:'Cogumelo',pack:5,cost:5},manjericao:{name:'Manjericão',pack:5,cost:5}};
const RECIPES=[{id:'queijo',name:'Muçarela',toppings:[]},{id:'marguerita',name:'Marguerita',toppings:['tomate','manjericao']},{id:'calabresa',name:'Calabresa',toppings:['calabresa']},{id:'bosque',name:'Do bosque',toppings:['cogumelo','manjericao']},{id:'horta',name:'Da horta',toppings:['tomate','cogumelo']},{id:'especial',name:'Especial',toppings:['calabresa','tomate','manjericao']}];
const CELLS=[[.5,.5],...Array.from({length:8},(_,i)=>[.5+Math.cos(i*Math.PI/4)*.19,.5+Math.sin(i*Math.PI/4)*.19]),...Array.from({length:12},(_,i)=>[.5+Math.cos(i*Math.PI/6)*.32,.5+Math.sin(i*Math.PI/6)*.32])];
const integer=(v,f=0,max=999999)=>Number.isFinite(v)?Math.max(0,Math.min(max,Math.floor(v))):f;
const coord=v=>Number.isFinite(v)?Math.max(0,Math.min(1,v)):.5;
const inside=(p,r=.4)=>Math.hypot(p.x-.5,p.y-.5)<=r;
const recipe=id=>RECIPES.find(r=>r.id===id)||RECIPES[0];
function fresh(){return {version:1,cash:30,stock:{massa:5,molho:5,queijo:5,tomate:3,calabresa:3,cogumelo:3,manjericao:3},served:0,revenue:0,tips:0,best:0,active:null,last:null};}
function normalize(raw){const p=fresh();if(!raw||typeof raw!=='object')return p;for(const k of ['cash','served','revenue','tips','best'])p[k]=integer(raw[k],p[k],k==='best'?100:999999);for(const k of Object.keys(ITEMS))p.stock[k]=integer(raw.stock?.[k],p.stock[k],999);
 const a=raw.active;if(a&&typeof a==='object'&&['order','prep','oven','baking','cut','serve'].includes(a.stage)){
 p.active={id:integer(a.id,p.served+1),recipe:recipe(a.recipe).id,client:integer(a.client,0,3),slices:[4,6,8].includes(a.slices)?a.slices:6,stage:a.stage,bakeMs:integer(a.bakeMs,0,20000),used:{},sauce:[],cheese:[],toppings:[],cuts:[]};
 const n=p.active;for(const k of Object.keys(ITEMS))if(a.used?.[k]===true)n.used[k]=true;
 for(const [key,source]of [['sauce','sauce'],['cheese','cheese']])n[key]=Array.isArray(a[source])?[...new Set(a[source].filter(v=>Number.isInteger(v)&&v>=0&&v<CELLS.length))]:[];
 n.toppings=Array.isArray(a.toppings)?a.toppings.filter(t=>t&&Object.hasOwn(ITEMS,t.kind)&&!['massa','molho','queijo'].includes(t.kind)).slice(0,48).map(t=>({kind:t.kind,x:coord(t.x),y:coord(t.y)})):[];
 n.cuts=Array.isArray(a.cuts)?a.cuts.filter(v=>Number.isFinite(v)&&v>=0&&v<Math.PI).slice(0,8):[];
 }
 if(raw.last&&typeof raw.last==='object')p.last={score:integer(raw.last.score,0,100),pay:integer(raw.last.pay),tip:integer(raw.last.tip),name:recipe(raw.last.recipe).name,recipe:recipe(raw.last.recipe).id,client:integer(raw.last.client,0,3),notes:Array.isArray(raw.last.notes)?raw.last.notes.filter(x=>typeof x==='string').slice(0,4).map(x=>x.slice(0,150)):[]};
 return p;
}
function newOrder(p,rng=Math.random){if(p.active)return p.active;const unlocked=RECIPES.slice(0,Math.min(RECIPES.length,p.served+1));const r=p.served<RECIPES.length?RECIPES[p.served]:unlocked[Math.min(unlocked.length-1,Math.floor(rng()*unlocked.length))];p.active={id:p.served+1,recipe:r.id,client:p.served%4,slices:p.served<2?6:[4,6,8][p.served%3],stage:'order',bakeMs:0,used:{},sauce:[],cheese:[],toppings:[],cuts:[]};return p.active;}
function needs(a){return ['massa','molho','queijo',...recipe(a.recipe).toppings];}
function missing(p){return p.active?needs(p.active).filter(k=>!p.active.used[k]&&p.stock[k]<1):[];}
function start(p){const a=p.active;if(!a||a.stage!=='order'||missing(p).length)return false;p.stock.massa--;a.used.massa=true;a.stage='prep';return true;}
function use(p,key){const a=p.active;if(a.used[key])return true;if(!p.stock[key])return false;p.stock[key]--;a.used[key]=true;return true;}
function brush(p,key,point){const a=p.active;if(!a||a.stage!=='prep'||!['molho','queijo'].includes(key)||!inside(point))return false;const list=key==='molho'?a.sauce:a.cheese;const cells=CELLS.flatMap(([x,y],i)=>Math.hypot(point.x-x,point.y-y)<.125&&!list.includes(i)?[i]:[]);if(!cells.length||!use(p,key))return false;list.push(...cells);return true;}
function topping(p,key,point){const a=p.active;if(!a||a.stage!=='prep'||!Object.hasOwn(ITEMS,key)||['massa','molho','queijo'].includes(key)||!inside(point,.37)||a.toppings.filter(t=>t.kind===key).length>=12||!use(p,key))return false;a.toppings.push({kind:key,x:point.x,y:point.y});return true;}
function moveTo(p,stage){const a=p.active;if(!a)return false;const next={prep:'oven',oven:'baking',baking:'cut',cut:'serve'};if(next[a.stage]!==stage)return false;if(stage==='cut'&&a.bakeMs<1000)return false;a.stage=stage;return true;}
function tick(p,ms){if(p.active?.stage!=='baking')return;p.active.bakeMs=Math.min(20000,p.active.bakeMs+Math.max(0,Math.min(1000,ms)));}
function cut(p,from,to){const a=p.active;if(!a||a.stage!=='cut'||a.cuts.length>=8)return false;const dx=to.x-from.x,dy=to.y-from.y,len=Math.hypot(dx,dy);if(len<.72||Math.hypot(from.x-.5,from.y-.5)<.35||Math.hypot(to.x-.5,to.y-.5)<.35)return false;const distance=Math.abs(dy*.5-dx*.5+to.x*from.y-to.y*from.x)/len;if(distance>.085)return false;const t=((.5-from.x)*dx+(.5-from.y)*dy)/(len*len);if(t<0||t>1)return false;let angle=(Math.atan2(dy,dx)+Math.PI)%Math.PI;if(a.cuts.some(v=>Math.min(Math.abs(v-angle),Math.PI-Math.abs(v-angle))<.22))return false;a.cuts.push(angle);return true;}
function evaluate(a){const r=recipe(a.recipe),notes=[];const coverage=(a.sauce.length/CELLS.length+a.cheese.length/CELLS.length)/2;let correct=coverage;
 for(const kind of r.toppings){const ts=a.toppings.filter(t=>t.kind===kind),sectors=new Set(ts.map(t=>Math.floor((Math.atan2(t.y-.5,t.x-.5)+Math.PI)*4/(2*Math.PI))));correct+=Math.min(1,ts.length/6)*Math.min(1,sectors.size/3);if(ts.length<6)notes.push('Use pelo menos 6 pedaços de '+ITEMS[kind].name.toLowerCase()+'.');}
 correct/=(r.toppings.length+1);const extras=new Set(a.toppings.filter(t=>!r.toppings.includes(t.kind)).map(t=>t.kind));correct=Math.max(0,correct-extras.size*.2);if(extras.size)notes.push('Entrou um ingrediente que não estava no pedido.');if(coverage<.8)notes.push('Espalhe molho e muçarela por mais partes da massa.');
 const bake=a.bakeMs>=7000&&a.bakeMs<=12000?1:a.bakeMs<7000?Math.max(0,a.bakeMs/7000):Math.max(0,1-(a.bakeMs-12000)/8000);if(bake<.8)notes.push(a.bakeMs<7000?'A pizza precisava assar um pouco mais.':'Retire a pizza quando o indicador estiver verde.');
 const cutScore=a.cuts.length===a.slices/2?1:Math.max(0,1-Math.abs(a.cuts.length-a.slices/2)*.5);if(cutScore<1)notes.push('O pedido era de '+a.slices+' fatias: faça '+a.slices/2+' cortes atravessando o centro.');
 const score=Math.round(60*correct+25*bake+15*cutScore),price=16+r.toppings.length*3,pay=Math.max(3,Math.round(price*(.25+.75*score/100))),tip=score>=90?6:score>=75?3:score>=60?1:0;return {score,pay,tip,notes:notes.slice(0,3),name:r.name,recipe:r.id,client:a.client};}
function settle(p){if(p.active?.stage!=='serve')return null;const result=evaluate(p.active);p.cash+=result.pay+result.tip;p.served++;p.revenue+=result.pay;p.tips+=result.tip;p.best=Math.max(p.best,result.score);p.last=result;p.active=null;return result;}
function buy(p,key){if(!Object.hasOwn(ITEMS,key))return false;const item=ITEMS[key];if(p.cash<item.cost||p.stock[key]+item.pack>999)return false;p.cash-=item.cost;p.stock[key]+=item.pack;return true;}
function help(p){if(p.active&&p.active.stage!=='order')return false;const required=p.active?needs(p.active):['massa','molho','queijo'];const lack=required.filter(k=>p.stock[k]<1);if(!lack.length||lack.every(k=>p.cash>=ITEMS[k].cost))return false;for(const k of lack)p.stock[k]+=2;return true;}
const API={ITEMS,RECIPES,CELLS,fresh,normalize,recipe,inside,newOrder,missing,start,brush,topping,moveTo,tick,cut,evaluate,settle,buy,help};if(typeof module!=='undefined')module.exports=API;else root.PistachioPizza=API;
})(typeof globalThis!=='undefined'?globalThis:this);
