/* ================= CONFIGURARE COMUNĂ (desktop + mobil) =================
   Schimbă aici numele de pe carcasă și canalele.
   Fiecare canal e un feed LiveATC (`mount` = ce apare după mount= în linkul de ascultare de pe liveatc.net)
   și are: f (kHz – frecvența pe care o arată dialul; aici frecvența de apropiere), name (pe afișaj),
   btn (eticheta butonului), info (explicația din popup).
   (sdr.js poate reda și receptoare web KiwiSDR – un canal cu `rx` în loc de `mount`; momentan nefolosit.) */
window.RADIO_CONFIG = {
  brand:    'LROP',
  brandSub: 'OTP',
  model:    'AR-119',
  modelHandheld: 'AR-119H',
  subtitle: 'AIRBAND COMMUNICATIONS RECEIVER',
  streamBase: 'https://d.liveatc.net/',
  // banda pe care o acordă radioul (kHz)
  bands: [
    { name:'VHF', lo:108000, hi:136975, mode:'AM', step:25 },
  ],
  guard: 121500,                   // kHz

  groups: [
    { id:'AV', name:'AVIATION', info:'Apropierea (APP) de la aeroporturi din lume – audio live de la LiveATC.' },
  ],

  channels: [
    { f:119415, name:'BUCHAREST',     btn:'BUCHAREST',     group:'AV', mount:'lrop',
      info:'Otopeni (LROP) – apropiere, turn și radar într-un singur feed. Bucharest Approach 119.415.' },
    { f:126425, name:'CLUJ',          btn:'CLUJ',          group:'AV', mount:'lrcl',
      info:'Cluj-Napoca (LRCL) – apropiere și turn. Cluj Approach 126.425.' },
    { f:127250, name:'TIMISOARA',     btn:'TIMIȘOARA',     group:'AV', mount:'lrtr',
      info:'Timișoara (LRTR) – turn și Arad Approach 127.250.' },
    { f:123700, name:'SOFIA',         btn:'SOFIA',         group:'AV', mount:'lbsf1',
      info:'Sofia (LBSF) – apropiere și turn. Sofia Approach 123.700.' },
    { f:121100, name:'DUBLIN',        btn:'DUBLIN',        group:'AV', mount:'eidw8',
      info:'Dublin (EIDW) – apropiere, turn, sol și control. Dublin Approach 121.100.' },
    { f:125700, name:'NEW YORK',      btn:'NEW YORK',      group:'AV', mount:'kjfk_app_rober',
      info:'New York JFK (KJFK) – NY Approach, sectorul ROBER: sosirile spre JFK. 125.700.' },
    { f:124900, name:'LOS ANGELES',   btn:'LOS ANGELES',   group:'AV', mount:'klax6',
      info:'Los Angeles (KLAX) – SoCal Approach, finala nord și sud: avioanele aliniate pentru aterizare. 124.900.' },
    { f:120350, name:'SAN FRANCISCO', btn:'SAN FRANCISCO', group:'AV', mount:'ksfo_app2',
      info:'San Francisco (KSFO) – NorCal Approach, finala pistelor 28L/R. 120.350.' },
    { f:119100, name:'HONG KONG',     btn:'HONG KONG',     group:'AV', mount:'vhhh5',
      info:'Hong Kong (VHHH) – apropiere, plecări și director. Hong Kong Approach 119.100.' },
  ],
};
