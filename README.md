# node-bitmusa-api
node-bitmusa-api is a node.js module for interacting with the bitmusa API. 

## Bitmusa Introduction

Bitmusa, a cryptocurrency exchange, was founded in 2022 and is a platform that supports cryptocurrency trading around the world. The exchange provides some functions as an API for stable trading, and the Bitmusa API can be used with various cryptocurrency exchanges.

## Features of the Bitmusa API

Bitmusa API has the following features.

### 1. Stable trading environment

The Bitmusa API provides a stable trading environment. Since this API provides some of the features of the exchange, you can trade safely without having to access the exchange directly. In addition, Bitmusa provides multi-signature features to protect your transactions.

### 2. Wide range of features

The Bitmusa API offers a wide range of features. In addition to checking the price information provided by the exchange or viewing the trading history, you can also create automated trading programs through the Bitmusa API to process trades automatically. The Bitmusa API also provides real-time price information, allowing users to keep up with market trends instantly.

### 3. Easy to use

The Bitmusa API is easy to use. You can easily understand and use the API by referring to the API documentation provided by the exchange. Developers can also use the Bitmusa API easily because it is available in various programming languages. The Bitmusa API allows you to call the API in various programming languages using the REST API, and you can also receive real-time price information using the WebSocket API.

### 4. Security

The Bitmusa API is highly secured. You need to use the API using an API key, and it is also important to manage the API key. Bitmusa API provides the ability to create and modify API keys, and it is also possible to expire API keys.

### 5. Support for multiple cryptocurrencies

The Bitmusa API supports a wide range of cryptocurrencies. It supports Bitcoin, Ethereum, Tron, EOS, Ripple, and many other cryptocurrencies, allowing users to trade a wide variety of cryptocurrencies.

## Utilizing the Bitmusa API

The Bitmusa API can be utilized in a variety of ways. Depending on the kind of service you want to develop, the API can be utilized in different ways. For example, if you want to create an automated cryptocurrency trading program, you can use the Bitmusa API to process trades automatically. If you want to collect cryptocurrency price information, you can use the Bitmusa API to get price information from exchanges. You can also use the Bitmusa API to take advantage of the various features provided by exchanges.

## Conclusion

The Bitmusa API provides a reliable trading environment and is a feature-rich and easy-to-use API. By utilizing the Bitmusa API, you can develop a variety of services and process cryptocurrency transactions more efficiently. In addition, the Bitmusa API supports a wide range of cryptocurrencies, allowing users to trade a variety of cryptocurrencies. Therefore, the Bitmusa API is a very useful API for users of cryptocurrency exchanges.


# quick start

### 1. install node-bitmusa-api
```bash
npm install node-bitmusa-api
```

### 2. Usage
```js
// 1. create Bitmusa Client
const Bitmusa = require('node-bitmusa-api');
const bitmusa = new Bitmusa("init_key");

// 2. signIn
bitmusa.signIn("[id]","[password]").then(result => {
    console.log(result);
}).catch(err => {
    console.log(err);
});

// 3. set AuthToken from signIn api's json result 
bitmusa.setAuthToken("[auth_token]");

// 4. balance
bitmusa.balance().then(result => {
    console.log(result);
}).catch(err => {
    console.log(err);
});

// 5. order
bitmusa.order("BUY", "BTC/USDT","0.0001","LIMIT_PRICE", "23500.0").then(result => {
    console.log(result);
}).catch(err => {
    console.log(err);
});

// 6. cancel
bitmusa.cancel("E2443456789").then(result => {
    console.log(result);
}).catch(err => {
    console.log(err);
});

// 7. openOrder's List
bitmusa.openOrders(1, 10).then(result => {
    console.log(result);
}).catch(err => {
    console.log(err);
});
```



# API Reference

### Common
- signIn() : Gets the authentication key.
- getUserInfo(): Retrieves user information. [not supported]
- getServerStatus() : Gets the exchange server status. [not supported]

### Spot
- createOrder(): Creates an order.
- createSellOrder(): Creates an sell order.
- createBuyOrder(): Creates an buy order.
- cancelOrder(): Cancels an order.
- getOrder(): Gets details of a specific order.
- getOpenOrderList(): Gets a list of open orders.
- getOrderList() : Gets the list of orders in a specific market.
- getTradeList() : Retrieves the list of trades in a specific market.
- getOrderBook() : Retrieves order book information for a specific market.
- getTicker() : Gets the current ticker information for a specific market.
- getRecentTrades(): Retrieves the recent trades of a specific market.
- getMarketDetail() : Gets the details of a specific market.
- getAssetHistory() : Retrieves deposit and withdrawal history.
- getAssetBalance() : Retrieves the balance of a held asset.
- getAssetList(): Gets the list of assets held.
- getMarkets(): Gets the list of available markets.
- requestWithdrawal(): Requests a withdrawal.
- getDepositAddress(): Creates a deposit address.
- getFees() : Retrieves transaction fee information.

### Future
- createFutureOrder(): Creates a future order.
- createFutureSellOrder(): Creates a future sell order.
- createFutureBuyOrder(): Creates a futures buy order.
- closeFutureSellOrder(): Close a future sell order.
- closeFutureBuyOrder(): Close a future buy order.
- cancelFutureOrder(): Cancels a futures order.
- getFutureOrderPosition(): Gets details of a specific futures order position.
- getFutureOpenOrderList(): Gets a list of open futures orders.
- getFutureOrderList() : Gets a list of futures orders in a specific market.
- getFutureTradeList() : Retrieves a list of futures trades in a specific market.
- getFutureOrderBook() : Retrieves futures price information for a specific market.
- getFutureTicker() : Retrieves the current futures ticker information for a specific market.
- getFutureRecentTrades(): Retrieves the recent futures transaction history of a specific market.
- getFutureMarketDetail(): Gets the details of futures transactions in a specific market.
- getFutureAssetHistory(): Gets the history of futures account deposits and withdrawals.
- getFutureAssetBalance(): Gets the balance of assets held in the futures account.
- getFutureAssetList(): Retrieves the list of futures account assets held.
- getFutureMarkets() : Gets a list of available futures markets.
- requestFutureWithdrawal() : Requests a withdrawal from a futures account.
- getFutureFees(): Retrieves futures trading fee information.

# Example

## 1. signIn
### [!caution] this is private api. so you must grant permission to use this api. send email to support@bitmusa.com
```js
bitmusa.signIn("[id]","[password]").then(result => {
    console.log(result);
}).catch(err => {
    console.log(err);
});
```
### OK
```js
{
  data: {
    id: 1234,
    email: 'test@test.com',
    country: '1',
    phone: '34151234',
    token: '0ec14b76-27b3-4bad-940a-044c116f0cbe',
    googleState: null,
    status: null,
    googleKey: null,
    nickname: '1234'
  },
  code: 0,
  message: 'SUCCESS'
}
```
### Fail
```js
{ 
    data: null, 
    code: 20006, 
    message: 'Incorrect username or password' 
}
```