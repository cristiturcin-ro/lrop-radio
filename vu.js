/* ================= NIVEL REAL AL SUNETULUI (S-metru care urmează audio-ul) =================
   Unele servere de stream permit browserului să „citească” sunetul (CORS: Access-Control-Allow-Origin).
   Pentru ele, audio-ul trece prin Web Audio: sursă → volum → difuzor, plus sursă → analizor.
   Analizorul măsoară cât de tare e sunetul (RMS) ÎNAINTE de volum, deci acul arată semnalul,
   nu poziția butonului de volum. Pentru serverele fără CORS radioul rămâne pe S-metrul simulat.

   VU.corsOk(url)        – serverul e pe lista celor care permit citirea sunetului
   VU.element()          – <audio crossorigin="anonymous"> dedicat acestor stream-uri
   VU.attach(el, ctx)    – îl leagă (o singură dată) în graful Web Audio; întoarce true dacă merge
   VU.setVolume(v, ctx)  – volumul (0..1) pentru stream-ul citit
   VU.level()            – nivelul curent 0..1 pe scara S-metrului (≈ S9 la vorbire normală) */
window.VU = (() => {
  // verificat nov. 2026: trimit Access-Control-Allow-Origin: * (inclusiv pe redirect-ul LiveATC)
  const HOSTS = ['liveatc.net', 'scanbc.com', 'wxradio.org'];
  const corsOk = url => {
    try{ const h = new URL(url, location.href).hostname; return HOSTS.some(d => h === d || h.endsWith('.' + d)); }
    catch(e){ return false; }
  };

  let el = null, g = null;
  function element(){
    if(el) return el;
    el = new Audio();
    el.crossOrigin = 'anonymous';
    el.preload = 'none';
    el.setAttribute('playsinline', '');
    return el;
  }
  function attach(media, ctx){
    if(g) return true;
    if(!ctx || !media) return false;
    try{
      const src = ctx.createMediaElementSource(media);
      const gain = ctx.createGain(); gain.gain.value = 0;
      const an = ctx.createAnalyser(); an.fftSize = 1024; an.smoothingTimeConstant = 0;
      src.connect(gain).connect(ctx.destination);
      src.connect(an);
      g = { ctx, gain, an, buf: new Float32Array(an.fftSize) };
      return true;
    }catch(e){ g = null; return false; }
  }
  function setVolume(v){
    if(g) g.gain.gain.setTargetAtTime(Math.max(0, Math.min(1, v)), g.ctx.currentTime, .03);
  }
  function rms(){
    if(!g) return 0;
    g.an.getFloatTimeDomainData(g.buf);
    let s = 0; for(let i = 0; i < g.buf.length; i++) s += g.buf[i] * g.buf[i];
    return Math.sqrt(s / g.buf.length);
  }
  // dBFS → scara acului: -45 dB ≈ S1, -20 dB ≈ S9 (vorbire normală), -6 dB ≈ +40
  function level(){
    const db = 20 * Math.log10(Math.max(rms(), 1e-5));
    return Math.max(0, Math.min(1, .04 + (db + 45) / 35 * .71));
  }
  return { corsOk, element, attach, setVolume, level };
})();
