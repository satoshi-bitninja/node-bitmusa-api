const Bitmusa = require('node-bitmusa-api');
const bitmusa = new Bitmusa('dummy_key');

(async function(){

    bitmusa.fetchFutureOpenOrders("TBTC","TUSDT",50).then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });


})();

/*
[
  {
    id: 203526,
    ticker_id: 1,
    member_id: 84521,
    order_id: 'F8452116783036494161337',
    margin_mode: 0,
    direction: 0,
    position: 0,
    order_type: 1,
    status: 0,
    tif_mode: 0,
    trigger_type: 0,
    trigger_direction: 0,
    ticker: 'TBTCTUSDT',
    coin_symbol: 'TBTC',
    base_symbol: 'TUSDT',
    leverage: 125,
    order_price: 22008.3,
    order_qty: 0.221,
    traded_price: 0,
    traded_qty: 0,
    traded_value: 0,
    left_qty: 0.221,
    is_post_only: false,
    is_reduce_only: false,
    is_price_protected: false,
    trigger_id: null,
    trigger: null,
    order_time: '2023-03-08T19:27:29',
    filled_time: null,
    cancel_time: null
  },
  {
    id: 203525,
    ticker_id: 1,
    member_id: 84521,
    order_id: 'F8452116783036459226677',
    margin_mode: 0,
    direction: 0,
    position: 0,
    order_type: 1,
    status: 0,
    tif_mode: 0,
    trigger_type: 0,
    trigger_direction: 0,
    ticker: 'TBTCTUSDT',
    coin_symbol: 'TBTC',
    base_symbol: 'TUSDT',
    leverage: 125,
    order_price: 22008.3,
    order_qty: 0.189,
    traded_price: 0,
    traded_qty: 0,
    traded_value: 0,
    left_qty: 0.189,
    is_post_only: false,
    is_reduce_only: false,
    is_price_protected: false,
    trigger_id: null,
    trigger: null,
    order_time: '2023-03-08T19:27:26',
    filled_time: null,
    cancel_time: null
  },
  {
    id: 203524,
    ticker_id: 1,
    member_id: 84521,
    order_id: 'F8452116783036434457941',
    margin_mode: 0,
    direction: 0,
    position: 0,
    order_type: 1,
    status: 0,
    tif_mode: 0,
    trigger_type: 0,
    trigger_direction: 0,
    ticker: 'TBTCTUSDT',
    coin_symbol: 'TBTC',
    base_symbol: 'TUSDT',
    leverage: 125,
    order_price: 22008.4,
    order_qty: 0.141,
    traded_price: 0,
    traded_qty: 0,
    traded_value: 0,
    left_qty: 0.141,
    is_post_only: false,
    is_reduce_only: false,
    is_price_protected: false,
    trigger_id: null,
    trigger: null,
    order_time: '2023-03-08T19:27:23',
    filled_time: null,
    cancel_time: null
  }
]

*/