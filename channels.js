/* ================= CONFIGURARE COMUNĂ (desktop + mobil) =================
   Schimbă aici numele de pe carcasă și canalele.
   Canalele VHF sunt feed-uri LiveATC (`mount`); frecvențele sunt cele pe care le „pui” pe dial –
   verifică-le / ajustează-le după AIP.
   Canalele HF (cu `rx`) vin de la receptoare web KiwiSDR / WebSDR – vezi `receivers` și sdr.js. */
window.RADIO_CONFIG = {
  brand:    'LROP',
  brandSub: 'OTP',
  model:    'AR-119',
  modelHandheld: 'AR-119H',
  subtitle: 'AIRBAND COMMUNICATIONS RECEIVER',
  streamBase: 'https://d.liveatc.net/',
  // benzile pe care le acordă radioul (kHz); la intrarea într-o bandă se pun automat modul și pasul
  bands: [
    { name:'HF',  lo:2000,   hi:29999,  mode:'USB', step:1  },
    { name:'VHF', lo:108000, hi:136975, mode:'AM',  step:25 },
  ],
  guard: 121500,                   // kHz

  /* Receptoare web publice (sunt ale unor radioamatori – pot fi ocupate sau offline uneori).
     Ordinea din `rx` contează: radioul încearcă pe rând receptoarele kiwi; dacă niciunul nu
     merge (sau pagina e pe https și receptorul doar pe http), butonul ▶ WEB SDR deschide
     receptorul într-un tab nou – de preferință cel websdr, altfel primul din listă.
     Alte receptoare: http://rx.linkfanel.net (hartă KiwiSDR) · http://websdr.org */
  receivers: {
    IE: { type:'kiwi',   name:'CARLOW IE',  url:'http://emeraldsdr.ddns.net:8073' },
    UK: { type:'kiwi',   name:'WESSEX UK',  url:'http://wessex.zapto.org:8074' },
    DE: { type:'kiwi',   name:'DL4EEC DE',  url:'http://dl4eeckiwi.proxy.kiwisdr.com:8073' },
    NL: { type:'websdr', name:'TWENTE NL',  url:'http://websdr.ewi.utwente.nl:8901' },
  },

  channels: [
    { f:119100, name:'LROP APP/TWR/ACC', mount:'lrop'     },
    { f:120900, name:'LROP TOWER',       mount:'lrop_twr' },
    { f:121850, name:'LROP GROUND',      mount:'lrop2'    },
    { f:118300, name:'LRCL CLUJ',        mount:'lrcl'     },
    { f:118400, name:'LRTR TIMISOARA',   mount:'lrtr'     },
    // Paris CDG (mount nevalidat – verifică în playerul LiveATC dacă nu se aude)
    { f:119250, name:'PARIS LFPG TWR',   mount:'lfpg_twr'   },
    // Los Angeles
    { f:124050, name:'KLAX APP EAST',    mount:'kpoc2_klax_app_east_feeder' },
    // New York JFK (123.9 ales ca să nu se bată cu LROP APP/TWR/ACC pe 119.1)
    { f:123900, name:'KJFK TOWER',       mount:'kjfk_twr'   },
    { f:129900, name:'KJFK ARINC',       mount:'kjfk_arinc' },

    // ---- HF aviație (USB) prin receptoare web ----
    // Shannon VOLMET: meteo pentru Atlanticul de Nord, non-stop. 3413 noaptea, 8957 ziua, 5505 aproape mereu.
    { f:5505,  name:'SHANNON VOLMET', btn:'VOLMET 5505', mode:'USB', rx:['IE','UK','DE','NL'] },
    { f:3413,  name:'SHANNON VOLMET', btn:'VOLMET 3413', mode:'USB', rx:['IE','UK','DE','NL'] },
    { f:8957,  name:'SHANNON VOLMET', btn:'VOLMET 8957', mode:'USB', rx:['IE','UK','DE','NL'] },
    // RAF VOLMET (St. Eval)
    { f:5450,  name:'RAF VOLMET',     btn:'RAF 5450',    mode:'USB', rx:['UK','IE','DE','NL'] },
    // Shanwick Oceanic, familia C (trafic intermitent – doar când vorbesc avioanele)
    { f:5649,  name:'SHANWICK RADIO', btn:'SHANWICK 5649', mode:'USB', rx:['IE','UK','DE','NL'] },
    { f:8879,  name:'SHANWICK RADIO', btn:'SHANWICK 8879', mode:'USB', rx:['IE','UK','DE','NL'] },
  ],
};
