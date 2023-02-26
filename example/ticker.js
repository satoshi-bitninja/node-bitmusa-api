const Bitmusa = require('node-bitmusa-api');
const bitmusa = new Bitmusa('dummy_key');

(async function(){

    bitmusa.ticker("BTC/USDT").then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });


})();