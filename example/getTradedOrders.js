const Bitmusa = require('../bitmusa');
const bitmusa = new Bitmusa('a3f74de1-b23b-4758-9621-b4925a3876bd');

(async function(){
    bitmusa.setBaseURL("https://qa-api.teamneonex.com");
    bitmusa.getTradedOrders(1,10,"BTC/USDT").then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });


})();

/*

{
  content: [
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
    ...
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


{ data: null, code: 0, message: 'success' }
{ data: null, code: 500, message: 'Order Status: Not Trading' }
{ data: null, code: 500, message: 'UNKNOWN' }

*/