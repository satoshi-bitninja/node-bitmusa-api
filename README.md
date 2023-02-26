# node-bitmusa-api
node-bitmusa-api is a node.js module for interacting with the bitmusa API.

## quick start

1. install node-bitmusa-api
```bash
npm install node-bitmusa-api
```

2. functions
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


