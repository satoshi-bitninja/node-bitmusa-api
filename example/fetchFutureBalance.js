const Bitmusa = require('../bitmusa');
const bitmusa = new Bitmusa('a3f74de1-b23b-4758-9621-b4925a3876bd');

(async function(){

    bitmusa.fetchFutureBalance().then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });


})();

/*
[
  {
    symbol: 'TUSDT',
    total_wallet_balance: 100000,
    total_margin_balance: 100000,
    total_available_balance: 100000,
    total_unpnl: 0,
    position: []
  }
]

{ code: 4000, message: 'need sign in' }

*/