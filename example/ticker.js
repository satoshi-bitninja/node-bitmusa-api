let path = require('path');

var Bitmusa = require('../bitmusa');
let bitmusa = new Bitmusa('dummy_key');

(async function(){
    console.log("start");

    bitmusa.ticker("BTC/USDT").then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });


})();