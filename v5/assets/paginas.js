/* Fit content into explicit app pages. Nodes are moved, never cloned, preserving controls. */
(()=>{
const info=new WeakMap();let queued=false;
function splitChildren(node){
 const classes=['products','tiles','places','badge-list','collection-grid','stats-grid','ingredient-grid'];
 const match=classes.find(c=>node.classList?.contains(c));
 if(match){const children=[...node.children],size=['products','tiles','ingredient-grid'].includes(match)?2:match==='collection-grid'||match==='stats-grid'?3:1;const rows=[];for(let i=0;i<children.length;i+=size){const row=document.createElement('div');row.className=node.className+' page-row';children.slice(i,i+size).forEach(c=>row.appendChild(c));rows.push(row);}if(node.id&&rows[0])rows[0].id=node.id;return rows;}
 if(node.id==='collection-content'||node.id==='saved-looks'){const id=node.id,items=[...node.children].flatMap(splitChildren);if(items[0])items[0].dataset.section=id;return items;}
 return [node];
}
function paginate(root){
 if(!root||root.clientHeight<100)return;
 if(root.id==='main'&&document.body.dataset.tab==='casa'){info.delete(root);return;}
 const previous=info.get(root),existing=root.querySelector(':scope > .page-shell');
 let nodes,index=previous?.index||0;
 if(existing){nodes=[...existing.querySelectorAll(':scope > .app-page')].flatMap(p=>[...p.children]);}
 else {nodes=[...root.children].flatMap(splitChildren);index=0;}
 // Named dynamic game content stays intact; split only catalogue containers.
 const shell=document.createElement('div');shell.className='page-shell';
 const nav=document.createElement('div');nav.className='page-nav';nav.setAttribute('aria-label','Páginas desta tela');
 root.replaceChildren(shell,nav);
 const height=root.clientHeight-54;let page;
 function next(){page=document.createElement('section');page.className='app-page';shell.appendChild(page);return page;}
 next();
 for(const node of nodes){page.appendChild(node);if(page.scrollHeight>height+2&&page.children.length>1){page.removeChild(node);next().appendChild(node);}if(page.scrollHeight>height+2){page.classList.add('dense-page');}}
 const pages=[...shell.children];index=Math.max(0,Math.min(index,pages.length-1));
 const prev=document.createElement('button'),label=document.createElement('span'),nextBtn=document.createElement('button');prev.textContent='Anterior';nextBtn.textContent='Próxima';nav.append(prev,label,nextBtn);
 function choose(i,focus=false){index=i;pages.forEach((p,n)=>{p.hidden=n!==index;});prev.disabled=index===0;nextBtn.disabled=index===pages.length-1;label.textContent=`${index+1} / ${pages.length}`;info.set(root,{index});if(focus){pages[index].setAttribute('tabindex','-1');pages[index].focus({preventScroll:true});}}
 prev.onclick=()=>choose(index-1,true);nextBtn.onclick=()=>choose(index+1,true);choose(index);nav.hidden=pages.length===1;
 if(pages.length===1)shell.classList.add('single-page');
}
const observer=new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes,...r.removedNodes].some(n=>n.nodeType===1)))schedule();});
function observe(){for(const id of ['main','sheet-body']){const el=document.getElementById(id);if(el)observer.observe(el,{childList:true,subtree:true});}}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;observer.disconnect();for(const id of ['main','sheet-body'])paginate(document.getElementById(id));observe();});}
function height(){const h=window.visualViewport?.height||window.innerHeight;document.documentElement.style.setProperty('--app-height',h+'px');schedule();}
window.addEventListener('resize',height);window.visualViewport?.addEventListener('resize',height);
document.addEventListener('DOMContentLoaded',()=>{observe();height();});
})();
