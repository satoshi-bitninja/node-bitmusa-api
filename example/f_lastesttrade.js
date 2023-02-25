let path = require('path');

var Bitmusa = require('node-bitmusa-api');
let bitmusa = new Bitmusa('dummy_key');

(async function(){
    console.log("start");

    bitmusa.fLatestTrade("TBTC","TUSDT").then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });


})();