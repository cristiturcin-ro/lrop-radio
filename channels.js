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

  /* Grupele de canale rapide (tab-urile din dreapta-jos pe desktop).
     Fiecare canal are: f (kHz), name (pe afișaj), btn (eticheta butonului), group, info (explicația din popup). */
  groups: [
    { id:'RO', name:'ROMÂNIA',  info:'Aeroporturi din România – audio live de la LiveATC.' },
    { id:'W',  name:'LUME',     info:'Aeroporturi mari din lume – audio live de la LiveATC.' },
    { id:'HF', name:'HF OCEAN', info:'Unde scurte: meteo și controlul zborurilor peste Atlanticul de Nord, prin receptoare web.' },
  ],

  channels: [
    { f:119100, name:'LROP APP/TWR/ACC', btn:'OTP APP', group:'RO', mount:'lrop',
      info:'Otopeni – apropiere, turn și control regional, toate într-un singur feed.' },
    { f:120900, name:'LROP TOWER',       btn:'OTP TOWER',   group:'RO', mount:'lrop_twr',
      info:'Otopeni – turnul de control: autorizări de decolare și aterizare.' },
    { f:121850, name:'LROP GROUND',      btn:'OTP GROUND',  group:'RO', mount:'lrop2',
      info:'Otopeni – sol: rulajul avioanelor între poartă și pistă.' },
    { f:118300, name:'LRCL CLUJ',        btn:'CLUJ',        group:'RO', mount:'lrcl',
      info:'Aeroportul Cluj-Napoca.' },
    { f:118400, name:'LRTR TIMISOARA',   btn:'TIMIȘOARA',   group:'RO', mount:'lrtr',
      info:'Aeroportul Timișoara.' },
    // Paris CDG (mount nevalidat – verifică în playerul LiveATC dacă nu se aude)
    { f:119250, name:'PARIS LFPG TWR',   btn:'PARIS CDG',   group:'W',  mount:'lfpg_twr',
      info:'Paris Charles de Gaulle – turnul de control.' },
    { f:124050, name:'KLAX APP EAST',    btn:'LOS ANGELES', group:'W',  mount:'kpoc2_klax_app_east_feeder',
      info:'Los Angeles (LAX) – apropierea dinspre est: avioanele aliniate pentru aterizare.' },
    // New York JFK (123.9 ales ca să nu se bată cu LROP APP/TWR/ACC pe 119.1)
    { f:123900, name:'KJFK TOWER',       btn:'JFK TOWER',   group:'W',  mount:'kjfk_twr',
      info:'New York JFK – turnul de control.' },
    { f:129900, name:'KJFK ARINC',       btn:'JFK ARINC',   group:'W',  mount:'kjfk_arinc',
      info:'New York JFK – ARINC: mesaje între piloți și companiile aeriene.' },

    // ---- HF aviație (USB) prin receptoare web ----
    // Shannon VOLMET: meteo pentru Atlanticul de Nord, non-stop. 3413 noaptea, 8957 ziua, 5505 aproape mereu.
    { f:5505,  name:'SHANNON VOLMET', btn:'VOLMET 5505', group:'HF', mode:'USB', rx:['IE','UK','DE','NL'],
      info:'Shannon (Irlanda): buletine meteo citite non-stop pentru piloții de peste Atlantic. Se aude aproape oricând.' },
    { f:3413,  name:'SHANNON VOLMET', btn:'VOLMET 3413', group:'HF', mode:'USB', rx:['IE','UK','DE','NL'],
      info:'Shannon VOLMET – frecvența de noapte.' },
    { f:8957,  name:'SHANNON VOLMET', btn:'VOLMET 8957', group:'HF', mode:'USB', rx:['IE','UK','DE','NL'],
      info:'Shannon VOLMET – frecvența de zi.' },
    // RAF VOLMET (St. Eval)
    { f:5450,  name:'RAF VOLMET',     btn:'RAF 5450',    group:'HF', mode:'USB', rx:['UK','IE','DE','NL'],
      info:'Meteo pentru aviația militară britanică (Royal Air Force).' },
    // Shanwick Oceanic, familia C (trafic intermitent – doar când vorbesc avioanele)
    { f:5649,  name:'SHANWICK RADIO', btn:'SHANWICK 5649', group:'HF', mode:'USB', rx:['IE','UK','DE','NL'],
      info:'Controlul zborurilor peste Atlantic (Shannon + Prestwick), frecvența de noapte. Pauze lungi între apeluri.' },
    { f:8879,  name:'SHANWICK RADIO', btn:'SHANWICK 8879', group:'HF', mode:'USB', rx:['IE','UK','DE','NL'],
      info:'Controlul zborurilor peste Atlantic (Shannon + Prestwick), frecvența de zi. Pauze lungi între apeluri.' },
  ],
};
