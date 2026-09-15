/* ============================================================
   jogo.js — lógica do jogo
   Lote 1: vibração, bloquear rotação, aceno, confete temático,
   letra em destaque
   ============================================================ */

const ANIMAIS = {
  gato:       { emoji:'🐱', nome:'Gato',       cor:'#F2A25C', escuro:'#D9833A', claro:'#FFD9B0', som:'Miau! Miau!',    tipo:'quadrupede', rabo:'longo' },
  cachorro:   { emoji:'🐶', nome:'Cachorro',   cor:'#C99A66', escuro:'#A87A48', claro:'#EBC9A3', som:'Au au! Au au!',  tipo:'quadrupede', rabo:'longo' },
  coelho:     { emoji:'🐰', nome:'Coelho',     cor:'#F0E8DF', escuro:'#B4A594', claro:'#FFFFFF', som:'Nhac nhac!',     tipo:'quadrupede', rabo:'curto' },
  passarinho: { emoji:'🐦', nome:'Passarinho', cor:'#7EC0E8', escuro:'#4A8FBC', claro:'#C8E8F8', som:'Piu piu!',       tipo:'ave' },
  peixinho:   { emoji:'🐠', nome:'Peixinho',   cor:'#FF8C6B', escuro:'#D5623F', claro:'#FFD1BE', som:'Glub glub!',     tipo:'peixe' },
  hamster:    { emoji:'🐹', nome:'Hamster',    cor:'#E2B878', escuro:'#B98E4D', claro:'#F8E4B8', som:'Iiii iiii!',     tipo:'quadrupede', rabo:'curto' },
  vaca:       { emoji:'🐮', nome:'Vaca',       cor:'#F3EEE4', escuro:'#4A4A4A', claro:'#FFFFFF', som:'Muuu! Muuu!',    tipo:'quadrupede', rabo:'longo' },
  porco:      { emoji:'🐷', nome:'Porco',      cor:'#F5A8C0', escuro:'#DE7F9E', claro:'#FFD3E0', som:'Oinc! Oinc!',    tipo:'quadrupede', rabo:'encaracolado' },
  ovelha:     { emoji:'🐑', nome:'Ovelha',     cor:'#F0EBE1', escuro:'#C4B9A5', claro:'#FFFFFF', som:'Bééé! Bééé!',    tipo:'quadrupede', rabo:'curto' },
  galinha:    { emoji:'🐔', nome:'Galinha',    cor:'#FFE9A8', escuro:'#D9B84A', claro:'#FFF5CC', som:'Có có! Có có!',  tipo:'ave' },
  cavalo:     { emoji:'🐴', nome:'Cavalo',     cor:'#B07A50', escuro:'#8A5A34', claro:'#D8B080', som:'Iii hiii!',      tipo:'quadrupede', rabo:'longo' },
  pato:       { emoji:'🦆', nome:'Pato',       cor:'#F5E64C', escuro:'#C8B420', claro:'#FFF5A0', som:'Quá quá!',       tipo:'ave' },
  leao:       { emoji:'🦁', nome:'Leão',       cor:'#E8B84B', escuro:'#C28F2A', claro:'#FFE6A8', som:'Roar!',          tipo:'quadrupede', rabo:'longo' },
  elefante:   { emoji:'🐘', nome:'Elefante',   cor:'#A0A4B0', escuro:'#70757F', claro:'#C8CCD6', som:'Fuummm!',        tipo:'quadrupede', rabo:'curto' },
  macaco:     { emoji:'🐵', nome:'Macaco',     cor:'#B08058', escuro:'#8A5F3C', claro:'#D8B088', som:'Uhu uhu ah ah!', tipo:'quadrupede', rabo:'longo' },
  tigre:      { emoji:'🐯', nome:'Tigre',      cor:'#F0A020', escuro:'#C77800', claro:'#FFD280', som:'Grrr!',          tipo:'quadrupede', rabo:'longo' },
  panda:      { emoji:'🐼', nome:'Panda',      cor:'#F8F8F8', escuro:'#444444', claro:'#FFFFFF', som:'Nhac nhac!',     tipo:'quadrupede', rabo:'curto' },
  sapo:       { emoji:'🐸', nome:'Sapo',       cor:'#7BC85C', escuro:'#5AA23C', claro:'#B6E89B', som:'Croac! Croac!',  tipo:'sapo' },
  golfinho:   { emoji:'🐬', nome:'Golfinho',   cor:'#88C8E8', escuro:'#5090B0', claro:'#C0E4F5', som:'Iii! Iii!',      tipo:'peixe' },
  baleia:     { emoji:'🐳', nome:'Baleia',     cor:'#6EB0D8', escuro:'#3D80A8', claro:'#A8D8F0', som:'Uuuuuu!',        tipo:'peixe' },
  pinguim:    { emoji:'🐧', nome:'Pinguim',    cor:'#3A3A3A', escuro:'#111111', claro:'#FFFFFF', som:'Nhonhonho!',     tipo:'ave' },
  tartaruga:  { emoji:'🐢', nome:'Tartaruga',  cor:'#7CB860', escuro:'#4A8A3A', claro:'#B0DC98', som:'Uuuu!',          tipo:'tartaruga' }
};
const TODOS = Object.keys(ANIMAIS);

