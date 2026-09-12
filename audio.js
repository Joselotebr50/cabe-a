/* ============================================================
   audio.js — todo o som do jogo
   ============================================================

   ARQUIVOS DE VOZ (opcional, para você subir depois):
     audios/{idAnimal}.mp3

   Exemplo:
     audios/gato.mp3      → "Gato! Miau!"
     audios/cachorro.mp3  → "Cachorro! Au au!"
     audios/vaca.mp3      → "Vaca! Muuu!"

   Se o MP3 não existir, cai automaticamente para a voz
   do navegador (TTS em pt-BR).
   ============================================================ */

let somLigado = true;
let ctxAudio  = null;

/* ---------- MOTOR DE ÁUDIO (jingles) ---------- */
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

/* ---------- EFEITOS SONOROS ---------- */
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

/* fala simples (só um texto) */
function falar(texto){
  if (!somLigado || !('speechSynthesis' in window)) return;
  try{
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(criarFala(texto));
  }catch(e){}
}

/* TTS: nome + som, chama callback quando TERMINAR */
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
    // segurança: se por algum motivo não disparar onend, libera em 6s
    setTimeout(finalizar, 6000);

    window.speechSynthesis.speak(falaNome);
    window.speechSynthesis.speak(falaSom);
  }catch(e){
    if (callback) setTimeout(callback, 400);
  }
}

/* ============================================================
   FUNÇÃO PRINCIPAL — fala o nome + som, chama callback no fim
   ------------------------------------------------------------
   Estratégia:
     1. Tenta tocar audios/{id}.mp3
     2. Se não existir (404) → cai para TTS
     3. Quando QUALQUER UM terminar → chama callback
   ============================================================ */
function falarNomeESom(idAnimal, nome, som, callback){
  /* som desligado: só espera um pouco e segue */
  if (!somLigado){
    if (callback) setTimeout(callback, 500);
    return;
  }

  const audio = new Audio();
  let terminado = false;   /* já chamamos o callback? */
  let caindoTTS = false;   /* já estamos no fallback? */

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

  /* rede de segurança: nunca trava mais de 8s */
  setTimeout(finalizar, 8000);
}

/* ---------- PARAR TUDO ---------- */
function pararAudio(){
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

/* ---------- LIGA / DESLIGA ---------- */
function alternarSom(){
  somLigado = !somLigado;
  if (!somLigado) pararAudio();
  return somLigado;
}

prepararVozes();