/* ================= NON-STOP: ecran treaz + reconectare automată =================
   KEEPALIVE.wake(true/false) – cât timp radioul e pornit, cere browserului să nu stingă ecranul
                               (Screen Wake Lock; se reia singur când revii pe tab).
   KEEPALIVE.watch(audio, {active, reconnect}) – supraveghează stream-ul și îl repornește dacă:
     - dă eroare sau se termină (serverul a închis conexiunea),
     - s-a blocat (sunetul nu mai avansează ~20 s),
     - nu pornește deloc în 60 s,
     - revine internetul după o cădere.
   Reîncercările se fac la 3, 6, 12… până la 30 s. */
window.KEEPALIVE = (() => {
  /* ---------- ecran treaz ---------- */
  let lock = null, want = false;
  async function acquire(){
    if(!want || lock || !('wakeLock' in navigator) || document.visibilityState !== 'visible') return;
    try{
      lock = await navigator.wakeLock.request('screen');
      lock.addEventListener('release', () => { lock = null; });
    }catch(e){ lock = null; }
  }
  document.addEventListener('visibilitychange', () => { if(document.visibilityState === 'visible') acquire(); });
  function wake(on){
    want = !!on;
    if(want) acquire();
    else if(lock){ try{ lock.release(); }catch(e){} lock = null; }
  }

  /* ---------- reconectare automată ---------- */
  function watch(audio, {active, reconnect}){
    let since = Date.now(), lastT = -1, sameFor = 0, backoff = 3000, retryT = null, liveSince = 0;
    const schedule = why => {
      if(retryT || !active()) return;
      retryT = setTimeout(() => { retryT = null; if(active()){ since = Date.now(); lastT = -1; sameFor = 0; reconnect(why); } }, backoff);
      backoff = Math.min(backoff * 2, 30000);
    };
    audio.addEventListener('error',   () => { if(audio.getAttribute('src')) schedule('error'); });
    audio.addEventListener('ended',   () => schedule('ended'));
    audio.addEventListener('playing', () => { liveSince = Date.now(); });
    addEventListener('online', () => {
      if(active() && (audio.paused || audio.readyState < 3)){ clearTimeout(retryT); retryT = null; backoff = 3000; since = Date.now(); reconnect('online'); }
    });
    setInterval(() => {
      if(!active()){ since = Date.now(); lastT = -1; sameFor = 0; return; }
      if(liveSince && Date.now() - liveSince > 30000) backoff = 3000;       // a mers stabil → reîncercări rapide din nou
      const playing = !audio.paused && audio.readyState >= 3;
      if(playing){
        const t = audio.currentTime;
        if(t === lastT){ sameFor += 5000; if(sameFor >= 20000){ sameFor = 0; schedule('frozen'); } }
        else sameFor = 0;
        lastT = t; since = Date.now();
      } else if(Date.now() - since > 60000){ since = Date.now(); schedule('stuck'); }
    }, 5000);
    // reset() = canal nou ales de utilizator: o luăm de la capăt, cu reîncercări rapide
    return { reset(){ since = Date.now(); lastT = -1; sameFor = 0; clearTimeout(retryT); retryT = null; liveSince = 0; backoff = 3000; } };
  }

  return { wake, watch };
})();
