const Bitmusa = require('node-bitmusa-api');
const bitmusa = new Bitmusa('node-bitmusa-api');
const util = require('util');

(async function(){


    bitmusa.fetchFutureRecentTrades("TBTC","TUSDT",5).then(result => {
        console.log(util.inspect(result, { showHidden: false, depth: null }));
    }).catch(err => {
        console.log(err);
    });


})();

/*

[
  {
    id: ':core.db.redis.model.models.FutureTrade:01GV1G2DFAKJ3GF7H9GX0T38DK',
    payload: null,
    traded_time: '1678308880628',
    pk: '01GV1G2DFAKJ3GF7H9GX0T38DK',
    ticker: 'TBTCTUSDT',
    price: '22074.1',
    qty: '0.125',
    value: '2759.2625',
    position: '0'
  },
  {
    id: ':core.db.redis.model.models.FutureTrade:01GV1G2CXF776F8A6SGMDBSV7P',
    payload: null,
    traded_time: '1678308880570',
    pk: '01GV1G2CXF776F8A6SGMDBSV7P',
    ticker: 'TBTCTUSDT',
    price: '22073.5',
    qty: '0.023',
    value: '507.6905',
    position: '0'
  },
  {
    id: ':core.db.redis.model.models.FutureTrade:01GV1G2735EGQNCGD6HC1P9YGW',
    payload: null,
    traded_time: '1678308874027',
    pk: '01GV1G2735EGQNCGD6HC1P9YGW',
    ticker: 'TBTCTUSDT',
    price: '22073.5',
    qty: '0.15',
    value: '3311.025',
    position: '0'
  },
  {
    id: ':core.db.redis.model.models.FutureTrade:01GV1G26GVHD64SHM938WRCETH',
    payload: null,
    traded_time: '1678308873983',
    pk: '01GV1G26GVHD64SHM938WRCETH',
    ticker: 'TBTCTUSDT',
    price: '22072.5',
    qty: '0.05',
    value: '1103.625',
    position: '0'
  },
  {
    id: ':core.db.redis.model.models.FutureTrade:01GV1G24KKBDHTH8Y4PK562D28',
    payload: null,
    traded_time: '1678308871537',
    pk: '01GV1G24KKBDHTH8Y4PK562D28',
    ticker: 'TBTCTUSDT',
    price: '22072.5',
    qty: '0.117',
    value: '2582.4825',
    position: '0'
  }
]



*/