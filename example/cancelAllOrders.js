const Bitmusa = require('node-bitmusa-api');
const bitmusa = new Bitmusa('dummy_key');

(async function(){
    bitmusa.setTimeout(100000);
    bitmusa.cancelAllOrders("ETH","USDT","SELL").then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });


})();

/*

{ data: null, code: 0, message: 'success' }
{ data: null, code: 500, message: 'UNKNOWN' }

*/