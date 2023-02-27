const axios = require('axios');

class Bitmusa {
    constructor(options = {}) {
        if (typeof options === 'string') {
            this.options = { authKey: options };
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
            timeout: 3000
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



    async requestAPI(path, method, data = null) {
        method = method.toUpperCase();
        const options = {
            method: method,
            url: `${this.options.baseURL}${path}`,
            headers: {
                'x-auth-token': this.options.authKey,
                'Content-Type': 'application/json'
            },
            data: data,
            responseType: 'json',
            timeout: this.options.timeout
        };

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
            const response = await this.requestAPI('/users/v1/signin', 'post', { email: email, password: password });
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

}

// export the class
module.exports = Bitmusa;