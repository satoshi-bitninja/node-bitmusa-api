const Bitmusa = require('node-bitmusa-api');
const bitmusa = new Bitmusa('dummy_key');

(async function(){


    bitmusa.getBalance("BTC").then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });


})();

/*
{
  id: 1263,
  memberId: 73642,
  coin: {
    name: 'Bitcoin',
    nameCn: 'Bitcoin',
    unit: 'BTC',
    status: 0,
    minTxFee: 0.0002,
    maxTxFee: 0.0002,
    cnyRate: 0,
    usdRate: 23433.15,
    enableRpc: 1,
    sort: 1,
    canSend: 1,
    canWithdraw: 1,
    canRecharge: 1,
    canTransfer: 0,
    canAutoWithdraw: 0,
    withdrawScale: 4,
    withdrawThreshold: 0.1,
    minWithdrawAmount: 0.002,
    maxWithdrawAmount: 10,
    minRechargeAmount: 0.000001,
    isPlatformCoin: 1,
    isToken: 0,
    hasLegal: false,
    allBalance: null,
    coldWalletAddress: '',
    hotAllBalance: null,
    blockHeight: null,
    minerFee: null,
    infolink: '',
    information: 'BTC',
    accountType: 0,
    depositAddress: 'mi1Q3VpBYr7XJL9pP51Vpw1WLc1eXSQxzX',
    memoAdjust: null,
    scanTxidWeburl: 'https://www.blockchain.com/btc/tx/',
    scanAddressWeburl: 'https://www.blockchain.com/btc/address/',
    visible: 1,
    testMode: 0,
    networkCoins: null,
    icon: 'https://qa-static.neonexteam.com/image/coin/BTC.svg',
    defaultIcon: 'https://qa-static.neonexteam.com/image/coin/default.svg',
    spotTradable: null
  },
  balance: 231.46778,
  frozenBalance: 0.10086,
  lockedBalance: 0,
  toReleased: 0,
  networkCoin: null,
  address: '',
  tag: null,
  memo: null,
  isLock: 0
}


{ code: 4000, message: 'need sign in' }

*/