const TEMAS = {
  casa:    { fundo:'linear-gradient(180deg,#c8e8ff 0%,#e0f0ff 42%,#d8f0b8 100%)', decor:[
              { e:'🏡', x:10, y:14, s:50 }, { e:'🌳', x:91, y:15, s:46 },
              { e:'🌷', x:7, y:90, s:30 }, { e:'🌻', x:94, y:90, s:34 },
              { e:'☀️', x:50, y:6, s:30 } ] },
  fazenda: { fundo:'linear-gradient(180deg,#bfe6ff 0%,#e0f0c8 42%,#b8e090 100%)', decor:[
              { e:'☀️', x:50, y:6, s:34 }, { e:'🌾', x:8, y:88, s:36 },
              { e:'🌾', x:92, y:88, s:36 }, { e:'🌻', x:10, y:14, s:32 },
              { e:'🚜', x:90, y:88, s:34 } ] },
  selva:   { fundo:'linear-gradient(180deg,#3a7a30 0%,#6aa85a 45%,#88c878 100%)', decor:[
              { e:'🌴', x:8, y:12, s:56 }, { e:'🌴', x:92, y:14, s:52 },
              { e:'🌿', x:5, y:88, s:38 }, { e:'🍃', x:95, y:88, s:34 },
              { e:'🐒', x:50, y:5, s:26 } ] },
  agua:    { fundo:'linear-gradient(180deg,#bce8ff 0%,#7ec8e8 45%,#3a90c0 100%)', decor:[
              { e:'🫧', x:10, y:12, s:32 }, { e:'🫧', x:88, y:18, s:26 },
              { e:'🌊', x:8, y:91, s:42 }, { e:'🌊', x:92, y:91, s:42 },
              { e:'🐚', x:50, y:93, s:26 } ] },
  rainbow: { fundo:'linear-gradient(180deg,#ffd0e8 0%,#fff0a8 45%,#d0e8ff 100%)', decor:[
              { e:'🌈', x:12, y:14, s:52 }, { e:'🎈', x:88, y:16, s:40 },
              { e:'⭐', x:8, y:88, s:28 }, { e:'✨', x:92, y:90, s:30 } ] },
  trofeu:  { fundo:'linear-gradient(180deg,#ffe9a8 0%,#ffd060 50%,#e8a020 100%)', decor:[
              { e:'🏆', x:10, y:14, s:48 }, { e:'👑', x:90, y:12, s:42 },
              { e:'⭐', x:8, y:90, s:28 }, { e:'🥇', x:92, y:90, s:32 },
              { e:'✨', x:50, y:6, s:24 } ] }
};

/* Confete temático por cenário */
const CONFETE_TEMA = {
  casa:    ['🏠','🌷','💛','🌻','⭐','✨'],
  fazenda: ['🌾','🌻','🚜','🍀','⭐','🐴'],
  selva:   ['🍃','🌿','🍂','🦋','⭐','🐒'],
  agua:    ['🫧','💧','🐚','🐠','⭐','🌊'],
  rainbow: ['🌈','✨','🎈','💖','⭐','🎉'],
  trofeu:  ['🏆','👑','🥇','✨','⭐','🎖️']
};

const FASES = [
  { tema:'Casa I',        visual:'casa',    emoji:'🏡', animais:['gato','cachorro','coelho','passarinho'],                        opcoes:3, acertos:4 },
  { tema:'Casa II',       visual:'casa',    emoji:'🏠', animais:['gato','cachorro','coelho','passarinho','peixinho','hamster'],  opcoes:3, acertos:4 },
  { tema:'Fazenda I',     visual:'fazenda', emoji:'🚜', animais:['vaca','porco','ovelha','galinha'],                             opcoes:3, acertos:5 },
  { tema:'Fazenda II',    visual:'fazenda', emoji:'🌾', animais:['vaca','porco','ovelha','galinha','cavalo','pato'],              opcoes:4, acertos:5 },
  { tema:'Selva',         visual:'selva',   emoji:'🌴', animais:['leao','elefante','macaco','tigre','panda'],                    opcoes:4, acertos:5 },
  { tema:'Água',          visual:'agua',    emoji:'🌊', animais:['sapo','golfinho','baleia','pinguim','tartaruga'],               opcoes:4, acertos:5 },
  { tema:'Tudo Junto!',   visual:'rainbow', emoji:'🌈', animais: TODOS,                                                         opcoes:4, acertos:6 },
  { tema:'Desafio Final', visual:'trofeu',  emoji:'🏆', animais: TODOS,                                                         opcoes:5, acertos:6 }
];

