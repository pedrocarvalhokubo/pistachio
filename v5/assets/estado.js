/* State format and learning generators. No dependency on DOM. */
(function(root){
'use strict';
const KEY='pistachio_qa_v5', OLD='pistachio_qa_legacy';
const plain=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
const int=(x,f=0,max=1e7)=>Number.isFinite(x)?Math.max(0,Math.min(max,Math.floor(x))):f;
const strings=x=>Array.isArray(x)?[...new Set(x.filter(v=>typeof v==='string').map(v=>v.slice(0,100)))].slice(0,1000):[];
function fresh(){return {fase:'ovo',nomeAtual:'Pistachio',medidores:{fome:70,carinho:70,limpeza:70,diversao:70},cuidadosTotal:0,diasComCuidado:[],estoque:{maca:3,cenoura:2},estrelinhas:0,roupinhasCompradas:[1,2,3],roupinha:0,look:[],looks:[],familia:[],somLigado:false,ultimaVisita:Date.now(),stats:{math:0,rounds:0,care:0,explore:0,catch:0,recipe:0},album:['fase:ovo'],visitas:[],descobertas:[],preferencias:{},decor:{tema:'casa',itens:['armario','almofada','planta'],owned:['armario','almofada','planta'],positions:{}},mission:{kind:'care',day:'',count:0,claimed:false},mathLevel:1};}
function normalize(raw){
 if(!plain(raw)||!['ovo','crianca','adulto'].includes(raw.fase)||!plain(raw.medidores))throw Error('Arquivo de progresso inválido.');
 const d=fresh(), n={...d};
 n.fase=raw.fase;n.nomeAtual=typeof raw.nomeAtual==='string'?raw.nomeAtual.trim().slice(0,24)||'Pistachio':'Pistachio';
 for(const k of Object.keys(d.medidores))n.medidores[k]=int(raw.medidores[k],70,100);
 for(const k of ['cuidadosTotal','estrelinhas'])n[k]=int(raw[k]);
 n.ultimaVisita=int(raw.ultimaVisita,Date.now(),Date.now()+60000);n.diasComCuidado=strings(raw.diasComCuidado);
 n.estoque={};if(plain(raw.estoque))for(const [k,v]of Object.entries(raw.estoque))if(/^[a-z0-9]{1,24}$/.test(k))n.estoque[k]=int(v,0,9999);
 n.roupinhasCompradas=[...new Set([1,2,3,...(Array.isArray(raw.roupinhasCompradas)?raw.roupinhasCompradas.filter(v=>Number.isInteger(v)&&v>0&&v<=20):[])])];
 n.roupinha=n.roupinhasCompradas.includes(raw.roupinha)?raw.roupinha:0;
 n.look=Array.isArray(raw.look)?raw.look.filter(v=>n.roupinhasCompradas.includes(v)).slice(0,6):(n.roupinha?[n.roupinha]:[]);
 n.looks=Array.isArray(raw.looks)?raw.looks.filter(plain).slice(0,12).map(v=>({name:String(v.name||'Meu look').slice(0,24),items:Array.isArray(v.items)?v.items.filter(i=>n.roupinhasCompradas.includes(i)).slice(0,6):[]})):[];
 n.familia=Array.isArray(raw.familia)?raw.familia.slice(0,100).filter(plain).map(v=>({nome: String(v.nome||v.nomeAtual||'Pistachio').slice(0,24),fase:['ovo','crianca','adulto'].includes(v.fase)?v.fase:'adulto'})):[];
 n.somLigado=raw.somLigado===true;
 for(const k of Object.keys(d.stats))n.stats[k]=int(raw.stats?.[k]);
 n.album=strings(raw.album);if(!n.album.includes('fase:'+n.fase))n.album.push('fase:'+n.fase);
 n.visitas=strings(raw.visitas);n.descobertas=strings(raw.descobertas);
 n.preferencias={};if(plain(raw.preferencias))for(const [k,v] of Object.entries(raw.preferencias))if(/^[a-z0-9-]{1,30}$/.test(k))n.preferencias[k]=int(v,0,9999);
 if(plain(raw.decor)){n.decor={tema:['casa','jardim','praia','observatorio'].includes(raw.decor.tema)?raw.decor.tema:'casa',itens:strings(raw.decor.itens).slice(0,7),owned:strings(raw.decor.owned),positions:{}};if(plain(raw.decor.positions))for(const [k,v] of Object.entries(raw.decor.positions)){if(/^(casa|jardim|praia|observatorio):[a-z]+$/.test(k)&&plain(v))n.decor.positions[k]={x:int(v.x,10,78),y:int(v.y,45,72)}};}
 if(plain(raw.mission)&&['care','math','explore'].includes(raw.mission.kind))n.mission={kind:raw.mission.kind,day:String(raw.mission.day).slice(0,10),count:int(raw.mission.count,0,99),claimed:raw.mission.claimed===true};
 const decorIds=['armario','almofada','poltrona','estante','planta','mesa','luminaria'];n.decor.owned=n.decor.owned.filter(id=>decorIds.includes(id));n.decor.itens=n.decor.itens.filter(id=>n.decor.owned.includes(id));
 n.mathLevel=int(raw.mathLevel,1,3)||1;return n;
}
function checksum(s){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return (h>>>0).toString(16);}
function pack(state){const data=normalize(state);return JSON.stringify({format:'pistachio',version:4,savedAt:Date.now(),data,checksum:checksum(JSON.stringify(data))});}
function unpack(text){if(typeof text!=='string'||text.length>500000)throw Error('Arquivo muito grande ou vazio.');const d=JSON.parse(text);if(d.format==='pistachio'){if(d.version!==4||!plain(d.data)||checksum(JSON.stringify(d.data))!==d.checksum)throw Error('Esta cópia está incompleta ou é de outra versão.');return {state:normalize(d.data),savedAt:int(d.savedAt,0,Date.now()+60000)};}return {state:normalize(d),savedAt:int(d.ultimaVisita,0,Date.now()+60000)};}
function repository(storage){
 let last=null,blocked=false;
 return {
 load(){let raw;try{raw=storage.getItem(KEY);if(raw){try{const p=unpack(raw);last=raw;return {...p,status:'loaded'};}catch(e){const b=storage.getItem(KEY+'.previous');if(b){const p=unpack(b);last=b;blocked=true;return {...p,status:'recovered',message:'A cópia principal não pôde ser lida. Recuperamos a anterior. Confirme em Salvar para usá-la.'};}blocked=true;return {state:fresh(),status:'blocked',message:'Não foi possível ler o progresso. Importe uma cópia antes de continuar.'};}}
 const old=storage.getItem(OLD);if(old){raw=old;const p=unpack(old);return {...p,status:'migrated'};}return {state:fresh(),status:'new'};
 }catch(e){blocked=!!raw;return {state:fresh(),status:blocked?'blocked':'unavailable',message:'O armazenamento não está disponível. Baixe uma cópia para guardar o progresso.'};}},
 save(state,{confirm=false}={}){if(blocked&&!confirm)return {ok:false,message:'Confirme a recuperação ou importe uma cópia em Salvar.'};try{const current=storage.getItem(KEY);if(!confirm&&current!==last)return {ok:false,conflict:true,message:'O progresso mudou em outra aba. Reabra o jogo para continuar dessa cópia.'};const next=pack(state);if(current){try{unpack(current);storage.setItem(KEY+'.previous',current);}catch{storage.setItem(KEY+'.damaged',current);}}storage.setItem(KEY,next);if(storage.getItem(KEY)!==next)throw Error();last=next;blocked=false;return {ok:true,savedAt:Date.now()};}catch{return {ok:false,message:'Não foi possível salvar no aparelho. Baixe uma cópia agora.'};}},
 previous(){const s=storage.getItem(KEY+'.previous');if(!s)throw Error('Ainda não há uma cópia anterior.');return unpack(s);},
 snapshot(){return last;}
 };
}
const ri=(a,b,rng)=>a+Math.floor(rng()*(b-a+1));
function question(mode='mix',level=1,rng=Math.random){
 const op=mode==='mix'?(rng()<.5?'mul':'div'):mode;
 let a,b,answer,remainder=0,prompt,hint;
 if(op==='mul'){a=ri(level===1?2:12,level===1?10:level===2?29:99,rng);b=ri(2,level===1?10:9,rng);answer=a*b;prompt=`${a} × ${b}`;hint=a<11?`Pense em ${b} grupos de ${a}. Você pode somar ${a} repetidamente.`:`Separe ${a} em ${Math.floor(a/10)*10} + ${a%10}. Multiplique cada parte por ${b} e some.`;}
 else {b=ri(2,level===1?5:9,rng);answer=ri(2,level===1?10:level===2?12:30,rng);if(level===3)remainder=ri(0,b-1,rng);a=b*answer+remainder;prompt=`${a} ÷ ${b}`;hint=`Procure o maior número de grupos de ${b} que cabe em ${a}. Use a tabuada de ${b}. O resto deve ser menor que ${b}.`;}
 const explanation=op==='mul'?`${a} × ${b} = ${answer}.`: `${b} × ${answer} = ${b*answer}${remainder?` e sobram ${remainder}`:''}.`;
 return {op,a,b,answer,remainder,prompt,hint,explanation};
}
const API={KEY,OLD,fresh,normalize,pack,unpack,repository,question};if(typeof module!=='undefined')module.exports=API;else root.PistachioState=API;
})(typeof globalThis!=='undefined'?globalThis:this);
