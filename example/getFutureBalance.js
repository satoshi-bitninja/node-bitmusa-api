const Bitmusa = require('node-bitmusa-api');
const bitmusa = new Bitmusa('dummy_key');

(async function(){


    bitmusa.getFutureBalance("TUSDT").then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });


})();

/*
  {
    symbol: 'TUSDT',
    total_wallet_balance: 100000,
    total_margin_balance: 100000,
    total_available_balance: 100000,
    total_unpnl: 0,
    position: []
  }


*/