const POSICOES = {
  3: [{ x:14, y:42 }, { x:86, y:42 }, { x:50, y:86 }],
  4: [{ x:12, y:40 }, { x:88, y:40 }, { x:22, y:84 }, { x:78, y:84 }],
  5: [{ x:12, y:22 }, { x:88, y:22 }, { x:10, y:68 }, { x:90, y:68 }, { x:50, y:92 }]
};
const ALVO = { x:50, y:35 };

const STORAGE_KEY = 'cabecaAnimais.progresso.v1';
let progresso = { maxFase: 1, estrelas: {} };

function carregarProgresso(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw){
      const o = JSON.parse(raw);
      if (o && typeof o === 'object'){
        if (typeof o.maxFase === 'number') progresso.maxFase = o.maxFase;
        if (o.estrelas && typeof o.estrelas === 'object') progresso.estrelas = o.estrelas;
      }
    }
  }catch(e){}
  if (progresso.maxFase < 1) progresso.maxFase = 1;
  if (progresso.maxFase > FASES.length) progresso.maxFase = FASES.length;
}
function salvarProgresso(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(progresso)); }catch(e){}
}

const telaMenu = document.getElementById('telaMenu');
const telaMapa = document.getElementById('telaMapa');
const telaJogo = document.getElementById('telaJogo');
const gridFases= document.getElementById('gridFases');
const jogoTitulo = document.getElementById('jogoTitulo');
const stage     = document.getElementById('stage');
const decor     = document.getElementById('decor');
const headsEl   = document.getElementById('heads');
const bodyWrap  = document.getElementById('bodyWrap');
const toastEl   = document.getElementById('toast');
const nomeLabel = document.getElementById('nomeLabel');
const pipsEl    = document.getElementById('pips');
const overlay   = document.getElementById('overlay');
const btnSomMenu = document.getElementById('btnSomMenu');

let faseAtual = null;
let acertos = 0, erros = 0;
let atual = null, ultimoId = null, travado = false;

const rand = n => Math.floor(Math.random()*n);
function shuffle(a){ for (let i=a.length-1;i>0;i--){ const j=rand(i+1);[a[i],a[j]]=[a[j],a[i]];} return a; }
function mostrarTela(q){
  telaMenu.classList.toggle('hidden', q !== 'menu');
  telaMapa.classList.toggle('hidden', q !== 'mapa');
  telaJogo.classList.toggle('hidden', q !== 'jogo');
}

/* ---------- VIBRAÇÃO ---------- */
function vibrar(padrao){
  if (!('vibrate' in navigator)) return;
  try{ navigator.vibrate(padrao); }catch(e){}
}

/* ---------- BLOQUEAR ROTAÇÃO ---------- */
function tentarBloquearRotacao(){
  try{
    if (screen.orientation && screen.orientation.lock){
      screen.orientation.lock('portrait').catch(()=>{});
    }
  }catch(e){}
}

/* ---------- PRÉ-CARREGAR ---------- */
function preloadFase(){
  if (!faseAtual) return;
  faseAtual.config.animais.forEach(id => {
    new Image().src = `imagens/${id}_corpo.png`;
    new Image().src = `imagens/${id}_cabeca.png`;
  });
}
function preloadProximaFase(){
  const proxima = faseAtual ? faseAtual.index + 1 : 0;
  if (!FASES[proxima]) return;
  setTimeout(() => {
    FASES[proxima].animais.forEach(id => {
      new Image().src = `imagens/${id}_corpo.png`;
      new Image().src = `imagens/${id}_cabeca.png`;
    });
  }, 3000);
}

