/* ================= CONFIGURARE COMUNĂ (desktop + mobil) =================
   Schimbă aici numele de pe carcasă și canalele.
   Stream-urile sunt feed-uri reale LiveATC (verificate);
   frecvențele sunt cele pe care le „pui” pe dial – verifică-le / ajustează-le după AIP. */
window.RADIO_CONFIG = {
  brand:    'LROP',
  brandSub: 'OTP',
  model:    'AR-119',
  modelHandheld: 'AR-119H',
  subtitle: 'AIRBAND COMMUNICATIONS RECEIVER',
  streamBase: 'https://d.liveatc.net/',
  band: [108000, 136975],          // kHz
  guard: 121500,                   // kHz
  channels: [
    { f:119100, name:'LROP APP/TWR/ACC', mount:'lrop'     },
    { f:120900, name:'LROP TOWER',       mount:'lrop_twr' },
    { f:121850, name:'LROP GROUND',      mount:'lrop2'    },
    { f:118300, name:'LRCL CLUJ',        mount:'lrcl'     },
    { f:118400, name:'LRTR TIMISOARA',   mount:'lrtr'     },
    // Paris CDG (mount nevalidat – verifică în playerul LiveATC dacă nu se aude)
    { f:119250, name:'PARIS LFPG TWR',   mount:'lfpg_twr'   },
    // New York JFK (123.9 ales ca să nu se bată cu LROP APP/TWR/ACC pe 119.1)
    { f:123900, name:'KJFK TOWER',       mount:'kjfk_twr'   },
    { f:129900, name:'KJFK ARINC',       mount:'kjfk_arinc' },
  ],
};
