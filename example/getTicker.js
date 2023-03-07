const Bitmusa = require('node-bitmusa-api');
const bitmusa = new Bitmusa('dummy_key');

(async function(){

    bitmusa.getTicker("BTC","USDT").then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });


})();

/*
{
  symbol: 'BTC/USDT',
  open: 22409.43,
  high: 22555.13,
  low: 22379.09,
  close: 22435,
  chg: 0.0013,
  change: 25.57,
  volume: 13.286,
  turnover: 1302038.2498867,
  lastDayClose: 22409.37,
  usdRate: 22435,
  baseUsdRate: 1,
  zone: 0,
  baseCoinScale: 2
}
*/