/* ---------- SVG FALLBACK ---------- */
function bodySVG(a){
  const t = a.tipo || 'quadrupede';
  if (t === 'ave')       return bodyAve(a);
  if (t === 'peixe')     return bodyPeixe(a);
  if (t === 'sapo')      return bodySapo(a);
  if (t === 'tartaruga') return bodyTartaruga(a);
  return bodyQuadrupede(a);
}
function bodyQuadrupede(a){
  const rabo = a.rabo || 'longo';
  let r;
  if (rabo === 'encaracolado'){
    r = `<path d="M95 50 q15 -4 15 -18 q0 -13 -11 -12 q-9 1 -7 9 q2 6 8 4" fill="none" stroke="${a.escuro}" stroke-width="6" stroke-linecap="round" opacity=".95"/>`;
  } else if (rabo === 'curto'){
    r = `<circle cx="100" cy="52" r="9" fill="${a.escuro}" opacity=".9"/><circle cx="100" cy="52" r="5" fill="${a.claro}" opacity=".5"/>`;
  } else {
    r = `<path d="M97 54 q20 -6 16 -26" fill="none" stroke="${a.escuro}" stroke-width="9" stroke-linecap="round" opacity=".9"/>`;
  }
  return `<svg viewBox="0 0 120 112" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="60" cy="101" rx="40" ry="6" fill="#000" opacity=".09"/>${r}
    <rect x="26" y="72" width="15" height="24" rx="7" fill="${a.escuro}"/>
    <rect x="46" y="76" width="15" height="20" rx="7" fill="${a.cor}"/>
    <rect x="66" y="76" width="15" height="20" rx="7" fill="${a.cor}"/>
    <rect x="84" y="72" width="15" height="24" rx="7" fill="${a.escuro}"/>
    <ellipse cx="60" cy="60" rx="45" ry="33" fill="${a.cor}" stroke="${a.escuro}" stroke-opacity=".35" stroke-width="3"/>
    <ellipse cx="60" cy="70" rx="28" ry="18" fill="${a.claro}" opacity=".5"/>
    <ellipse cx="60" cy="30" rx="17" ry="11" fill="${a.cor}" stroke="${a.escuro}" stroke-opacity=".35" stroke-width="3"/>
  </svg>`;
}
function bodyAve(a){
  return `<svg viewBox="0 0 120 112" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="60" cy="101" rx="32" ry="5" fill="#000" opacity=".09"/>
    <path d="M84 66 L104 56 L100 68 L106 78 L86 80 Z" fill="${a.escuro}" opacity=".9"/>
    <line x1="52" y1="88" x2="52" y2="99" stroke="#E8A030" stroke-width="4" stroke-linecap="round"/>
    <line x1="68" y1="88" x2="68" y2="99" stroke="#E8A030" stroke-width="4" stroke-linecap="round"/>
    <path d="M45 99 L52 99 L59 99" fill="none" stroke="#E8A030" stroke-width="3" stroke-linecap="round"/>
    <path d="M61 99 L68 99 L75 99" fill="none" stroke="#E8A030" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="58" cy="62" rx="35" ry="32" fill="${a.cor}" stroke="${a.escuro}" stroke-opacity=".35" stroke-width="3"/>
    <path d="M38 58 q16 -8 30 10 q-14 10 -30 -10 Z" fill="${a.claro}" opacity=".65"/>
    <path d="M42 62 q10 -2 18 8" fill="none" stroke="${a.escuro}" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="58" cy="72" rx="20" ry="14" fill="${a.claro}" opacity=".45"/>
    <ellipse cx="58" cy="30" rx="15" ry="10" fill="${a.cor}" stroke="${a.escuro}" stroke-opacity=".35" stroke-width="3"/>
  </svg>`;
}
function bodyPeixe(a){
  return `<svg viewBox="0 0 120 112" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="60" cy="99" rx="30" ry="5" fill="#000" opacity=".09"/>
    <path d="M94 62 L114 42 L112 62 L114 82 L94 66 Z" fill="${a.escuro}" opacity=".9"/>
    <path d="M48 30 L60 16 L74 30 Z" fill="${a.escuro}" opacity=".85"/>
    <ellipse cx="58" cy="62" rx="42" ry="28" fill="${a.cor}" stroke="${a.escuro}" stroke-opacity=".35" stroke-width="3"/>
    <ellipse cx="58" cy="72" rx="30" ry="14" fill="${a.claro}" opacity=".55"/>
    <path d="M42 66 q6 12 18 4 q-5 -10 -18 -4 Z" fill="${a.escuro}" opacity=".75"/>
    <ellipse cx="60" cy="30" rx="14" ry="10" fill="${a.cor}" stroke="${a.escuro}" stroke-opacity=".35" stroke-width="3"/>
  </svg>`;
}
function bodySapo(a){
  return `<svg viewBox="0 0 120 112" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="60" cy="101" rx="40" ry="6" fill="#000" opacity=".09"/>
    <ellipse cx="24" cy="80" rx="17" ry="13" fill="${a.escuro}" opacity=".9"/>
    <ellipse cx="96" cy="80" rx="17" ry="13" fill="${a.escuro}" opacity=".9"/>
    <path d="M12 92 q-1 8 6 8 M18 92 q0 8 7 8" fill="none" stroke="${a.escuro}" stroke-width="3" stroke-linecap="round"/>
    <path d="M95 92 q-1 8 7 8 M101 92 q0 8 7 8" fill="none" stroke="${a.escuro}" stroke-width="3" stroke-linecap="round"/>
    <rect x="42" y="82" width="9" height="14" rx="4.5" fill="${a.escuro}"/>
    <rect x="69" y="82" width="9" height="14" rx="4.5" fill="${a.escuro}"/>
    <ellipse cx="60" cy="68" rx="46" ry="30" fill="${a.cor}" stroke="${a.escuro}" stroke-opacity=".35" stroke-width="3"/>
    <ellipse cx="60" cy="78" rx="30" ry="14" fill="${a.claro}" opacity=".55"/>
    <ellipse cx="60" cy="38" rx="16" ry="10" fill="${a.cor}" stroke="${a.escuro}" stroke-opacity=".35" stroke-width="3"/>
  </svg>`;
}
function bodyTartaruga(a){
  return `<svg viewBox="0 0 120 112" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="60" cy="101" rx="40" ry="6" fill="#000" opacity=".09"/>
    <rect x="16" y="78" width="15" height="18" rx="7.5" fill="${a.escuro}"/>
    <rect x="42" y="86" width="15" height="14" rx="7.5" fill="${a.escuro}"/>
    <rect x="63" y="86" width="15" height="14" rx="7.5" fill="${a.escuro}"/>
    <rect x="89" y="78" width="15" height="18" rx="7.5" fill="${a.escuro}"/>
    <ellipse cx="60" cy="62" rx="48" ry="34" fill="${a.escuro}"/>
    <ellipse cx="60" cy="62" rx="42" ry="28" fill="${a.cor}" opacity=".85"/>
    <path d="M60 40 L60 84 M30 62 L90 62 M40 46 L80 78 M80 46 L40 78" stroke="${a.escuro}" stroke-width="2" opacity=".55" fill="none"/>
    <ellipse cx="60" cy="62" rx="12" ry="9" fill="${a.claro}" opacity=".55"/>
    <ellipse cx="60" cy="28" rx="14" ry="10" fill="${a.claro}" stroke="${a.escuro}" stroke-opacity=".35" stroke-width="3"/>
  </svg>`;
}

