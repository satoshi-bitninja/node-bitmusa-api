const Bitmusa = require('node-bitmusa-api');
const bitmusa = new Bitmusa('dummy_key');

(async function(){

    bitmusa.cancelFutureOrder("F8452116782119594979762").then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });


})();

/*

{ detail: { code: 0, msg: 'SUCCESS' } }

*/