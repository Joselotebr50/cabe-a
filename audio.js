/* ============================================================
   audio.js — som, voz e trilha sonora
   ============================================================ */

let somLigado = true;
let ctxAudio  = null;

/* ---------- MOTOR DE ÁUDIO ---------- */
function pegarCtx(){
  if (!ctxAudio){
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctxAudio = new AC();
  }
  if (ctxAudio.state === 'suspended') ctxAudio.resume();
  return ctxAudio;
}
function nota(freq, inicio, dur, tipo='triangle', vol=0.16){
  if (!somLigado) return;
  const c = pegarCtx(); if (!c) return;
  const t0 = c.currentTime + inicio;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = tipo;
  o.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(c.destination);
  o.start(t0); o.stop(t0 + dur + 0.06);
}

/* ---------- EFEITOS ---------- */
function tocarAcerto(){
  nota(523.25, 0.00, 0.18);
  nota(659.25, 0.11, 0.18);
  nota(783.99, 0.22, 0.34);
}
function tocarErro(){
  nota(294, 0.00, 0.20, 'triangle', 0.13);
  nota(220, 0.17, 0.30, 'triangle', 0.13);
}
function tocarFanfarra(){
  nota(523.25, 0.00, 0.15);
  nota(659.25, 0.13, 0.15);
  nota(783.99, 0.26, 0.15);
  nota(1046.5, 0.40, 0.45);
}

/* ============================================================
   TRILHA SONORA — arpejo suave em pentatônica de C
   ============================================================ */
let musicaGanho  = null;
let musicaTimer  = null;
let musicaAtiva  = false;

const MELODIA = [
  [523.25, 0.0], [659.25, 0.5], [783.99, 1.0], [659.25, 1.5],
  [587.33, 2.0], [698.46, 2.5], [880.00, 3.0], [698.46, 3.5],
  [493.88, 4.0], [587.33, 4.5], [698.46, 5.0], [587.33, 5.5],
  [440.00, 6.0], [523.25, 6.5], [659.25, 7.0], [523.25, 7.5]
];
const LOOP_DUR = 8.0;   /* segundos */

function tocarMusicaVolta(tInicio){
  if (!somLigado || !musicaAtiva) return;
  const c = pegarCtx(); if (!c) return;

  MELODIA.forEach(([freq, offset]) => {
    const t = tInicio + offset;
    if (t < c.currentTime) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(1, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
    o.connect(g);
    if (musicaGanho) g.connect(musicaGanho);
    o.start(t);
    o.stop(t + 1.5);
  });

  const proximo = tInicio + LOOP_DUR;
  const atraso  = (proximo - c.currentTime - 0.4) * 1000;
  musicaTimer = setTimeout(() => tocarMusicaVolta(proximo), Math.max(500, atraso));
}

function iniciarMusica(){
  if (!somLigado || musicaAtiva) return;
  const c = pegarCtx(); if (!c) return;

  musicaGanho = c.createGain();
  musicaGanho.gain.value = 0.030;   /* bem suave, ao fundo */
  musicaGanho.connect(c.destination);

  musicaAtiva = true;
  tocarMusicaVolta(c.currentTime + 0.2);
}

function pararMusica(){
  musicaAtiva = false;
  if (musicaTimer){
    clearTimeout(musicaTimer);
    musicaTimer = null;
  }
  if (musicaGanho){
    try{
      const c = pegarCtx();
      if (c) musicaGanho.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.25);
    }catch(e){}
    const ref = musicaGanho;
    musicaGanho = null;
    setTimeout(() => { try{ ref.disconnect(); }catch(e){} }, 400);
  }
}

/* ---------- VOZ (TTS) ---------- */
function prepararVozes(){
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {};
}
function acharVozBR(){
  const vozes = window.speechSynthesis.getVoices() || [];
  return vozes.find(v => /pt[-_]?BR/i.test(v.lang))
      || vozes.find(v => /^pt/i.test(v.lang)) || null;
}
function criarFala(texto, pitch=1.05, rate=0.85){
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = 'pt-BR';
  u.rate = rate; u.pitch = pitch; u.volume = 1;
  const v = acharVozBR();
  if (v) u.voice = v;
  return u;
}
function falar(texto){
  if (!somLigado || !('speechSynthesis' in window)) return;
  try{
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(criarFala(texto));
  }catch(e){}
}
function ttsNomeESom(nome, som, callback){
  if (!('speechSynthesis' in window)){
    if (callback) setTimeout(callback, 400);
    return;
  }
  try{
    window.speechSynthesis.cancel();
    const falaNome = criarFala(nome + '!', 1.05, 0.85);
    const falaSom  = criarFala(som,         1.15, 0.85);

    let terminou = false;
    const finalizar = () => {
      if (terminou) return;
      terminou = true;
      if (callback) callback();
    };

    falaSom.onend = finalizar;
    setTimeout(finalizar, 6000);

    window.speechSynthesis.speak(falaNome);
    window.speechSynthesis.speak(falaSom);
  }catch(e){
    if (callback) setTimeout(callback, 400);
  }
}

function falarNomeESom(idAnimal, nome, som, callback){
  if (!somLigado){
    if (callback) setTimeout(callback, 500);
    return;
  }

  const audio = new Audio();
  let terminado = false;
  let caindoTTS = false;

  const finalizar = () => {
    if (terminado) return;
    terminado = true;
    if (callback) callback();
  };
  const cairParaTTS = () => {
    if (terminado || caindoTTS) return;
    caindoTTS = true;
    ttsNomeESom(nome, som, finalizar);
  };

  audio.addEventListener('ended', finalizar, { once: true });
  audio.addEventListener('error', cairParaTTS, { once: true });

  audio.src = `audios/${idAnimal}.mp3`;
  audio.play().catch(cairParaTTS);

  setTimeout(finalizar, 8000);
}

/* ---------- PARAR / ALTERNAR ---------- */
function pararAudio(){
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}
function alternarSom(){
  somLigado = !somLigado;
  if (!somLigado){
    pararAudio();
    pararMusica();
  } else {
    iniciarMusica();
  }
  return somLigado;
}

prepararVozes();