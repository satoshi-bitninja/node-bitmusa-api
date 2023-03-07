const Bitmusa = require('node-bitmusa-api');
const bitmusa = new Bitmusa('dummy_key');

(async function(){
    bitmusa.setTimeout(10000);
    bitmusa.fetchTrades(1,10,"BTC","USDT").then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });


})();

/*

{
  content: [
    {
      tradeId: '79229230',
      tradeTime: 1677534931614,
      memberId: 73642,
      symbol: 'BTC/USDT',
      coinSymbol: 'BTC',
      baseSymbol: 'USDT',
      direction: 'SELL',
      type: 'MARKET_PRICE',
      role: 'TAKER',
      price: 23369.6,
      tradedAmount: 0.0001,
      turnover: 2.33696,
      orderId: 'E167753493159779',
      feeSymbol: 'USDT',
      fee: 0
    },
    {
      tradeId: '79228415',
      tradeTime: 1677534841941,
      memberId: 73642,
      symbol: 'BTC/USDT',
      coinSymbol: 'BTC',
      baseSymbol: 'USDT',
      direction: 'BUY',
      type: 'LIMIT_PRICE',
      role: 'TAKER',
      price: 23374.62,
      tradedAmount: 0.0001,
      turnover: 2.337462,
      orderId: 'E167753484192188',
      feeSymbol: 'BTC',
      fee: 0
    },
    {
      tradeId: '79224995',
      tradeTime: 1677534575823,
      memberId: 73642,
      symbol: 'BTC/USDT',
      coinSymbol: 'BTC',
      baseSymbol: 'USDT',
      direction: 'BUY',
      type: 'LIMIT_PRICE',
      role: 'TAKER',
      price: 23387.96,
      tradedAmount: 0.0001,
      turnover: 2.338796,
      orderId: 'E167753457580720',
      feeSymbol: 'BTC',
      fee: 0
    },
    {
      tradeId: '79224047',
      tradeTime: 1677534522477,
      memberId: 73642,
      symbol: 'BTC/USDT',
      coinSymbol: 'BTC',
      baseSymbol: 'USDT',
      direction: 'BUY',
      type: 'LIMIT_PRICE',
      role: 'TAKER',
      price: 23371.82,
      tradedAmount: 0.0001,
      turnover: 2.337182,
      orderId: 'E167753452245878',
      feeSymbol: 'BTC',
      fee: 0
    },
    {
      tradeId: '79215040',
      tradeTime: 1677533869797,
      memberId: 73642,
      symbol: 'BTC/USDT',
      coinSymbol: 'BTC',
      baseSymbol: 'USDT',
      direction: 'SELL',
      type: 'MARKET_PRICE',
      role: 'TAKER',
      price: 23371.64,
      tradedAmount: 0.00009,
      turnover: 2.1034476,
      orderId: 'E167753386977641',
      feeSymbol: 'USDT',
      fee: 0
    },
    {
      tradeId: '79215038',
      tradeTime: 1677533869796,
      memberId: 73642,
      symbol: 'BTC/USDT',
      coinSymbol: 'BTC',
      baseSymbol: 'USDT',
      direction: 'SELL',
      type: 'MARKET_PRICE',
      role: 'TAKER',
      price: 23371.83,
      tradedAmount: 0.00001,
      turnover: 0.2337183,
      orderId: 'E167753386977641',
      feeSymbol: 'USDT',
      fee: 0
    },
    {
      tradeId: '79210255',
      tradeTime: 1677533560987,
      memberId: 73642,
      symbol: 'BTC/USDT',
      coinSymbol: 'BTC',
      baseSymbol: 'USDT',
      direction: 'BUY',
      type: 'LIMIT_PRICE',
      role: 'TAKER',
      price: 23361.84,
      tradedAmount: 0.0001,
      turnover: 2.336184,
      orderId: 'E167753356096693',
      feeSymbol: 'BTC',
      fee: 0
    },
    {
      tradeId: '76305355',
      tradeTime: 1677323278282,
      memberId: 73642,
      symbol: 'BTC/USDT',
      coinSymbol: 'BTC',
      baseSymbol: 'USDT',
      direction: 'BUY',
      type: 'LIMIT_PRICE',
      role: 'TAKER',
      price: 22948.72,
      tradedAmount: 0.00005,
      turnover: 1.147436,
      orderId: 'E167732327826445',
      feeSymbol: 'BTC',
      fee: 0
    },
    {
      tradeId: '76303022',
      tradeTime: 1677323116700,
      memberId: 73642,
      symbol: 'BTC/USDT',
      coinSymbol: 'BTC',
      baseSymbol: 'USDT',
      direction: 'BUY',
      type: 'LIMIT_PRICE',
      role: 'MAKER',
      price: 22939.37,
      tradedAmount: 0.00001,
      turnover: 0.2293937,
      orderId: 'E167732311527690',
      feeSymbol: 'BTC',
      fee: 0
    },
    {
      tradeId: '76302903',
      tradeTime: 1677323114730,
      memberId: 73642,
      symbol: 'BTC/USDT',
      coinSymbol: 'BTC',
      baseSymbol: 'USDT',
      direction: 'SELL',
      type: 'LIMIT_PRICE',
      role: 'TAKER',
      price: 22940.26,
      tradedAmount: 0.00001,
      turnover: 0.2294026,
      orderId: 'E167732311471051',
      feeSymbol: 'USDT',
      fee: 0
    }
  ],
  pageable: {
    sort: { empty: false, sorted: true, unsorted: false },
    offset: 0,
    pageNumber: 0,
    pageSize: 10,
    paged: true,
    unpaged: false
  },
  last: false,
  totalElements: 1907153,
  totalPages: 190716,
  size: 10,
  number: 0,
  sort: { empty: false, sorted: true, unsorted: false },
  first: true,
  numberOfElements: 10,
  empty: false
}


{ data: null, code: 500, message: 'UNKNOWN' }

*/