function aplicarTema(visual){
  const t = TEMAS[visual] || TEMAS.casa;
  const caminho = `fundos/${visual}.jpg`;

  stage.style.backgroundImage = t.fundo;
  decor.innerHTML = '';

  const img = new Image();
  img.onload = () => {
    stage.style.backgroundImage = `url('${caminho}')`;
    stage.style.backgroundSize = 'cover';
    stage.style.backgroundPosition = 'center';
    stage.style.backgroundRepeat = 'no-repeat';
    decor.innerHTML = '';
  };
  img.onerror = () => {
    stage.style.backgroundImage = t.fundo;
    stage.style.backgroundSize = '';
    stage.style.backgroundPosition = '';
    stage.style.backgroundRepeat = '';
    t.decor.forEach(d => {
      const el = document.createElement('span');
      el.className = 'decor-item';
      el.textContent = d.e;
      el.style.left = d.x + '%';
      el.style.top  = d.y + '%';
      el.style.fontSize = d.s + 'px';
      decor.appendChild(el);
    });
  };
  img.src = caminho;
}
function limparTema(){
  stage.style.backgroundImage = '';
  decor.innerHTML = '';
}

function ajustarUnidade(){
  const w = stage.clientWidth || 320;
  const n = faseAtual ? faseAtual.config.opcoes : 3;
  const fator = n >= 5 ? 0.18 : n === 4 ? 0.20 : 0.22;
  stage.style.setProperty('--hs', (w * fator) + 'px');
}
window.addEventListener('resize', ajustarUnidade);
window.addEventListener('orientationchange', () => setTimeout(ajustarUnidade, 120));

function atualizarIconeSom(){ btnSomMenu.textContent = somLigado ? '🔊' : '🔇'; }

function montarMapa(){
  gridFases.innerHTML = '';
  FASES.forEach((f, i) => {
    const num = i + 1;
    const liberada = num <= progresso.maxFase;
    const estrelas = progresso.estrelas[num] || 0;
    const btn = document.createElement('button');
    btn.className = 'fase-card' + (liberada ? '' : ' bloqueada');
    btn.type = 'button';

    if (liberada){
      let eHTML = '';
      for (let k=0;k<3;k++) eHTML += k < estrelas ? '⭐' : '<span class="vazia">⭐</span>';
      btn.innerHTML = `<div class="num">FASE ${num}</div><div class="emoji">${f.emoji}</div><div class="tema">${f.tema}</div><div class="estrelas">${eHTML}</div>`;
      btn.addEventListener('click', () => abrirFase(num));
    } else {
      btn.innerHTML = `<div class="num">FASE ${num}</div><div class="emoji">${f.emoji}</div><div class="tema">${f.tema}</div><div class="cadeado">🔒</div>`;
    }
    gridFases.appendChild(btn);
  });
}

function abrirFase(numero){
  const i = Math.max(0, Math.min(FASES.length-1, numero-1));
  faseAtual = { index: i, config: FASES[i] };

  const tema = TEMAS[faseAtual.config.visual] || TEMAS.casa;
  document.body.style.background = tema.fundo;

  jogoTitulo.textContent = `Fase ${numero} · ${faseAtual.config.tema}`;

  acertos = 0; erros = 0; ultimoId = null; atual = null; travado = false;

  pararAudio();
  overlay.classList.add('hidden');
  overlay.innerHTML = '';

  mostrarTela('jogo');
  aplicarTema(faseAtual.config.visual);

  requestAnimationFrame(() => {
    ajustarUnidade();
    iniciarRodada();
    preloadFase();
    preloadProximaFase();
  });
}

