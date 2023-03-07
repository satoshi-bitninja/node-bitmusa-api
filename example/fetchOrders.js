const Bitmusa = require('node-bitmusa-api');
const bitmusa = new Bitmusa('dummy_key');

(async function(){
    bitmusa.setTimeout(10000);
    bitmusa.fetchOrders(1,10,"BTC","USDT").then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });


})();

/*

{
  content: [
    {
      orderId: 'E167732311527690',
      memberId: 73642,
      symbol: 'BTC/USDT',
      coinSymbol: 'BTC',
      baseSymbol: 'USDT',
      status: 'COMPLETED',
      direction: 'BUY',
      type: 'LIMIT_PRICE',
      price: 22939.37,
      amountSymbol: 'BTC',
      amountType: 'COIN',
      amount: 0.00001,
      tradedAmount: 0.00001,
      turnover: 0.2293937,
      time: 1677323115276,
      completedTime: 1677323116938,
      canceledTime: null,
      useDiscount: '0',
      orderResource: 'CUSTOMER',
      detail: null,
      completed: true
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
  totalElements: 1757868,
  totalPages: 175787,
  size: 10,
  number: 0,
  sort: { empty: false, sorted: true, unsorted: false },
  first: true,
  numberOfElements: 10,
  empty: false
}


{ data: null, code: 500, message: 'UNKNOWN' }

*/