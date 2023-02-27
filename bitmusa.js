const axios = require('axios');
const request = require('request');
const querystring = require('querystring');

class Bitmusa {
    constructor(options = {}) {
        if (typeof options === 'string') {
            this.options = {
                ...this.getDefaultOptions(),
                ...{ authKey: options }
            };
        } else if (typeof options == 'object') {
            this.options = {
                ...this.getDefaultOptions(),
                ...options
            };
        } else {
            this.options = this.getDefaultOptions();;
        }
    }

    getDefaultOptions() {
        return {
            baseURL: 'https://www.bitmusa.com/api',
            timeout: 1000
        }
    }

    setBaseURL(baseURL) {
        this.options.baseURL = baseURL;
    }

    getBaseURL() {
        return this.options.baseURL;
    }

    setAuthKey(authKey) {
        this.options.authKey = authKey;
    }

    getAuthKey() {
        return this.options.authKey;
    }

    setTimeout(timeout) {
        this.options.timeout = timeout;
    }

    getTimeout() {
        return this.options.timeout;
    }

    async requestAPI(path, method, parameters = null) {
        method = method.toUpperCase();
        var options = {
            method: method,
            url: `${this.options.baseURL}${path}`,
            headers: {
                'x-auth-token': this.options.authKey,
                'Content-Type': 'application/json'
            },
            data: parameters,
            responseType: 'json',
            timeout: this.options.timeout
        };
        if (method === 'GET') options = Object.assign(options, { params: parameters });
        try {
            const response = await axios.request(options);
            return response;
        } catch (error) {
            throw new Error(`Failed to requestAPI(${path}): ${error.message}`);
        }

    }


    async signIn(email, password) {
        const funcName = '[signIn]:';

        if (!email) throw new Error(`${funcName} email is blank`);
        if (!password) throw new Error(`${funcName} password is blank`);

        try {
            const parameters = {
                email: email,
                password: password
            }
            const response = await this.requestAPI('/users/v1/signin', 'post', parameters);
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            //console.log(json);
            if (json.code !== 0) {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            }

            return json;
        } catch (error) {            
            throw new Error(`${error.message}`);
        }
    }

