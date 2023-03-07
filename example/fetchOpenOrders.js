const Bitmusa = require('node-bitmusa-api');
const bitmusa = new Bitmusa('dummy_key');

(async function(){
    bitmusa.fetchOpenOrders(1, 10).then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });
 

})();

/*

{
  content: [
    {
      orderId: 'E167714502789260',
      memberId: 73642,
      symbol: 'BTC/USDT',
      coinSymbol: 'BTC',
      baseSymbol: 'USDT',
      status: 'TRADING',
      direction: 'BUY',
      type: 'LIMIT_PRICE',
      price: 1,
      amountSymbol: 'BTC',
      amountType: 'COIN',
      amount: 1,
      tradedAmount: 0,
      turnover: 0,
      time: 1677145027892,
      completedTime: null,
      canceledTime: null,
      useDiscount: '0',
      orderResource: 'CUSTOMER',
      detail: [],
      completed: false
    },
    ...
    ],
  pageable: {
    sort: { empty: false, sorted: true, unsorted: false },
    offset: 0,
    pageNumber: 0,
    pageSize: 10,   // it is true page number
    paged: true,
    unpaged: false
  },
  last: false,      // it is true when paging end
  totalElements: 29781,
  totalPages: 2979, // 1~2979
  size: 10,
  number: 0,        // it is not page number
  sort: { empty: false, sorted: true, unsorted: false },
  first: true,
  numberOfElements: 10,
  empty: false
}


{ data: null, code: 0, message: 'success' }
{ data: null, code: 500, message: 'Order Status: Not Trading' }
{ data: null, code: 500, message: 'UNKNOWN' }

*/