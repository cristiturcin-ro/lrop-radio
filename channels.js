/* ================= CONFIGURARE COMUNĂ (desktop + mobil) =================
   Schimbă aici numele de pe carcasă și canalele.
   Fiecare canal are: f (kHz – frecvența pe dial), name (pe afișaj), btn (eticheta butonului),
   group (tab-ul), info (explicația din popup) și sursa audio:
     - mount: feed LiveATC (ce apare după mount= în linkul de ascultare de pe liveatc.net), sau
     - url:   link direct către un stream audio (MP3 / Icecast, pe https), + source = cine îl oferă.
   tz = fusul orar al locului (nume IANA, ex. 'Asia/Hong_Kong') – ceasul arată ora de acolo (LCL)
        și diferența față de București; fără tz (ex. Morse) ceasul arată doar ora Bucureștiului.
   nominal:true = feed-ul ascultă mai multe frecvențe; cea de pe dial e doar orientativă.
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
    { name:'VHF',    lo:108000, hi:136975, mode:'AM', step:25 },   // aviație
    { name:'VHF-HI', lo:137000, hi:174000, mode:'FM', step:25 },   // urgențe, tren, maritim, meteo
  ],
  guard: 121500,                   // kHz
  // ceasul (butonul CLOCK): în stânga ora de acasă, în dreapta ora locului ascultat
  homeTz:  'Europe/Bucharest',
  homeTag: 'BUC',

  groups: [
    { id:'AV', name:'AVIATION',  info:'Apropierea (APP) de la aeroporturi din lume – audio live de la LiveATC.' },
    { id:'EM', name:'EMERGENCY', info:'Pompieri, ambulanță, salvare montană – Perth (Australia) și British Columbia (Canada). Stream-uri directe WARSUG și ScanBC.' },
    { id:'RS', name:'RAIL·SEA',  info:'Tren (Perth), traficul radio din portul New York și buletine meteo marine (coasta de vest a SUA).' },
    { id:'WX', name:'WEATHER',   info:'NOAA Weather Radio: meteo și alerte citite non-stop, din SUA. Stream-uri directe wxradio.org.' },
    { id:'CW', name:'MORSE',     info:'Cod Morse transmis continuu, pentru exersare (morseops.com).' },
  ],

  channels: [
    { f:119415, name:'BUCHAREST',     btn:'BUCHAREST',     group:'AV', tz:'Europe/Bucharest', mount:'lrop',
      info:'Otopeni (LROP) – apropiere, turn și radar într-un singur feed. Bucharest Approach 119.415.' },
    { f:123700, name:'SOFIA',         btn:'SOFIA',         group:'AV', tz:'Europe/Sofia', mount:'lbsf1',
      info:'Sofia (LBSF) – apropiere și turn. Sofia Approach 123.700.' },
    { f:120300, name:'SKOPJE',        btn:'SKOPJE',        group:'AV', tz:'Europe/Skopje', nominal:true, mount:'lwsk2_4',
      info:'Skopje (LWSK), Macedonia de Nord – controlul regional, sectorul de jos (Skopje ACC Lower): avioanele care urcă, coboară sau traversează țara.' },
    { f:121100, name:'DUBLIN',        btn:'DUBLIN',        group:'AV', tz:'Europe/Dublin', mount:'eidw8',
      info:'Dublin (EIDW) – apropiere, turn, sol și control. Dublin Approach 121.100.' },
    { f:125700, name:'NEW YORK',      btn:'NEW YORK',      group:'AV', tz:'America/New_York', mount:'kjfk_app_rober',
      info:'New York JFK (KJFK) – NY Approach, sectorul ROBER: sosirile spre JFK. 125.700.' },
    { f:124900, name:'LOS ANGELES',   btn:'LOS ANGELES',   group:'AV', tz:'America/Los_Angeles', mount:'klax6',
      info:'Los Angeles (KLAX) – SoCal Approach, finala nord și sud: avioanele aliniate pentru aterizare. 124.900.' },
    { f:120350, name:'SAN FRANCISCO', btn:'SAN FRANCISCO', group:'AV', tz:'America/Los_Angeles', mount:'ksfo_app2',
      info:'San Francisco (KSFO) – NorCal Approach, finala pistelor 28L/R. 120.350.' },
    { f:132700, name:'VANCOUVER',     btn:'VANCOUVER',     group:'AV', tz:'America/Vancouver', nominal:true, source:'ScanBC',
      url:'https://icecast0.scanbc.com/cyvr1_app',
      info:'Vancouver (CYVR) – Vancouver Terminal: apropierea, sosirile și plecările din jurul aeroportului.' },
    { f:119100, name:'HONG KONG',     btn:'HONG KONG',     group:'AV', tz:'Asia/Hong_Kong', mount:'vhhh5',
      info:'Hong Kong (VHHH) – apropiere, plecări și director. Hong Kong Approach 119.100.' },

    // ---- EMERGENCY: pompieri, ambulanță, salvare (stream-uri directe, se aud doar când vorbește cineva) ----
    { f:152000, name:'PERTH FIRE',    btn:'PERTH FIRE',    group:'EM', tz:'Australia/Perth', nominal:true, source:'WARSUG',
      url:'https://stream.warsug.info/WARSUG',
      info:'Perth (Australia) – pompierii: canalul de comandă al Fire and Rescue Service.' },
    { f:152500, name:'PERTH DFES',    btn:'PERTH DFES',    group:'EM', tz:'Australia/Perth', nominal:true, source:'WARSUG',
      url:'https://stream.warsug.info/DFES',
      info:'Perth (Australia) – Department of Fire and Emergency Services: intervenții, incendii de vegetație.' },
    { f:155580, name:'KELOWNA',       btn:'KELOWNA',       group:'EM', tz:'America/Vancouver', source:'ScanBC',
      url:'https://icecast0.scanbc.com/kelowna',
      info:'Kelowna (Canada) – pompieri, ambulanță, incendii de pădure. Kelowna Fire Pager 155.580.' },
    { f:154190, name:'FRASER VALLEY', btn:'FRASER VALLEY', group:'EM', tz:'America/Vancouver', source:'ScanBC',
      url:'https://icecast0.scanbc.com/valley',
      info:'Fraser Valley, lângă Vancouver (Canada) – dispecerate de pompieri. Chilliwack Fire Dispatch 154.190.' },
    { f:154920, name:'VICTORIA FIRE', btn:'VICTORIA',      group:'EM', tz:'America/Vancouver', source:'ScanBC',
      url:'https://icecast0.scanbc.com/crdfirepager',
      info:'Victoria, Vancouver Island (Canada) – pagerele pompierilor din Capital Region. 154.920.' },
    { f:150500, name:'BC AIR AMBULANCE', btn:'AIR AMBULANCE', group:'EM', tz:'America/Vancouver', nominal:true, source:'ScanBC',
      url:'https://icecast0.scanbc.com/swbcehsprov',
      info:'British Columbia (Canada) – ambulanța aeriană (BC Emergency Health Services).' },
    { f:153000, name:'VERNON SAR',    btn:'VERNON SAR',    group:'EM', tz:'America/Vancouver', nominal:true, source:'ScanBC',
      url:'https://icecast0.scanbc.com/vernonsar',
      info:'Vernon (Canada) – salvare montană (Search & Rescue), prin repetoarele de pe munții Silver Star și Yeoward.' },
    { f:153500, name:'KAMLOOPS',      btn:'KAMLOOPS',      group:'EM', tz:'America/Vancouver', nominal:true, source:'ScanBC',
      url:'https://icecast0.scanbc.com/kamloops',
      info:'Kamloops (Canada) – pompieri și servicii de urgență.' },

    // ---- RAIL·SEA: tren și meteo marin ----
    { f:160500, name:'PERTH RAIL',    btn:'PERTH RAIL',    group:'RS', tz:'Australia/Perth', nominal:true, source:'WARSUG',
      url:'https://stream.warsug.info/ZPerthRail',
      info:'Perth (Australia) – operațiunile trenurilor Transperth și poliția feroviară.' },
    { f:156650, name:'NY HARBOR',     btn:'NY HARBOR',     group:'RS', tz:'America/New_York', nominal:true, source:'Broadcastify',
      url:'https://broadcastify.cdnstream1.com/17329',
      info:'Portul New York / New Jersey (SUA) – radio VHF marin live, oameni reali: cargouri, remorchere, feriboturi, vase de croazieră pe Hudson, East River și Newark Bay. Canalul 13 (156.650) e cel de lucru între nave; la pornire poate rula o reclamă scurtă (15-30 s).' },
    { f:162425, name:'PUGET SOUND MARINE', btn:'PUGET SOUND', group:'RS', tz:'America/Los_Angeles', source:'wxradio',
      url:'https://wxradio.bobc.io/stream/WWG24',
      info:'Seattle / strâmtoarea Puget Sound (SUA) – buletin meteo marin non-stop (NOAA WWG24), 162.425.' },
    { f:162450, name:'MONTEREY MARINE', btn:'MONTEREY',     group:'RS', tz:'America/Los_Angeles', source:'wxradio',
      url:'https://wxradio.org/CA-MontereyMarine-WWF64',
      info:'Golful Monterey, California (SUA) – buletin meteo marin non-stop (NOAA WWF64), 162.450.' },

    // ---- WEATHER: NOAA Weather Radio, citit non-stop ----
    { f:162400, name:'DALLAS',        btn:'DALLAS',        group:'WX', tz:'America/Chicago', source:'wxradio',
      url:'https://wxradio.org/TX-Dallas-KEC56',
      info:'Dallas, Texas (SUA) – NOAA Weather Radio KEC56, 162.400.' },
    { f:162475, name:'TOPEKA',        btn:'TOPEKA',        group:'WX', tz:'America/Chicago', source:'wxradio',
      url:'https://wxradio.org/KS-Topeka-WXK91-alt1',
      info:'Topeka, Kansas (SUA) – NOAA Weather Radio WXK91, 162.475. Zonă cu tornade primăvara.' },
    { f:162500, name:'FRANKFORT',     btn:'FRANKFORT',     group:'WX', tz:'America/New_York', source:'wxradio',
      url:'https://wxradio.org/KY-Frankfort-WZ2523',
      info:'Frankfort, Kentucky (SUA) – NOAA Weather Radio WZ2523, 162.500.' },
    { f:162525, name:'MT PLEASANT',   btn:'MT PLEASANT',   group:'WX', tz:'America/Detroit', source:'wxradio',
      url:'https://wxradio.org/MI-MountPleasant-KZZ33',
      info:'Mount Pleasant, Michigan (SUA) – NOAA Weather Radio KZZ33, 162.525.' },
    { f:162550, name:'SEATTLE',       btn:'SEATTLE',       group:'WX', tz:'America/Los_Angeles', source:'wxradio',
      url:'https://wxradio.bobc.io/stream/KHB60',
      info:'Seattle, Washington (SUA) – NOAA Weather Radio KHB60, 162.550.' },

    // ---- MORSE: cod Morse continuu (segmentul CW din banda de radioamatori de 2 m) ----
    { f:144050, name:'MORSE 15 WPM',  btn:'MORSE 15',      group:'CW', source:'morseops',
      url:'https://stream.morseops.com/15wpm.mp3',
      info:'Cod Morse non-stop la 15 cuvinte pe minut – bun pentru începători.' },
    { f:144100, name:'MORSE 25 WPM',  btn:'MORSE 25',      group:'CW', source:'morseops',
      url:'https://stream.morseops.com/25wpm.mp3',
      info:'Cod Morse non-stop la 25 de cuvinte pe minut.' },
  ],
};
