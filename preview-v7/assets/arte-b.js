/* Arte B aprovada: recortes de atlas PNG com alfa real. */
const PISTACHIO_ASSETS = {"chapeu-1": {"sheet": "catalogo", "x": 0, "y": 0, "w": 229, "h": 240}, "chapeu-2": {"sheet": "catalogo", "x": 229, "y": 0, "w": 229, "h": 240}, "chapeu-3": {"sheet": "catalogo", "x": 458, "y": 0, "w": 229, "h": 240}, "chapeu-4": {"sheet": "catalogo", "x": 687, "y": 0, "w": 229, "h": 240}, "chapeu-5": {"sheet": "catalogo", "x": 916, "y": 0, "w": 229, "h": 240}, "oculos-1": {"sheet": "catalogo", "x": 0, "y": 250, "w": 229, "h": 175}, "oculos-2": {"sheet": "catalogo", "x": 229, "y": 250, "w": 229, "h": 175}, "oculos-3": {"sheet": "catalogo", "x": 458, "y": 250, "w": 229, "h": 175}, "oculos-4": {"sheet": "catalogo", "x": 687, "y": 250, "w": 229, "h": 175}, "oculos-5": {"sheet": "catalogo", "x": 916, "y": 250, "w": 229, "h": 175}, "maca-1": {"sheet": "catalogo", "x": 0, "y": 435, "w": 229, "h": 222}, "maca-2": {"sheet": "catalogo", "x": 229, "y": 435, "w": 229, "h": 222}, "maca-3": {"sheet": "catalogo", "x": 458, "y": 435, "w": 229, "h": 222}, "maca-4": {"sheet": "catalogo", "x": 687, "y": 435, "w": 229, "h": 222}, "maca-5": {"sheet": "catalogo", "x": 916, "y": 435, "w": 229, "h": 222}, "banana-1": {"sheet": "catalogo", "x": 0, "y": 660, "w": 229, "h": 234}, "banana-2": {"sheet": "catalogo", "x": 229, "y": 660, "w": 229, "h": 234}, "banana-3": {"sheet": "catalogo", "x": 458, "y": 660, "w": 229, "h": 234}, "banana-4": {"sheet": "catalogo", "x": 687, "y": 660, "w": 229, "h": 234}, "banana-5": {"sheet": "catalogo", "x": 916, "y": 660, "w": 229, "h": 234}, "cookie-1": {"sheet": "catalogo", "x": 0, "y": 899, "w": 229, "h": 201}, "cookie-2": {"sheet": "catalogo", "x": 229, "y": 899, "w": 229, "h": 201}, "cookie-3": {"sheet": "catalogo", "x": 458, "y": 899, "w": 229, "h": 201}, "cookie-4": {"sheet": "catalogo", "x": 687, "y": 899, "w": 229, "h": 201}, "cookie-5": {"sheet": "catalogo", "x": 916, "y": 899, "w": 229, "h": 201}, "flor-1": {"sheet": "catalogo", "x": 0, "y": 1105, "w": 229, "h": 269}, "flor-2": {"sheet": "catalogo", "x": 229, "y": 1105, "w": 229, "h": 269}, "flor-3": {"sheet": "catalogo", "x": 458, "y": 1105, "w": 229, "h": 269}, "flor-4": {"sheet": "catalogo", "x": 687, "y": 1105, "w": 229, "h": 269}, "flor-5": {"sheet": "catalogo", "x": 916, "y": 1105, "w": 229, "h": 269}, "cenoura": {"sheet": "cuidados", "x": 0, "y": 0, "w": 362, "h": 362}, "morango": {"sheet": "cuidados", "x": 362, "y": 0, "w": 362, "h": 362}, "bolinho": {"sheet": "cuidados", "x": 724, "y": 0, "w": 362, "h": 362}, "sorvete": {"sheet": "cuidados", "x": 1086, "y": 0, "w": 362, "h": 362}, "laco": {"sheet": "cuidados", "x": 0, "y": 362, "w": 362, "h": 362}, "cachecol": {"sheet": "cuidados", "x": 362, "y": 362, "w": 362, "h": 362}, "coroa": {"sheet": "cuidados", "x": 724, "y": 362, "w": 362, "h": 362}, "formatura": {"sheet": "cuidados", "x": 1086, "y": 362, "w": 362, "h": 362}, "borboleta": {"sheet": "cuidados", "x": 0, "y": 724, "w": 362, "h": 362}, "estrela": {"sheet": "cuidados", "x": 362, "y": 724, "w": 362, "h": 362}, "sabao": {"sheet": "cuidados", "x": 724, "y": 724, "w": 362, "h": 362}, "esponja": {"sheet": "cuidados", "x": 1086, "y": 724, "w": 362, "h": 362}};
function arteItem(key, nome){
  const frame = PISTACHIO_ASSETS[key];
  const el = document.createElement('span');
  if(!frame) { el.textContent = nome || ''; return el; }
  el.className = 'arte-item';
  el.dataset.asset = key;
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', nome || key);
  const dims = frame.sheet === 'catalogo' ? [1145,1374] : frame.sheet === 'moveis' ? [1536,1024] : [1448,1086];
  const size = Math.max(frame.w,frame.h);
  const windowEl = document.createElement('span');
  windowEl.className = 'arte-recorte';
  windowEl.style.cssText = 'width:'+100*frame.w/size+'%;height:'+100*frame.h/size+'%;';
  const img = document.createElement('img');
  img.src = './assets/estilo-b-'+frame.sheet+'.png';
  img.alt = ''; img.draggable = false;
  img.style.cssText = 'width:'+100*dims[0]/frame.w+'%;height:'+100*dims[1]/frame.h+'%;left:'+(-100*frame.x/frame.w)+'%;top:'+(-100*frame.y/frame.h)+'%;';
  windowEl.appendChild(img); el.appendChild(windowEl); return el;
}

['almofada','poltrona','estante','planta','mesa','luminaria'].forEach((key,i)=>PISTACHIO_ASSETS[key]={sheet:'moveis',x:(i%3)*512,y:Math.floor(i/3)*512,w:512,h:512});
