const Bitmusa = require('node-bitmusa-api');
const bitmusa = new Bitmusa('dummy_key');
const util = require('util');

(async function(){

    /*
    targetSymbol - coinSymbol (ex: TBTC)
    baseSymbol - baseSymbol (ex: TUSDT)
    size - 50
    start_time - timestamp millisecond
    end_time - timestamp millisecond
    */

    bitmusa.fetchFutureTrades("TBTC","TUSDT").then(result => {
        console.log(util.inspect(result, { showHidden: false, depth: null }));
    }).catch(err => {
        console.log(err);
    });


})();

/*
[
  {
    margin_mode: 0,
    direction: 0,
    position: 0,
    leverage: 125,
    price: 22076.9,
    traded_qty: 0.005,
    traded_value: 110.3845,
    trading_fee: 0.0220769,
    role: 1,
    profit_and_loss: 0,
    id: 198236,
    ticker_id: 1,
    member_id: 84521,
    order_id: 'F8452116783086288567993',
    order_type: 1,
    opposite_order_id: 'F8452216783086417598857',
    ticker: 'TBTCTUSDT',
    symbol: 'TUSDT',
    income_symbol: 'TBTC',
    transaction_time: '2023-03-08T20:50:41'
  },
  {
    margin_mode: 0,
    direction: 0,
    position: 0,
    leverage: 125,
    price: 22077.4,
    traded_qty: 0.189,
    traded_value: 4172.6286,
    trading_fee: 0.83452572,
    role: 1,
    profit_and_loss: 0,
    id: 198234,
    ticker_id: 1,
    member_id: 84521,
    order_id: 'F8452116783086390404662',
    order_type: 1,
    opposite_order_id: 'F8452216783086397674515',
    ticker: 'TBTCTUSDT',
    symbol: 'TUSDT',
    income_symbol: 'TBTC',
    transaction_time: '2023-03-08T20:50:39'
  },
  {
    margin_mode: 0,
    direction: 0,
    position: 0,
    leverage: 125,
    price: 22077.9,
    traded_qty: 0.177,
    traded_value: 3907.7883,
    trading_fee: 1.56311532,
    role: 0,
    profit_and_loss: 0,
    id: 198231,
    ticker_id: 1,
    member_id: 84521,
    order_id: 'F8452116783086326233354',
    order_type: 1,
    opposite_order_id: 'F8452216783086109409369',
    ticker: 'TBTCTUSDT',
    symbol: 'TUSDT',
    income_symbol: 'TBTC',
    transaction_time: '2023-03-08T20:50:32'
  },
  {
    margin_mode: 0,
    direction: 0,
    position: 0,
    leverage: 125,
    price: 22076.7,
    traded_qty: 0.169,
    traded_value: 3730.9623,
    trading_fee: 1.49238492,
    role: 0,
    profit_and_loss: 0,
    id: 198229,
    ticker_id: 1,
    member_id: 84521,
    order_id: 'F8452116783086288567993',
    order_type: 1,
    opposite_order_id: 'F8452216783086197765743',
    ticker: 'TBTCTUSDT',
    symbol: 'TUSDT',
    income_symbol: 'TBTC',
    transaction_time: '2023-03-08T20:50:28'
  },
  {
    margin_mode: 0,
    direction: 0,
    position: 0,
    leverage: 125,
    price: 22076.7,
    traded_qty: 0.037,
    traded_value: 816.8379,
    trading_fee: 0.32673516,
    role: 0,
    profit_and_loss: 0,
    id: 198227,
    ticker_id: 1,
    member_id: 84521,
    order_id: 'F8452116783086288567993',
    order_type: 1,
    opposite_order_id: 'F8452216783086167214800',
    ticker: 'TBTCTUSDT',
    symbol: 'TUSDT',
    income_symbol: 'TBTC',
    transaction_time: '2023-03-08T20:50:28'
  }
]


*/