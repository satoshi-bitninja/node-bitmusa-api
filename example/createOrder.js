const Bitmusa = require('node-bitmusa-api');
const bitmusa = new Bitmusa('dummy_key');

(async function(){
    bitmusa.createOrder("BUY", "BTC", "USDT", "0.0001", "LIMIT", "10").then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });


})();

/*

{ data: 'E167753457580720', code: 0, message: 'success' }

{ data: null, code: 50111, message: 'amount too small 0.00001000' }
{ data: null, code: 500, message: 'exorbitant prices' }
{ data: null, code: 500, message: 'illegal argument' }
{ data: null, code: 500, message: 'UNKNOWN' }
{
  data: null,
  code: 50110,
  message: 'Min Market Buy Order Amount: 10.00000000'
}

*/