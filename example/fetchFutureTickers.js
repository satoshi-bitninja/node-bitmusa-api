const Bitmusa = require('../bitmusa');
const bitmusa = new Bitmusa('dummy_key');

(async function(){

    bitmusa.fetchFutureTickers().then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });


})();

/*

{
  pk: '01GTK4QZM3V5RHRV5BQBFGZKGJ',
  ticker: 'TBTCTUSDT',
  base_price: 22397,
  high_price: 22541.7,
  low_price: 22322.6,
  last_price: 22406.9,
  mark_price: 22417.41896,
  index_price: 22416.84953,
  funding_fee_rate: -0.0001,
  funding_time: 1678150800000,
  remaining_funding_time: 2073889,
  change_price: 9.9,
  change_rate: 0.0442,
  total_qty: 522.403,
  total_value: 11716310.7922,
  last_updated_time: 1678184726111
}


*/