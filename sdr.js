/* ================= RECEPTOARE WEB (KiwiSDR / WebSDR) =================
   Comun pentru desktop + mobil. Un canal din channels.js cu `rx:[...]` nu folosește
   LiveATC, ci receptoarele definite în RADIO_CONFIG.receivers:
     - type:'kiwi'   → audio direct în radio (WebSocket, protocolul KiwiSDR / Web-888);
     - type:'websdr' → doar „deschide în tab” (websdr.org nu permite redare externă).
   O pagină https (ex. GitHub Pages) NU poate deschide ws:// spre un receptor http –
   în cazul ăsta radioul arată butonul ▶ WEB SDR, care deschide receptorul într-un tab nou. */
(() => {
const CFG = window.RADIO_CONFIG || {};
const RX  = CFG.receivers || {};
const IDENT = (CFG.brand || 'LROP') + '-radio';

const PASSBAND = { USB:[300,2700], LSB:[-2700,-300], AM:[-4900,4900], FM:[-6000,6000] };
const KIWI_MOD = { USB:'usb', LSB:'lsb', AM:'am', FM:'nbfm' };

const list = ch => (ch && ch.rx || []).map(k => RX[k] && Object.assign({key:k}, RX[k])).filter(Boolean);
const isSecurePage = () => location.protocol === 'https:';
const playable = r => r.type === 'kiwi' && !(isSecurePage() && /^http:/i.test(r.url));
const base = r => r.url.replace(/\/+$/, '');

/* link pentru tab nou, deja acordat pe frecvență */
function openUrl(ch, r){
  const all = list(ch);
  r = r || all.find(x => x.type === 'websdr') || all[0];
  if(!r) return null;
  const m = (ch.mode || 'USB').toLowerCase();
  return r.type === 'kiwi' ? `${base(r)}/?f=${ch.f}${m}z10` : `${base(r)}/?tune=${ch.f}${m}`;
}

/* dBm → poziție pe S-metru (0..1), pentru o scară cu S9 la indexul s9 și +60 la p60 */
function meter(dbm, s9, p60, n){
  if(dbm == null || !isFinite(dbm)) return 0;
  const idx = dbm <= -73 ? Math.max(0, (dbm + 127) / 6 - 1) * (s9 / 8)
                         : s9 + (dbm + 73) / 60 * (p60 - s9);
  return Math.max(0, Math.min(1, (idx + 1) / n));
}

/* IMA ADPCM (folosit doar dacă receptorul trimite totuși audio comprimat) */
const STEP = [7,8,9,10,11,12,13,14,16,17,19,21,23,25,28,31,34,37,41,45,50,55,60,66,73,80,88,97,107,118,130,143,
  157,173,190,209,230,253,279,307,337,371,408,449,494,544,598,658,724,796,876,963,1060,1166,1282,1411,1552,1707,
  1878,2066,2272,2499,2749,3024,3327,3660,4026,4428,4871,5358,5894,6484,7132,7845,8630,9493,10442,11487,12635,
  13899,15289,16818,18500,20350,22385,24623,27086,29794,32767];
const IDX = [-1,-1,-1,-1,2,4,6,8,-1,-1,-1,-1,2,4,6,8];

class KiwiPlayer {
  constructor(){ this.ctx=null; this.gain=null; this.ws=null; this.token=0; this.state='OFF'; this.rx=null; this.dbm=null; }
  attach(ctx){
    if(!ctx || this.ctx === ctx) return;
    this.ctx = ctx; this.gain = ctx.createGain(); this.gain.gain.value = 0; this.gain.connect(ctx.destination);
  }
  setVolume(v){ if(this.gain) this.gain.gain.setTargetAtTime(Math.max(0, v), this.ctx.currentTime, .03); }
  start(ch, onState){
    this.stop();
    const tok = ++this.token;
    this.ch = ch; this.onState = onState; this.retries = 0; this.lastErr = null;
    if(!this.ctx){ this._set('NO AUDIO', tok); return; }
    this.queue = list(ch).filter(playable);
    if(!this.queue.length){ this._set('WEB ONLY', tok); return; }
    this._next(tok);
  }
  stop(){
    this.token++;
    clearTimeout(this.timer); clearTimeout(this.retryT); clearInterval(this.kaT);
    if(this.ws){ try{ this.ws.onclose = this.ws.onmessage = this.ws.onerror = null; this.ws.close(); }catch(e){} }
    this.ws = null; this.rx = null; this.dbm = null; this.state = 'OFF';
    this.setVolume(0);
  }
  get live(){ return this.state === 'LIVE'; }

  _set(st, tok){ if(tok !== this.token) return; this.state = st; if(this.onState) this.onState(st); }
  _next(tok){
    if(tok !== this.token) return;
    const r = this.queue.shift();
    if(!r){ this.rx = null; this._set(this.lastErr || 'NO RX', tok); return; }
    this._open(r, tok);
  }
  _fail(tok, why){
    if(tok !== this.token) return;
    clearTimeout(this.timer); clearInterval(this.kaT);
    if(this.ws){ try{ this.ws.onclose = this.ws.onmessage = null; this.ws.close(); }catch(e){} this.ws = null; }
    this.lastErr = why;
    this._next(tok);
  }
  _send(s){ try{ if(this.ws && this.ws.readyState === 1) this.ws.send(s); }catch(e){} }
  _open(r, tok){
    this.rx = r; this.rate = 12000; this.foff = 0; this.got = false; this.nextT = 0;
    this.adpcm = {i:0, p:0}; this.lastKa = 0;
    this._set('CONNECT', tok);
    let ws;
    try{
      const u = new URL(r.url);
      const path = u.pathname.replace(/\/+$/, '');
      ws = new WebSocket(`${u.protocol === 'https:' ? 'wss:' : 'ws:'}//${u.host}${path}/${Date.now()}/SND`);
    }catch(e){ return this._fail(tok, 'BLOCKED'); }
    this.ws = ws; ws.binaryType = 'arraybuffer';
    this.timer = setTimeout(() => { if(!this.got) this._fail(tok, 'TIMEOUT'); }, 9000);
    ws.onopen = () => { this._send('SET auth t=kiwi p='); this.kaT = setInterval(() => this._send('SET keepalive'), 5000); };
    ws.onmessage = e => { if(tok === this.token) this._msg(e.data, tok); };
    ws.onerror = () => {};
    ws.onclose = () => {
      if(tok !== this.token) return;
      clearInterval(this.kaT);
      if(this.got && this.retries < 3){            // a mers, apoi a căzut → reîncearcă același receptor
        this.retries++; this.ws = null; this._set('NO LINK', tok);
        this.retryT = setTimeout(() => { if(tok === this.token) this._open(r, tok); }, 3000);
      } else this._fail(tok, 'NO LINK');
    };
  }
  _msg(data, tok){
    const b = typeof data === 'string' ? new TextEncoder().encode(data) : new Uint8Array(data);
    const tag = String.fromCharCode(b[0], b[1], b[2]);
    if(tag === 'MSG'){
      const txt = new TextDecoder().decode(b.subarray(4));
      for(const pair of txt.split(' ')){
        const i = pair.indexOf('='), k = i < 0 ? pair : pair.slice(0, i), v = i < 0 ? null : pair.slice(i + 1);
        if(k === 'too_busy') return this._fail(tok, 'BUSY');
        if(k === 'badp' && v !== '0') return this._fail(tok, 'BUSY');
        if(k === 'down' || k === 'redirect') return this._fail(tok, 'DOWN');
        if(k === 'freq_offset') this.foff = parseFloat(v) || 0;
        if(k === 'audio_rate') this._send(`SET AR OK in=${v} out=48000`);
        if(k === 'sample_rate'){ this.rate = parseFloat(v) || 12000; this._setup(); }
      }
    } else if(tag === 'SND'){
      this._snd(b.subarray(3), tok);
    }
  }
  _setup(){
    const m = (this.ch.mode || 'USB').toUpperCase();
    const [lo, hi] = PASSBAND[m] || PASSBAND.USB;
    this._send(`SET ident_user=${IDENT}`);
    this._send(`SET mod=${KIWI_MOD[m] || 'usb'} low_cut=${lo} high_cut=${hi} freq=${(this.ch.f - this.foff).toFixed(3)}`);
    this._send('SET agc=1 hang=0 thresh=-100 slope=6 decay=1000 manGain=50');
    this._send('SET squelch=0 max=0');
    this._send('SET compression=0');
    this._send('SET keepalive');
  }
  _snd(body, tok){
    if(body.length < 8) return;
    const flags = body[0];
    const dbm = 0.1 * ((body[5] << 8) | body[6]) - 127;
    const data = body.subarray(7);
    let pcm;
    if(flags & 0x10){                                   // ADPCM
      pcm = new Float32Array(data.length * 2);
      let {i, p} = this.adpcm, o = 0;
      for(const byte of data){
        for(const code of [byte & 15, byte >> 4]){
          const st = STEP[i]; let d = st >> 3;
          if(code & 1) d += st >> 2; if(code & 2) d += st >> 1; if(code & 4) d += st; if(code & 8) d = -d;
          p = Math.max(-32768, Math.min(32767, p + d)); i = Math.max(0, Math.min(88, i + IDX[code]));
          pcm[o++] = p / 32768;
        }
      }
      this.adpcm = {i, p};
    } else {                                            // PCM 16 bit big-endian
      const n = data.length >> 1, dv = new DataView(data.buffer, data.byteOffset, n * 2);
      pcm = new Float32Array(n);
      for(let k = 0; k < n; k++) pcm[k] = dv.getInt16(k * 2, false) / 32768;
    }
    if(this.got) this.dbm = dbm;                        // primul pachet are RSSI vechi
    else { this.got = true; clearTimeout(this.timer); this.retries = 0; this._set('LIVE', tok); }
    const now = Date.now();
    if(now - this.lastKa > 1000){ this._send('SET keepalive'); this.lastKa = now; }
    this._play(pcm);
  }
  _play(pcm){
    const ctx = this.ctx; if(!ctx || !pcm.length) return;
    let buf;
    try{ buf = ctx.createBuffer(1, pcm.length, Math.round(this.rate)); buf.copyToChannel(pcm, 0); }
    catch(e){                                           // browsere vechi: rate minim 22050 → reeșantionare liniară
      const ratio = ctx.sampleRate / this.rate, n = Math.floor(pcm.length * ratio), out = new Float32Array(n);
      for(let k = 0; k < n; k++){ const x = k / ratio, j = x | 0, f = x - j; out[k] = pcm[j] * (1 - f) + (pcm[j + 1] ?? pcm[j]) * f; }
      buf = ctx.createBuffer(1, n, ctx.sampleRate); buf.copyToChannel(out, 0);
    }
    const t = ctx.currentTime;
    if(this.nextT < t + .05) this.nextT = t + .35;     // (re)umple bufferul de jitter
    if(this.nextT > t + 2) return;                      // prea în urmă → aruncă pachetul
    const src = ctx.createBufferSource(); src.buffer = buf; src.connect(this.gain);
    src.start(this.nextT); this.nextT += buf.duration;
  }
}

window.SDR = { list, playable, openUrl, meter, KiwiPlayer, isSecurePage };
})();