function atualizarPips(){
  const total = faseAtual ? faseAtual.config.acertos : 5;
  pipsEl.innerHTML = '';
  for (let i=0; i<total; i++){
    const s = document.createElement('span');
    s.className = 'pip' + (i < acertos ? ' done' : '');
    s.textContent = '🐾';
    pipsEl.appendChild(s);
  }
}

function iniciarRodada(){
  travado = false;
  headsEl.innerHTML = '';
  toastEl.classList.remove('show');
  nomeLabel.classList.remove('show');
  overlay.classList.add('hidden');
  overlay.innerHTML = '';
  bodyWrap.classList.remove('acenando');

  const lista = faseAtual.config.animais;
  const pool = lista.filter(id => id !== ultimoId);
  const idCorreto = pool[rand(pool.length)];
  atual = { id: idCorreto, ...ANIMAIS[idCorreto] };
  ultimoId = idCorreto;

  bodyWrap.innerHTML = '';
  const imgCorpo = new Image();
  imgCorpo.alt = '';
  imgCorpo.draggable = false;
  imgCorpo.onload = () => { bodyWrap.innerHTML = ''; bodyWrap.appendChild(imgCorpo); };
  imgCorpo.onerror = () => { bodyWrap.innerHTML = bodySVG(atual); };
  imgCorpo.src = `imagens/${atual.id}_corpo.png`;

  const outrosIds = shuffle(lista.filter(id => id !== idCorreto));
  const qtd = Math.min(faseAtual.config.opcoes, lista.length);
  const idsRodada = [idCorreto, ...outrosIds.slice(0, qtd-1)];
  shuffle(idsRodada);
  const posicoes = POSICOES[qtd] || POSICOES[3];

  idsRodada.forEach((id, i) => {
    const animal = { id, ...ANIMAIS[id] };
    const el = document.createElement('div');
    el.className = 'head';
    el.dataset.animal = id;
    el.dataset.bx = posicoes[i].x;
    el.dataset.by = posicoes[i].y;
    el.style.left = posicoes[i].x + '%';
    el.style.top  = posicoes[i].y + '%';
    el.style.setProperty('--s','0');
    el.style.opacity = '0';

    const inner = document.createElement('div');
    inner.className = 'head-inner';
    inner.textContent = animal.emoji;

    const imgC = new Image();
    imgC.alt = '';
    imgC.draggable = false;
    imgC.onload = () => { inner.textContent = ''; inner.appendChild(imgC); };
    imgC.src = `imagens/${animal.id}_cabeca.png`;

    el.appendChild(inner);
    headsEl.appendChild(el);
    ligarArraste(el, animal);

    setTimeout(() => {
      el.style.opacity = '1';
      el.style.setProperty('--s','1');
    }, 60 + i*90);
  });

  atualizarPips();
  ajustarUnidade();
}

function ligarArraste(el, animal){
  let arrastando = false, pid = null;
  let sx=0, sy=0, dx=0, dy=0;

  el.addEventListener('pointerdown', e => {
    if (travado) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    pid = e.pointerId;
    try{ el.setPointerCapture(pid); }catch(_){}
    arrastando = true;
    sx = e.clientX; sy = e.clientY;
    dx = 0; dy = 0;
    el.classList.add('dragging');
    el.style.transition = 'none';
  });

  el.addEventListener('pointermove', e => {
    if (!arrastando || e.pointerId !== pid) return;
    e.preventDefault();
    dx = e.clientX - sx;
    dy = e.clientY - sy;
    el.style.setProperty('--dx', dx + 'px');
    el.style.setProperty('--dy', dy + 'px');
  });

  function soltar(e){
    if (!arrastando || e.pointerId !== pid) return;
    arrastando = false; pid = null;
    el.classList.remove('dragging');
    el.style.transition = '';
    if (travado) return;

    const andou = Math.hypot(dx, dy);
    if (andou < 12){ escolher(el, animal); return; }

    const r  = el.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    const cx = r.left + r.width/2  - sr.left;
    const cy = r.top  + r.height/2 - sr.top;
    const alvoX = sr.width  * 0.5;
    const alvoY = sr.height * 0.52;
    if (Math.hypot(cx-alvoX, cy-alvoY) < sr.width * 0.32) escolher(el, animal);
    else voltarAoLugar(el);
  }

  el.addEventListener('pointerup', soltar);
  el.addEventListener('pointercancel', soltar);
}

function voltarAoLugar(el){
  el.style.setProperty('--dx','0px');
  el.style.setProperty('--dy','0px');
}

function escolher(el, animal){
  if (travado) return;
  travado = true;
  if (animal.id === atual.id) acertou(el);
  else errou(el);
}

