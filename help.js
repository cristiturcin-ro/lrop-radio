/* ================= AJUTOR (popup-uri explicative) =================
   HELP.attach(el, {t:'TITLU', d:'explicație', k:'scurtătură'})  – sau o funcție care întoarce obiectul.
   Desktop: apare când ții mouse-ul pe control (sau îl selectezi cu Tab).
   Telefon/tabletă: ține apăsat ~½ s pe control (apăsarea lungă nu mai declanșează butonul). */
(() => {
const css = `
.help-tip{position:fixed;left:0;top:0;z-index:9999;max-width:260px;padding:8px 11px 9px;border-radius:7px;
  background:rgba(14,15,17,.97);color:#d6d6d6;font:500 14px/1.35 "Barlow Condensed","Arial Narrow",sans-serif;letter-spacing:.3px;
  box-shadow:0 8px 24px rgba(0,0,0,.65),0 0 0 1px #45474c;pointer-events:none;opacity:0;transform:translateY(4px);
  transition:opacity .12s,transform .12s;-webkit-user-select:none;user-select:none}
.help-tip.show{opacity:1;transform:none}
.help-tip b{display:block;color:#ffa53a;font-weight:700;font-size:13px;letter-spacing:1.5px;margin-bottom:3px}
.help-tip i{display:block;font-style:normal;margin-top:5px;color:#9a9ca1;font-size:12.5px}
.help-tip kbd{font:600 11.5px/1 "Barlow Condensed",sans-serif;border:1px solid #5a5c61;border-bottom-width:2px;border-radius:3px;padding:1px 4px;color:#eee}
.help-tip::after{content:"";position:absolute;left:var(--ax,50%);width:9px;height:9px;background:#0e0f11;transform:translateX(-50%) rotate(45deg)}
.help-tip.above::after{bottom:-5px;box-shadow:1px 1px 0 #45474c}
.help-tip.below::after{top:-5px;box-shadow:-1px -1px 0 #45474c}`;
const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

const tip = document.createElement('div');
tip.className = 'help-tip'; tip.setAttribute('role', 'tooltip'); tip.id = 'help-tip';
const add = () => document.body.appendChild(tip);
document.body ? add() : document.addEventListener('DOMContentLoaded', add);

let cur = null, showT = null, hideT = null, lastHide = 0, suppress = null;

function render(info){
  tip.textContent = '';
  const b = document.createElement('b'); b.textContent = info.t || ''; tip.appendChild(b);
  if(info.d){ const s = document.createElement('span'); s.textContent = info.d; tip.appendChild(s); }
  if(info.k){
    const i = document.createElement('i');
    // „Taste: ↑ ↓“ → fiecare tastă în <kbd>
    info.k.split(/(\[[^\]]+\])/).forEach(part => {
      if(/^\[.+\]$/.test(part)){ const k = document.createElement('kbd'); k.textContent = part.slice(1, -1); i.appendChild(k); }
      else i.appendChild(document.createTextNode(part));
    });
    tip.appendChild(i);
  }
}
function show(el){
  const info = typeof el._help === 'function' ? el._help() : el._help;
  if(!info) return;
  clearTimeout(hideT); cur = el; render(info);
  el.setAttribute('aria-describedby', 'help-tip');
  tip.classList.remove('above', 'below'); tip.style.left = '0px'; tip.style.top = '0px';
  const r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
  const cx = r.left + r.width / 2;
  const x = Math.max(8, Math.min(innerWidth - w - 8, cx - w / 2));
  const above = r.top - h - 12 >= 6;
  const y = above ? r.top - h - 11 : Math.min(innerHeight - h - 6, r.bottom + 11);
  tip.style.left = x + 'px'; tip.style.top = y + 'px';
  tip.style.setProperty('--ax', Math.max(12, Math.min(w - 12, cx - x)) + 'px');
  tip.classList.add(above ? 'above' : 'below', 'show');
}
function hide(el){
  clearTimeout(showT);
  if(el && el !== cur) return;
  if(cur){ cur.removeAttribute('aria-describedby'); lastHide = Date.now(); }
  cur = null; tip.classList.remove('show');
}

function attach(el, info, opts = {}){
  if(!el) return;
  el._help = info;
  el.removeAttribute('title');                       // fără tooltip-ul nativ dublat
  el.addEventListener('pointerenter', e => {
    if(e.pointerType === 'touch') return;
    clearTimeout(showT);
    // dacă tocmai era un popup deschis, următorul apare imediat
    showT = setTimeout(() => show(el), (cur || Date.now() - lastHide < 400) ? 0 : 350);
  });
  el.addEventListener('pointerleave', e => { if(e.pointerType !== 'touch') hide(el); });
  el.addEventListener('focus', () => { if(el.matches(':focus-visible')) show(el); });
  el.addEventListener('blur', () => hide(el));
  if(opts.touch === false) return;
  // apăsare lungă pe ecrane tactile
  let lp = null, x0 = 0, y0 = 0;
  el.addEventListener('pointerdown', e => {
    if(e.pointerType !== 'touch') return;
    x0 = e.clientX; y0 = e.clientY; clearTimeout(lp);
    lp = setTimeout(() => {
      show(el); suppress = {el, until: Date.now() + 1500};
      if(navigator.vibrate) try{ navigator.vibrate(10); }catch(_){}
    }, 550);
  });
  el.addEventListener('pointermove', e => { if(lp && Math.hypot(e.clientX - x0, e.clientY - y0) > 10){ clearTimeout(lp); lp = null; } });
  const end = () => { clearTimeout(lp); lp = null; if(cur === el){ clearTimeout(hideT); hideT = setTimeout(() => hide(el), 2600); } };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  el.addEventListener('contextmenu', e => { if(el._help) e.preventDefault(); });
}
// apăsarea lungă a arătat ajutorul → nu mai apăsa și butonul
document.addEventListener('click', e => {
  if(suppress && Date.now() < suppress.until && suppress.el.contains(e.target)){
    e.stopPropagation(); e.preventDefault(); suppress = null;
  }
}, true);
document.addEventListener('pointerdown', e => { if(cur && e.pointerType === 'mouse') hide(); }, true);
addEventListener('scroll', () => hide(), true);
addEventListener('blur', () => hide());

window.HELP = { attach, show, hide };
})();