    async createOrder(direction, targetSymbol, baseSymbol = 'USDT', amount, type = "MARKET", price = null) {
        const funcName = '[createOrder]:';

        if (!direction) throw new Error(`${funcName} direction is blank`);
        if (!targetSymbol) throw new Error(`${funcName} targetSymbol is blank`);
        if (!amount) throw new Error(`${funcName} amount is blank`);

        direction = direction.toUpperCase();
        const pair = `${targetSymbol}/${baseSymbol}`;

        var parameters = {
            symbol: pair,
            amount: `${amount}`,
            direction: direction,
            type: type,
            price: `${price}`,
        };
        if (type.toUpperCase().indexOf('LIMIT') >= 0) {
            parameters = Object.assign(parameters, { type: 'LIMIT_PRICE'});
        } else {
            parameters = Object.assign(parameters, { type: 'MARKET_PRICE', price: "0" });
        }
        console.log(parameters);
        try {
            const response = await this.requestAPI('/exchange/order/add', 'get', parameters);
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            console.log(json);
            if (json.code !== 0) {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            }

            return json;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }


    async cancelOrder(orderId) {
        const funcName = '[cancelOrder]:';

        if (!orderId) throw new Error(`${funcName} orderId is blank`);

        try {
            const response = await this.requestAPI(`/exchange/order/cancel/${orderId}`, 'post');
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            console.log(json);
            if (json.code !== 0) {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            }

            return json;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    async getOpenedOrders(pageNo = 1, pageSize = 10) {
        const funcName = '[getOpenedOrders]:';

        var parameters = {
            pageNo : pageNo, // 1 is start, not 0
            pageSize : pageSize,
            //symbol : "BTC/USDT" // not supported

        }
        try {
            const response = await this.requestAPI('/exchange/order/personal/current', 'get', parameters);
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            console.log(json);
            if (json.code !== 0) {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            }

            return json;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    async getOrderedOrders(pageNo = 1, pageSize = 10, pair = "") {
        const funcName = '[getOpenedOrders]:';

        var parameters = {
            pageNo : pageNo, // 1 is start, not 0
            pageSize : pageSize,
        }
        if (pair) parameters = 
        try {
            const response = await this.requestAPI('/exchange/order/personal/current', 'get', parameters);
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            console.log(json);
            if (json.code !== 0) {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            }

            return json;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }
    



    async balance() {
        try {
            const options = this.buildRequestOptions('/users/asset/wallet', 'GET');
            const response = await axios(options);
            const json = response.data;
            if (typeof json.code === 'number' && json.code !== 0) {
                throw new Error(json.message);
            }
            return json;
        } catch (error) {
            throw new Error(`Failed to balance: ${error.message}`);
        }
    }


    buy(pair, amount, type = null, price = null) {
        var options = {
            symbol: pair,
            amount: amount + "",
            direction: 'BUY'
        };

        if ((type === null) || (type === 'MARKET_PRICE')) {
            options = Object.assign(options, { type: 'MARKET_PRICE', price: "0" });
        }

        if (type === 'LIMIT_PRICE') {
            // if price is null throw error
            if (price === null) {
                throw new Error('[buy] price is null');
            }

            options = Object.assign(options, { type: 'LIMIT_PRICE', price: price + "" });
        }

        return new Promise((resolve, reject) => {
            request(this.buildRequestOptions("/exchange/order/add", 'GET', options), (error, response, body) => {
                if (error)
                    reject(error);
                else {
                    if (response.statusCode !== 200) {
                        reject("statusCode : " + response.statusCode);
                    }

                    let json = typeof body === 'object' ? body : JSON.parse(body);
                    if (json.code !== 0) {
                        reject(json);
                    } else {
                        resolve(json);
                    }
                }
            });
        });
    }

    sell(pair, amount, type = null, price = null) {
        var options = {
            symbol: pair,
            amount: amount + "",
            direction: 'SELL'
        };

        if ((type === null) || (type === 'MARKET_PRICE')) {
            options = Object.assign(options, { type: 'MARKET_PRICE', price: "0" });
        }

        if (type === 'LIMIT_PRICE') {
            // if price is null throw error
            if (price === null) {
                throw new Error('[sell] price is null');
            }

            options = Object.assign(options, { type: 'LIMIT_PRICE', price: price + "" });
        }

        return new Promise((resolve, reject) => {
            request(this.buildRequestOptions("/exchange/order/add", 'GET', options), (error, response, body) => {
                if (error)
                    reject(error);
                else {
                    if (response.statusCode !== 200) {
                        reject("statusCode : " + response.statusCode);
                    }

                    let json = typeof body === 'object' ? body : JSON.parse(body);
                    if (json.code !== 0) {
                        reject(json);
                    } else {
                        resolve(json);
                    }
                }
            });
        });
    } // end of sell

    order(direction = "buy", pair, amount, type = null, price = null) {
        direction = direction.toUpperCase();
        if (direction !== 'BUY' && direction !== 'SELL') {
            throw new Error('[order] direction is not BUY or SELL');
        }
        var options = {
            symbol: pair,
            amount: amount + "",
            direction: direction
        };

        if ((type === null) || (type === 'MARKET_PRICE')) {
            options = Object.assign(options, { type: 'MARKET_PRICE', price: "0" });
        }

        if (type === 'LIMIT_PRICE') {
            // if price is null throw error
            if (price === null) {
                throw new Error('[sell] price is null');
            }

            options = Object.assign(options, { type: 'LIMIT_PRICE', price: price + "" });
        }

        return new Promise((resolve, reject) => {
            request(this.buildRequestOptions("/exchange/order/add", 'GET', options), (error, response, body) => {
                if (error)
                    reject(error);
                else {
                    if (response.statusCode !== 200) {
                        reject("statusCode : " + response.statusCode);
                    }

                    let json = typeof body === 'object' ? body : JSON.parse(body);
                    if (json.code !== 0) {
                        reject(json);
                    } else {
                        resolve(json);
                    }
                }
            });
        });
    }

    cancel(orderId) {
        return new Promise((resolve, reject) => {
            request(this.buildRequestOptions("/exchange/order/cancel/" + orderId, 'GET'), (error, response, body) => {
                if (error)
                    reject(error);
                else {
                    if (response.statusCode !== 200) {
                        reject("statusCode : " + response.statusCode);
                    }

                    let json = typeof body === 'object' ? body : JSON.parse(body);
                    if (json.code !== 0) {
                        reject(json);
                    } else {
                        resolve(json);
                    }
                }
            });
        });
    }

    cancelAll(targetSymbol = "", baseSymbol = "USDT", direction = "buy") {
        targetSymbol = targetSymbol.toUpperCase();
        baseSymbol = baseSymbol.toUpperCase();
        direction = direction.toUpperCase();
        const pair = `${targetSymbol}/${baseSymbol}`;
        if (direction == "BUY") direction = 0;
        else if (direction == "SELL") direction = 1;

        if (direction !== 'BUY' && direction !== 'SELL') {
            throw new Error('[cancelAll] direction is not BUY or SELL');
        }

        var options = {
            symbol: pair,
            direction: direction,
            type: 1 // 0: Market Price, 1: Limit Price ??
        };

        return new Promise((resolve, reject) => {
            request(this.buildRequestOptions("/exchange/order/cancel/all", 'POST', options), (error, response, body) => {
                if (error)
                    reject(error);
                else {
                    if (response.statusCode !== 200) {
                        reject("statusCode : " + response.statusCode);
                    } else {
                        let json = typeof body === 'object' ? body : JSON.parse(body);
                        if (json.code !== 0) {
                            reject(json);
                        } else {
                            resolve(json);
                        }
                    }
                }
            });
        });
    }


    openOrders(page = 1, size = 10) {
        return new Promise((resolve, reject) => {
            request(this.buildRequestOptions("/exchange/order/personal/current", 'GET', { pageNo: page, pageSize: size }), (error, response, body) => {
                if (error)
                    reject(error);
                else {
                    if (response.statusCode !== 200) {
                        reject("statusCode : " + response.statusCode);
                    }

                    let json = typeof body === 'object' ? body : JSON.parse(body);
                    if (json.code !== 0) {
                        reject(json);
                    } else {
                        resolve(json);
                    }
                }
            });
        });
    }

    ticker(targetSymbol = "", baseSymbol = "USDT") {
        targetSymbol = targetSymbol.toUpperCase();
        baseSymbol = baseSymbol.toUpperCase();
        const pair = `${targetSymbol}/${baseSymbol}`;

        return new Promise((resolve, reject) => {
            request(this.buildRequestOptions("/market/symbol-thumb", 'GET'), (error, response, body) => {
                if (error)
                    reject(error);
                else {
                    if (response.statusCode !== 200) {
                        reject("statusCode : " + response.statusCode);
                    }

                    let json = typeof body === 'object' ? body : JSON.parse(body);
                    var ticker = json;
                    if (targetSymbol != "") {
                        ticker = json.find((item) => item.symbol == pair);
                    }

                    if (ticker === undefined || ticker === null) {
                        reject("ticker not found");
                    } else {
                        resolve(ticker);
                    }
                }
            });
        });

    }

    price(targetSymbol = "", baseSymbol = "USDT") {
        targetSymbol = targetSymbol.toUpperCase();
        baseSymbol = baseSymbol.toUpperCase();
        const pair = `${targetSymbol}/${baseSymbol}`;

        return new Promise((resolve, reject) => {
            request(this.buildRequestOptions("/market/symbol-thumb", 'GET'), (error, response, body) => {
                if (error)
                    reject(error);
                else {
                    if (response.statusCode !== 200) {
                        reject("statusCode : " + response.statusCode);
                    }

                    let json = typeof body === 'object' ? body : JSON.parse(body);
                    var ticker = json.find((item) => item.symbol == pair);
                    if (ticker === undefined || ticker === null) {
                        reject("ticker not found");
                    } else {
                        resolve(ticker.close);
                    }
                }
            });
        });

    }

    wallet() {
        return new Promise((resolve, reject) => {
            request(this.buildRequestOptions("/users/asset/wallet", 'GET'), (error, response, body) => {
                if (error)
                    reject(error);
                else {
                    if (response.statusCode !== 200) {
                        reject("statusCode : " + response.statusCode);
                    }

                    let json = typeof body === 'object' ? body : JSON.parse(body);
                    if (json.code !== 0) {
                        reject(json);
                    } else {
                        resolve(json);
                    }
                }
            });
        });
    }

    latestTrade(targetSymbol = "", baseSymbol = "USDT", size = 1) {
        targetSymbol = targetSymbol.toUpperCase();
        baseSymbol = baseSymbol.toUpperCase();
        const pair = `${targetSymbol}/${baseSymbol}`;

        return new Promise((resolve, reject) => {
            request(this.buildRequestOptions("/market/latest-trade", 'GET', { symbol: `${pair}`, size: size }), (error, response, body) => {
                if (error)
                    reject(error);
                else {
                    if (response.statusCode !== 200) {
                        reject("statusCode : " + response.statusCode);
                    }

                    let json = typeof body === 'object' ? body : JSON.parse(body);
                    if (error) {
                        reject(json);
                    } else {
                        resolve(json);
                    }
                }
            });
        });
    }

    orderbook(targetSymbol = "", baseSymbol = "USDT") {
        targetSymbol = targetSymbol.toUpperCase();
        baseSymbol = baseSymbol.toUpperCase();
        const pair = `${targetSymbol}/${baseSymbol}`;

        return new Promise((resolve, reject) => {
            request(this.buildRequestOptions("/market/exchange-plate-mini", 'GET', { symbol: `${pair}` }), (error, response, body) => {
                if (error)
                    reject(error);
                else {
                    if (response.statusCode !== 200) {
                        reject("statusCode : " + response.statusCode);
                    }

                    let json = typeof body === 'object' ? body : JSON.parse(body);
                    if (error) {
                        reject(json);
                    } else {
                        resolve(json);
                    }
                }
            });
        });
    }

    fLatestTrade(targetSymbol = "", baseSymbol = "TUSDT", size = 50) {
        targetSymbol = targetSymbol.toUpperCase();
        baseSymbol = baseSymbol.toUpperCase();
        const pair = `${targetSymbol}${baseSymbol}`;

        return new Promise((resolve, reject) => {
            request(this.buildRequestOptions("/future-market-trade/", 'GET', { ticker: `${pair}`, size: size }), (error, response, body) => {
                if (error)
                    reject(error);
                else {
                    if (response.statusCode !== 200) {
                        reject("statusCode : " + response.statusCode);
                    }

                    let json = typeof body === 'object' ? body : JSON.parse(body);
                    if (error) {
                        reject(json);
                    } else {
                        resolve(json);
                    }
                }
            });
        });
    }

    fOrderbook(targetSymbol = "", baseSymbol = "TUSDT", size = 50) {
        targetSymbol = targetSymbol.toUpperCase();
        baseSymbol = baseSymbol.toUpperCase();
        const pair = `${targetSymbol}${baseSymbol}`;

        return new Promise((resolve, reject) => {
            request(this.buildRequestOptions("/future-orderbook/", 'GET', { ticker: `${pair}`, size: size }), (error, response, body) => {
                if (error)
                    reject(error);
                else {
                    if (response.statusCode !== 200) {
                        reject("statusCode : " + response.statusCode);
                    }

                    let json = typeof body === 'object' ? body : JSON.parse(body);
                    if (error) {
                        reject(json);
                    } else {
                        resolve(json);
                    }
                }
            });
        });
    }

    fOpen(targetSymbol = "", baseSymbol = "TUSDT", margin_mode = 0, position = "buy", order_type = 1, leverage = 10, order_price = 1, order_qty = 0) {
        targetSymbol = targetSymbol.toUpperCase();
        baseSymbol = baseSymbol.toUpperCase();
        const pair = `${targetSymbol}${baseSymbol}`;

        position = position.toUpperCase();
        if (position != "BUY" && position != "SELL") throw new Error("Position must be BUY or SELL");
        if (position == "BUY") position = 0; // long
        if (position == "SELL") position = 1; // short

        var options = {
            direction: 0, // 0: Open, 1: Close
            ticker: `${pair}`,
            margin_mode: margin_mode,
            position: position,
            order_type: order_type,
            leverage: leverage,
            order_price: order_price,
            order_qty: order_qty
        };

        return new Promise((resolve, reject) => {
            request(this.buildRequestOptions("/future-order/", 'POST', options), (error, response, body) => {
                if (error)
                    reject(error);
                else {
                    if (response.statusCode !== 200) {
                        reject("statusCode : " + response.statusCode);
                    }

                    let json = typeof body === 'object' ? body : JSON.parse(body);
                    if (error) {
                        reject(json);
                    } else {
                        resolve(json);
                    }
                }
            });
        });
    }


    fClose(targetSymbol = "", baseSymbol = "TUSDT", margin_mode = 0, position = "buy", order_type = 1, leverage = 10, order_price = 1, order_qty = 0) {
        targetSymbol = targetSymbol.toUpperCase();
        baseSymbol = baseSymbol.toUpperCase();
        const pair = `${targetSymbol}${baseSymbol}`;

        position = position.toUpperCase();
        if (position != "BUY" && position != "SELL") throw new Error("Position must be BUY or SELL");
        if (position == "BUY") position = 0; // long
        if (position == "SELL") position = 1; // short

        var options = {
            direction: 1, // 0: Open, 1: Close
            ticker: `${pair}`,
            margin_mode: margin_mode,
            position: position,
            order_type: order_type,
            leverage: leverage,
            order_price: order_price,
            order_qty: order_qty
        };

        return new Promise((resolve, reject) => {
            request(this.buildRequestOptions("/future-order/", 'POST', options), (error, response, body) => {
                if (error)
                    reject(error);
                else {
                    if (response.statusCode !== 200) {
                        reject("statusCode : " + response.statusCode);
                    }

                    let json = typeof body === 'object' ? body : JSON.parse(body);
                    if (error) {
                        reject(json);
                    } else {
                        resolve(json);
                    }
                }
            });
        });
    }

    fCloseAll(targetSymbol = "", baseSymbol = "TUSDT") {
        targetSymbol = targetSymbol.toUpperCase();
        baseSymbol = baseSymbol.toUpperCase();
        var pair = `${targetSymbol}${baseSymbol}`;
        if (targetSymbol == "ALL") {
            pair = "ALL";
        }

        return new Promise((resolve, reject) => {
            request(this.buildRequestOptions("/future-position/close_all", 'PUT', { ticker: `${pair}` }), (error, response, body) => {
                if (error)
                    reject(error);
                else {
                    if (response.statusCode !== 200) {
                        reject("statusCode : " + response.statusCode);
                    }

                    let json = typeof body === 'object' ? body : JSON.parse(body);
                    if (error) {
                        reject(json);
                    } else {
                        resolve(json);
                    }
                }
            });
        });
    }

    fCancel(order_id) {
        return new Promise((resolve, reject) => {
            request(this.buildRequestOptions(`/future-order/cancel/${order_id}`, 'PUT', {}), (error, response, body) => {
                if (error)
                    reject(error);
                else {
                    if (response.statusCode !== 200) {
                        reject("statusCode : " + response.statusCode);
                    }

                    let json = typeof body === 'object' ? body : JSON.parse(body);
                    if (error) {
                        reject(json);
                    } else {
                        resolve(json);
                    }
                }
            });
        });
    }

    fCancelAll(targetSymbol = "", baseSymbol = "TUSDT") {
        targetSymbol = targetSymbol.toUpperCase();
        baseSymbol = baseSymbol.toUpperCase();
        var pair = `${targetSymbol}${baseSymbol}`;
        if (targetSymbol == "ALL") {
            pair = "ALL";
        }

        return new Promise((resolve, reject) => {
            request(this.buildRequestOptions("/future-order/cancel_all", 'PUT', { ticker: `${pair}` }), (error, response, body) => {
                if (error)
                    reject(error);
                else {
                    if (response.statusCode !== 200) {
                        reject("statusCode : " + response.statusCode);
                    }

                    let json = typeof body === 'object' ? body : JSON.parse(body);
                    if (error) {
                        reject(json);
                    } else {
                        resolve(json);
                    }
                }
            });
        });
    }

    buildRequestOptions(path, method, parameter = null) {

        let options = {
            url: this.options.baseURL + path,
            json: true,
            method: method.toUpperCase(),
            timeout: this.options.timeOut,
            cache: false,
            headers: {
                'x-auth-token': this.options.authKey,
                'Content-Type': 'application/json'
            }
        };

        if ((method.toUpperCase() === 'GET') && (parameter)) {
            options.url += '?' + querystring.stringify(parameter);
        }

        if (parameter) {
            options = Object.assign(options, { body: parameter });
        }

        console.log(options);

        return options;
    }

}

// export the class
module.exports = Bitmusa;