function acertou(el){
  const sr = stage.getBoundingClientRect();
  const bx = parseFloat(el.dataset.bx)/100 * sr.width;
  const by = parseFloat(el.dataset.by)/100 * sr.height;
  const tx = sr.width  * (ALVO.x/100) - bx;
  const ty = sr.height * (ALVO.y/100) - by;

  el.style.transition = 'transform .42s cubic-bezier(.34,1.56,.64,1), opacity .3s';
  void el.offsetWidth;
  el.style.zIndex = '12';
  el.style.setProperty('--dx', tx+'px');
  el.style.setProperty('--dy', ty+'px');

  setTimeout(() => {
    const inner = el.querySelector('.head-inner');
    if (inner) inner.classList.add('encaixada');
  }, 380);

  /* bichinho acena ao receber a cabeça */
  setTimeout(() => {
    bodyWrap.classList.remove('acenando');
    void bodyWrap.offsetWidth;
    bodyWrap.classList.add('acenando');
    setTimeout(() => bodyWrap.classList.remove('acenando'), 800);
  }, 400);

  /* vibração de acerto (curta) */
  vibrar(35);

  [...headsEl.children].forEach(h => { if (h !== el) h.classList.add('esconder'); });

  explodir(sr.width * (ALVO.x/100), sr.height * (ALVO.y/100));
  tocarAcerto();

  /* etiqueta com letra em destaque: "G de GATO" */
  setTimeout(() => {
    const letra = atual.nome.charAt(0).toUpperCase();
    nomeLabel.innerHTML = `${atual.emoji} <span class="letra-destaque">${letra}</span> de ${atual.nome.toUpperCase()}`;
    nomeLabel.classList.remove('show');
    void nomeLabel.offsetWidth;
    nomeLabel.classList.add('show');
  }, 260);

  acertos++;
  atualizarPips();

  setTimeout(() => {
    falarNomeESom(atual.id, atual.nome, atual.som, () => {
      setTimeout(() => {
        if (acertos >= faseAtual.config.acertos) terminarFase();
        else iniciarRodada();
      }, 800);
    });
  }, 500);
}

function errou(el){
  erros++;
  tocarErro();
  vibrar([70, 50, 70]);   /* vibração dupla de erro */
  mostrarToast('Ops! Tente de novo! 🙈');
  voltarAoLugar(el);
  const inner = el.querySelector('.head-inner');
  inner.classList.add('shake');
  setTimeout(() => inner.classList.remove('shake'), 540);
  setTimeout(() => { travado = false; }, 700);
}

let toastTimer = null;
function mostrarToast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1700);
}

function explodir(x, y){
  const ic = ['⭐','✨','🌟','💫','⭐'];
  for (let i=0;i<9;i++){
    const s = document.createElement('span');
    s.className = 'spark';
    s.textContent = ic[rand(ic.length)];
    const ang = (Math.PI*2*i/9) + Math.random()*0.6;
    const d = 55 + Math.random()*70;
    s.style.left = x + 'px';
    s.style.top  = y + 'px';
    s.style.fontSize = (15 + Math.random()*16) + 'px';
    s.style.setProperty('--tx', (Math.cos(ang)*d).toFixed(1)+'px');
    s.style.setProperty('--ty', (Math.sin(ang)*d).toFixed(1)+'px');
    stage.appendChild(s);
    setTimeout(() => s.remove(), 900);
  }
}

/* Confete temático por cenário */
function soltarConfete(){
  const visual = faseAtual ? faseAtual.config.visual : 'casa';
  const ic = CONFETE_TEMA[visual] || CONFETE_TEMA.casa;
  for (let i=0;i<28;i++){
    setTimeout(() => {
      const s = document.createElement('span');
      s.className = 'confete';
      s.textContent = ic[rand(ic.length)];
      s.style.left = (Math.random()*96+2) + '%';
      s.style.fontSize = (14 + Math.random()*20) + 'px';
      s.style.animationDuration = (1.7 + Math.random()*1.3) + 's';
      stage.appendChild(s);
      setTimeout(() => s.remove(), 3400);
    }, i*70);
  }
}

function calcularEstrelas(e){ return e === 0 ? 3 : e <= 2 ? 2 : 1; }

