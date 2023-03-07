const Bitmusa = require('node-bitmusa-api');
const bitmusa = new Bitmusa('dummy_key');

(async function(){
    bitmusa.cancelOrder("E167753577685579").then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });


})();

/*

{ data: null, code: 0, message: 'success' }
{ data: null, code: 500, message: 'Order Status: Not Trading' }
{ data: null, code: 500, message: 'UNKNOWN' }

*/