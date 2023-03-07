const Bitmusa = require('node-bitmusa-api');
const bitmusa = new Bitmusa('dummy_key');
const util = require('util');

(async function(){
    bitmusa.fetchOrderBook("BTC","USDT").then(result => {
        console.log(util.inspect(result, { showHidden: false, depth: null }));

    }).catch(err => {
        console.log(err);
    });
 

})();

/*

{
  ask: {
    direction: 'SELL',
    maxAmount: 10.14573,
    minAmount: 0.00001,
    highestPrice: 25677.06,
    lowestPrice: 23433.15,
    symbol: 'BTC/USDT',
    items: [
      { price: 23433.15, amount: 0.41155 },
      { price: 23433.32, amount: 0.00625 },
      { price: 23433.34, amount: 0.04268 },
      { price: 23433.51, amount: 0.04268 },
      { price: 23433.53, amount: 0.059 },
      { price: 23433.61, amount: 0.00348 },
      { price: 23433.63, amount: 0.00457 },
      { price: 23433.66, amount: 0.0007 },
      { price: 23433.8, amount: 0.004 },
      { price: 23433.82, amount: 0.006 },
      { price: 23433.88, amount: 0.002 },
      { price: 23433.91, amount: 0.01648 },
      { price: 23433.92, amount: 0.01093 },
      { price: 23433.93, amount: 0.0038 },
      { price: 23433.94, amount: 0.0545 },
      { price: 23433.95, amount: 0.01379 },
      { price: 23433.96, amount: 0.001 },
      { price: 23433.97, amount: 0.1535 },
      { price: 23433.98, amount: 0.06469 },
      { price: 23433.99, amount: 0.002 },
      { price: 23434, amount: 0.202 },
      { price: 23434.01, amount: 0.004 },
      { price: 23434.02, amount: 0.004 },
      { price: 23434.03, amount: 0.001 }
    ]
  },
  bid: {
    direction: 'BUY',
    maxAmount: 25878,
    minAmount: 0.00002,
    highestPrice: 23418.61,
    lowestPrice: 1,
    symbol: 'BTC/USDT',
    items: [
      { price: 23418.61, amount: 0.00003 },
      { price: 23415.33, amount: 0.00002 },
      { price: 23412.41, amount: 0.00003 },
      { price: 23411.63, amount: 0.00004 },
      { price: 23410.52, amount: 0.00003 },
      { price: 23410.42, amount: 0.00002 },
      { price: 23321.55, amount: 0.00004 },
      { price: 23319.1, amount: 0.00004 },
      { price: 23285.57, amount: 0.00003 },
      { price: 23276.46, amount: 0.00003 },
      { price: 23270.07, amount: 0.00004 },
      { price: 23244.2, amount: 0.00002 },
      { price: 23237.39, amount: 0.00002 },
      { price: 23205.65, amount: 0.00002 },
      { price: 23205.21, amount: 0.00004 },
      { price: 23201.95, amount: 0.00002 },
      { price: 23197.06, amount: 0.00003 },
      { price: 23167.24, amount: 0.00002 },
      { price: 22807.43, amount: 0.00002 },
      { price: 22783.22, amount: 0.00003 },
      { price: 22761.56, amount: 0.00004 },
      { price: 22076.11, amount: 0.00003 },
      { price: 21903.39, amount: 0.00003 },
      { price: 21773.54, amount: 0.00003 }
    ]
  }
}

*/