function terminarFase(){
  const num = faseAtual.index + 1;
  const estrelas = calcularEstrelas(erros);

  const anterior = progresso.estrelas[num] || 0;
  if (estrelas > anterior) progresso.estrelas[num] = estrelas;
  if (num === progresso.maxFase && num < FASES.length) progresso.maxFase = num + 1;
  salvarProgresso();

  let eHTML = '';
  for (let k=0;k<3;k++) eHTML += k < estrelas ? '⭐' : '<span class="vazia">⭐</span>';

  const ultima = num === FASES.length;
  const btnProxima = !ultima ? `<button id="btnProxima">➡️ Próxima fase</button>` : '';
  const titulo = ultima ? '🎖️ Mestre dos Bichinhos!' : 'Parabéns!';
  const msg = ultima ? 'Você completou todas as fases!' : 'Você terminou a Fase ' + num + '!';

  overlay.innerHTML = `
    <div class="win-card">
      <div class="trofeu">${ultima ? '🏆' : '🎉'}</div>
      <h2>${titulo}</h2>
      <p>${msg}</p>
      <div class="estrelas-fim">${eHTML}</div>
      <div class="acoes">
        ${btnProxima}
        <button id="btnRepetir" class="sec">🔁 Jogar de novo</button>
        <button id="btnMenu" class="sec">🏠 Voltar ao menu</button>
      </div>
    </div>`;
  overlay.classList.remove('hidden');

  tocarFanfarra();
  vibrar([60, 40, 60, 40, 120]);
  setTimeout(() => {
    falar(ultima ? 'Parabéns! Você virou Mestre dos Bichinhos!' : 'Parabéns! Você completou a fase!');
  }, 700);
  soltarConfete();

  const bp = document.getElementById('btnProxima');
  if (bp) bp.addEventListener('click', () => abrirFase(num + 1));
  document.getElementById('btnRepetir').addEventListener('click', () => abrirFase(num));
  document.getElementById('btnMenu').addEventListener('click', voltarAoMenu);
}

function voltarAoMenu(){
  pararAudio();
  overlay.classList.add('hidden');
  overlay.innerHTML = '';
  document.body.style.background = 'linear-gradient(180deg,#a9e4ff 0%,#cdefff 42%,#d7f5c4 100%)';
  limparTema();
  mostrarTela('menu');
}
function abrirMapa(){
  pararAudio();
  document.body.style.background = 'linear-gradient(180deg,#a9e4ff 0%,#cdefff 42%,#d7f5c4 100%)';
  montarMapa();
  mostrarTela('mapa');
}
function comecarJogo(){
  pegarCtx();
  if (!estaTelaCheia()) entrarTelaCheia();
  tentarBloquearRotacao();
  abrirFase(Math.min(progresso.maxFase, FASES.length));
}

document.getElementById('btnJogar').addEventListener('click', comecarJogo);
document.getElementById('btnEscolher').addEventListener('click', abrirMapa);
document.getElementById('btnMapaVoltar').addEventListener('click', voltarAoMenu);
document.getElementById('btnJogoVoltar').addEventListener('click', voltarAoMenu);
document.getElementById('btnReiniciarFase').addEventListener('click', () => {
  if (faseAtual) abrirFase(faseAtual.index + 1);
});
btnSomMenu.addEventListener('click', () => {
  alternarSom();
  atualizarIconeSom();
});
document.getElementById('btnZerar').addEventListener('click', () => {
  if (confirm('Apagar todo o progresso e começar do zero?')){
    progresso = { maxFase: 1, estrelas: {} };
    salvarProgresso();
    montarMapa();
    mostrarToast('Progresso apagado!');
  }
});

/* ---------- TELA CHEIA ---------- */
function estaTelaCheia(){
  return !!(document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement);
}
function entrarTelaCheia(){
  const el = document.documentElement;
  const req = el.requestFullscreen ||
              el.webkitRequestFullscreen ||
              el.msRequestFullscreen;
  if (req){
    try{
      const p = req.call(el);
      if (p && p.catch) p.catch(()=>{});
    }catch(e){}
    setTimeout(tentarBloquearRotacao, 300);
  }
}
function sairTelaCheia(){
  const exit = document.exitFullscreen ||
               document.webkitExitFullscreen ||
               document.msExitFullscreen;
  if (exit){
    try{
      const p = exit.call(document);
      if (p && p.catch) p.catch(()=>{});
    }catch(e){}
  }
}
function alternarTelaCheia(){
  if (estaTelaCheia()) sairTelaCheia();
  else entrarTelaCheia();
}
function atualizarIconeTelaCheia(){
  const btn = document.getElementById('btnTelaCheia');
  if (btn) btn.textContent = estaTelaCheia() ? '🗗' : '⛶';
}

const suportaTelaCheia = !!(
  document.documentElement.requestFullscreen ||
  document.documentElement.webkitRequestFullscreen
);
if (!suportaTelaCheia){
  const b = document.getElementById('btnTelaCheia');
  if (b) b.style.display = 'none';
}
['fullscreenchange','webkitfullscreenchange','msfullscreenchange']
  .forEach(ev => document.addEventListener(ev, atualizarIconeTelaCheia));
const btnTC = document.getElementById('btnTelaCheia');
if (btnTC) btnTC.addEventListener('click', alternarTelaCheia);

/* ---------- INÍCIO ---------- */
carregarProgresso();
atualizarIconeSom();
mostrarTela('menu');
window.addEventListener('load', () => setTimeout(ajustarUnidade, 60));