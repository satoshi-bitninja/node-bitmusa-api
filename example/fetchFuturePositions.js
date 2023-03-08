const Bitmusa = require('node-bitmusa-api');
const bitmusa = new Bitmusa('dummy_key');

(async function(){

    bitmusa.fetchFuturePositions("TBTC","TUSDT").then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });


})();

/*
[
  {
    margin_mode: 0,
    value: 2343099.6096,
    position_margin: 2344974.08911066,
    return_liquid_margin: null,
    position: 1,
    entry_price: 21999.48932558,
    extra_margin: 0,
    id: 136,
    status: 0,
    liquid_price: 43888.98120287,
    margin_gap: -0.00017648,
    ticker: 'TBTCTUSDT',
    bankruptcy_price: 43998.97864949,
    close_fee: 1874.4796876,
    member_id: 84522,
    coin_symbol: 'TBTC',
    initial_margin: 2343099.60959954,
    take_profit_price: 0,
    entry_time: '2023-03-08T18:16:32',
    base_symbol: 'TUSDT',
    maintenance_margin: 11715.49804799,
    close_time: null,
    leverage: 1,
    liquid_margin: 21889.49187729,
    stop_loss_price: 0,
    ticker_id: 1,
    qty: 106.507,
    adl: 0
  }
]

*/