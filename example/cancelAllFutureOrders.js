const Bitmusa = require('node-bitmusa-api');
const bitmusa = new Bitmusa('dummy_key');

(async function(){

    bitmusa.cancelAllFutureOrders("TBTC","TUSDT").then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });


})();

/*

{ detail: { code: 0, msg: 'SUCCESS' } }

*/