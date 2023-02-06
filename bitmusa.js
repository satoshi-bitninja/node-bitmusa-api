var request = require('request');
const constants = require('./constants');
const querystring = require('querystring');



function getRequestOptions(endPoint, method, parameter = null)
{
    var param = querystring.stringify(parameter);
    param = param.replace("%2F","/");
    var url = constants.baseUrl.BASE + endPoint + "?" + param;

    var headers = {
        'x-auth-token': constants.auth.KEY
    };

    var options = {
        url: url,
        method: method,
        timeout: 10000,
        headers: headers
    };

    //console.log(options);

    return options;
}

function buildRequest(endPoint, method, data = null, key = null)
{
    var url = constants.baseUrl.BASE + endPoint;

    var authKey = key;
    if (!authKey) authKey = constants.auth.KEY;
    var headers = {
        'x-auth-token': authKey
    };

    var options = {
        url: url,
        method: method,
        timeout: 10000,
        headers: headers,
        body: data,
        json: true
    };

    console.log(options);

    return options;
}





function getUsersAssetWallet() {

    return new Promise((resolve, reject) => {
        request(getRequestOptions("/users/asset/wallet", 'POST'), (error, response, body) => {
            if (error)
                reject(error);
            else{
                //console.log(body);
                resolve(JSON.parse(body));
            }
        });
    });
}

function addOrder(symbol, price, amount, direction, type) {

    return new Promise((resolve, reject) => {
        var opts = { 
            symbol : symbol, 
            price : price, 
            amount : amount,
            type : type,
            direction : direction
        };

        request(getRequestOptions("/exchange/order/add", 'POST', opts), (error, response, body) => {
            if (error)
                reject(error);
            else{
                //console.log(body);
                resolve(JSON.parse(body));
            }
        });
    });
}

function futureOrder(symbol, price, amount, direction, type) {

    return new Promise((resolve, reject) => {
        var opts = { 
            ticker : symbol, 
            direction : 0, // 0-open, 1-close 
            margin_mode : 0, // 0 iso, 1 cross
            position : direction,
            order_type : 1,
            leverage : 125,
            order_price : price,
            order_qty : amount
        };

        

        request(buildRequest("/future-order/", 'POST', opts), (error, response, body) => {
            if (error)
                reject(error);
            else{
                console.log(body);
                resolve((body));
            }
        });
    });
}

function futureOrderSell(symbol, price, amount, direction, type) {

    return new Promise((resolve, reject) => {
        var opts = { 
            ticker : symbol, 
            direction : 0, // 0-open, 1-close 
            margin_mode : 0, // 0 iso, 1 cross
            position : 1,
            order_type : 1,
            leverage : 125,
            order_price : price,
            order_qty : amount
        };

        

        request(buildRequest("/future-order/", 'POST', opts,constants.auth.KEY_FUTURE_BUY), (error, response, body) => {
            if (error)
                reject(error);
            else{
                console.log(body);
                resolve((body));
            }
        });
    });
}

function futureOrderBuy(symbol, price, amount, direction, type) {

    return new Promise((resolve, reject) => {
        var opts = { 
            ticker : symbol, 
            direction : 0, // 0-open, 1-close 
            margin_mode : 0, // 0 iso, 1 cross
            position : 0,
            order_type : 1,
            leverage : 125,
            order_price : price,
            order_qty : amount
        };

        

        request(buildRequest("/future-order/", 'POST', opts,constants.auth.KEY_FUTURE_SELL), (error, response, body) => {
            if (error)
                reject(error);
            else{
                console.log(body);
                resolve((body));
            }
        });
    });
}

function futurePositionSellCloseAll(symbol) {

    return new Promise((resolve, reject) => {
        var opts = { 
            ticker : symbol
        };

        

        request(buildRequest("/future-position/close_all", 'PUT', opts, constants.auth.KEY_FUTURE_BUY), (error, response, body) => {
            if (error)
                reject(error);
            else{
                console.log(body);
                resolve((body));
            }
        });
    });
}

function futurePositionBuyCloseAll(symbol) {

    return new Promise((resolve, reject) => {
        var opts = { 
            ticker : symbol
        };

        

        request(buildRequest("/future-position/close_all", 'PUT', opts,constants.auth.KEY_FUTURE_SELL), (error, response, body) => {
            if (error)
                reject(error);
            else{
                console.log(body);
                resolve((body));
            }
        });
    });
}

function futureOrderBookSell(symbol) {

    return new Promise((resolve, reject) => {
        var opts = { 
            ticker : symbol
        };

        

        request(buildRequest("/future-orderbook/?ticker="+symbol, 'GET', opts, constants.auth.KEY_FUTURE_BUY), (error, response, body) => {
            if (error)
                reject(error);
            else{
                //console.log(body["sell"]);
                resolve((body["sell"]));
            }
        });
    });
}

function futureOrderBookBuy(symbol) {

    return new Promise((resolve, reject) => {
        var opts = { 
            ticker : symbol
        };

        
        request(buildRequest("/future-orderbook/?ticker="+symbol, 'GET', opts, constants.auth.KEY_FUTURE_SELL), (error, response, body) => {
            if (error)
                reject(error);
            else{
                //console.log(body["sell"]);
                resolve((body["buy"]));
            }
        });
    });
}


function cancelOrder(orderId) {

    return new Promise((resolve, reject) => {

        request(getRequestOptions("/exchange/order/cancel/"+ orderId, 'POST'), (error, response, body) => {
            if (error)
                reject(error);
            else{
                //console.log(body);
                resolve(JSON.parse(body));
            }
        });
    });
}


function getOpenOrder(page = 1, pageSize = 10) {

    return new Promise((resolve, reject) => {
        var opts = { 
            pageNo : page, 
            pageSize : pageSize
        };

        request(getRequestOptions("/exchange/order/personal/current", 'POST', opts), (error, response, body) => {
            if (error)
                reject(error);
            else{
                console.log(body);
                resolve(JSON.parse(body));
            }
        });
    });
}

 





module.exports ={
    futureOrder,
    futureOrderBuy,
    futureOrderSell,
    futureOrderBookSell,
    futureOrderBookBuy,
    futurePositionBuyCloseAll,
    futurePositionSellCloseAll,
    getUsersAssetWallet,
    addOrder,
    cancelOrder,
    getOpenOrder
};
