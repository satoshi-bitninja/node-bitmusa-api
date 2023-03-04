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

    async cancelAllOrders(targetSymbol = null, baseSymbol = 'USDT', direction = null) {
        const funcName = '[cancelAllOrders]:';
        targetSymbol = targetSymbol.toUpperCase();
        baseSymbol = baseSymbol.toUpperCase();
        if (!direction) direction = direction.toUpperCase();
        
        const pair = `${targetSymbol}/${baseSymbol}`;
        if (direction == "BUY") direction = 0;
        else if (direction == "SELL") direction = 1;

        var options = {
            symbol: pair,
        };

        if (!direction)
        {
            options = Object.assign(options, { direction: direction });
        } else {
            if (direction !== 'BUY' && direction !== 'SELL') {
                throw new Error('[cancelAll] direction is not BUY or SELL');
            }     
        }

        try {
            const response = await this.requestAPI(`/exchange/order/cancel/all`, 'post', options);
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

    async fetchOpenOrders(pageNo = 1, pageSize = 10) {
        const funcName = '[fetchOpenOrders]:';
        if (pageNo < 1) throw new Error(`${funcName} pageNo start from 1`);

        var parameters = {
            pageNo : pageNo, // 1 is start, not 0
            pageSize : pageSize,
            //symbol : "BTC/USDT" // not supported

        }
        try {
            const response = await this.requestAPI('/exchange/order/personal/current', 'get', parameters);
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            //console.log(json);
            if ((json.code) && (json.code !== 0))
            {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            } 

            return json;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    async getOrders(pageNo = 1, pageSize = 10, symbol = null) {
        const funcName = '[getOrders]:';
        if (pageNo < 1) throw new Error(`${funcName} pageNo start from 1`);

        var parameters = {
            pageNo : pageNo, // 1 is start, not 0
            pageSize : pageSize,
        }
        if (symbol) parameters = Object.assign(parameters, { symbol: symbol });
        try {
            const response = await this.requestAPI('/exchange/order/personal/history', 'get', parameters);
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            //console.log(json);
            if ((json.code) && (json.code !== 0))
            {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            } 

            return json;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }


    async getTrades(pageNo = 1, pageSize = 10, symbol = null) {
        const funcName = '[getTrades]:';
        if (pageNo < 1) throw new Error(`${funcName} pageNo start from 1`);

        var parameters = {
            pageNo : pageNo, // 1 is start, not 0
            pageSize : pageSize,
        }
        if (symbol) parameters = Object.assign(parameters, { symbol: symbol });
        try {
            const response = await this.requestAPI('/exchange/trade/personal/history', 'get', parameters);
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            //console.log(json);
            if ((json.code) && (json.code !== 0))
            {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            } 

            return json;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    async getRecentTrades(targetSymbol = null, baseSymbol = "USDT", pageSize = 20) {
        const funcName = '[getRecentTrades]:';

        if (!targetSymbol) throw new Error(`${funcName} targetSymbol is blank`);
        targetSymbol = targetSymbol.toUpperCase();
        baseSymbol = baseSymbol.toUpperCase();
        const pair = `${targetSymbol}/${baseSymbol}`;

        var parameters = {
            symbol : pair,
            size : pageSize
        }

        try {
            const response = await this.requestAPI('/market/latest-trade', 'get', parameters);
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            //console.log(json);
            if ((json.code) && (json.code !== 0))
            {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            } 

            return json;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    

    async fetchTickers() {
        const funcName = '[fetchTitkcers]:';

        try {
            const response = await this.requestAPI('/market/symbol-thumb', 'get');
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            //console.log(json);
            if ((json.code) && (json.code !== 0))
            {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            } 

            return json;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    async getTicker(targetSymbol = null, baseSymbol = "USDT") {
        const funcName = '[getTicker]:';

        if (targetSymbol === null) throw new Error(`${funcName} targetSymbol is blank`);
        const pair = targetSymbol + "/" + baseSymbol;

        try {
            const response = await this.requestAPI('/market/symbol-thumb', 'get');
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            //console.log(json);
            if ((json.code) && (json.code !== 0))
            {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            } 

            const ticker = json.find((item) => item.symbol == pair);

            return ticker;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }
    


    async fetchBalance() {
        const funcName = '[fetchBalance]:';

        try {
            const response = await this.requestAPI('/users/asset/wallet', 'get');
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            //console.log(json);
            if ((json.code) && (json.code !== 0))
            {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            } 

            return json;
        } catch (error) {
            throw new Error(`Failed to balance: ${error.message}`);
        }
    }



    async fetchOrderBook(targetSymbol = null, baseSymbol = "USDT") {
        const funcName = '[fetchOrderBook]:';
        if (!targetSymbol) throw new Error(`${funcName} targetSymbol is blank`);

        const pair = targetSymbol + "/" + baseSymbol;

        var parameters = {
            symbol : pair
        }
    
        try {
            const response = await this.requestAPI('/market/exchange-plate-mini', 'get', parameters);
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            //console.log(json);
            if ((json.code) && (json.code !== 0))
            {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            } 

            return json;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }


    async fetchFutureRecentTrades(targetSymbol = null, baseSymbol = "USDT", pageSize = 50) {
        const funcName = '[getRecentTrades]:';

        if (!targetSymbol) throw new Error(`${funcName} targetSymbol is blank`);
        targetSymbol = targetSymbol.toUpperCase();
        baseSymbol = baseSymbol.toUpperCase();
        const pair = `${targetSymbol}${baseSymbol}`;

        var parameters = {
            ticker : pair,
            size : pageSize
        }

        try {
            const response = await this.requestAPI('/future-market-trade/', 'get', parameters);
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            //console.log(json);
            if ((json.code) && (json.code !== 0))
            {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            } 

            return json;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    async futureOrderbook(targetSymbol = "", baseSymbol = "TUSDT", size = 50) {
        const funcName = '[futureOrderbook]:';

        if (!targetSymbol) throw new Error(`${funcName} targetSymbol is blank`);
        targetSymbol = targetSymbol.toUpperCase();
        baseSymbol = baseSymbol.toUpperCase();
        const pair = `${targetSymbol}${baseSymbol}`;

        var parameters = {
            ticker : pair,
            size : pageSize
        }

        try {
            const response = await this.requestAPI('/future-orderbook/', 'get', parameters);
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            //console.log(json);
            if ((json.code) && (json.code !== 0))
            {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            } 

            return json;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    async openFutureOrder(targetSymbol = null, baseSymbol = "TUSDT", margin_mode = 0, position = "buy", order_type = 1, leverage = 10, order_price = 1, order_qty = 0) {
        const funcName = '[openFutureOrder]:';

        if (!targetSymbol) throw new Error(`${funcName} targetSymbol is blank`);
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

        try {
            const response = await this.requestAPI('/future-order/', 'post', options);
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            //console.log(json);
            if ((json.code) && (json.code !== 0))
            {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            }

            return json;
        } catch (error) {
            throw new Error(`${error.message}`);
        }

        
    }

    async closeFutureOrder(targetSymbol = null, baseSymbol = "TUSDT", margin_mode = 0, position = "buy", order_type = 1, leverage = 10, order_price = 1, order_qty = 0) {
        const funcName = '[closeFutureOrder]:';

        if (!targetSymbol) throw new Error(`${funcName} targetSymbol is blank`);
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

        try {
            const response = await this.requestAPI('/future-order/', 'post', options);
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            //console.log(json);
            if ((json.code) && (json.code !== 0))
            {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            }

            return json;
        } catch (error) {
            throw new Error(`${error.message}`);
        }

        
    }

    async cancelFutureOrder(order_id) {
        const funcName = '[cancelFutureOrder]:';

        if (!order_id) throw new Error(`${funcName} order_id is blank`);

        var options = {
            order_id: order_id
        };

        try {
            const response = await this.requestAPI('/future-order/', 'delete', options);
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            //console.log(json);
            if ((json.code) && (json.code !== 0))
            {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            }
            
            return json;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    async cancelAllFutureOrder(targetSymbol = null, baseSymbol = "TUSDT") {
        const funcName = '[cancelAllFutureOrder]:';

        if (!targetSymbol) throw new Error(`${funcName} targetSymbol is blank`);
        targetSymbol = targetSymbol.toUpperCase();
        baseSymbol = baseSymbol.toUpperCase();
        const pair = `${targetSymbol}${baseSymbol}`;
        
        var options = {
            ticker: `${pair}`
        };

        try {
            const response = await this.requestAPI('/future-order/cancel_all', 'delete', options);
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            //console.log(json);
            if ((json.code) && (json.code !== 0))
            {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            }

            return json;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    async closeAllFutureOrder(targetSymbol = null, baseSymbol = "TUSDT") {
        const funcName = '[closeAllFutureOrder]:';

        if (!targetSymbol) throw new Error(`${funcName} targetSymbol is blank`);
        targetSymbol = targetSymbol.toUpperCase();
        baseSymbol = baseSymbol.toUpperCase();
        const pair = `${targetSymbol}${baseSymbol}`;
        
        var options = {
            ticker: `${pair}`
        };

        try {
            const response = await this.requestAPI('/future-position/close_all', 'put', options);
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            //console.log(json);
            if ((json.code) && (json.code !== 0))
            {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            }

            return json;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    async getFutureOrder(order_id) {
        throw new Error('Not implemented yet');
    }

    async fetchFutureOrders(targetSymbol = null, baseSymbol = "TUSDT", order_status = 0, page = 1, limit = 100) {
        const funcName = '[fetchFutureOrders]:';

        if (!targetSymbol) throw new Error(`${funcName} targetSymbol is blank`);
        targetSymbol = targetSymbol.toUpperCase();
        baseSymbol = baseSymbol.toUpperCase();
        const pair = `${targetSymbol}${baseSymbol}`;

        var options = {
            ticker: `${pair}`,
            order_status: order_status,
            page: page,
            limit: limit
        };

        try {
            const response = await this.requestAPI('/future-order', 'get', options);
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            //console.log(json);
            if ((json.code) && (json.code !== 0))
            {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            }

            return json;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    async fetchFuturePositions(targetSymbol = null, baseSymbol = "TUSDT") {
        const funcName = '[fetchFuturePositions]:';

        if (!targetSymbol) throw new Error(`${funcName} targetSymbol is blank`);
        targetSymbol = targetSymbol.toUpperCase();
        baseSymbol = baseSymbol.toUpperCase();
        const pair = `${targetSymbol}${baseSymbol}`;
        
        var options = {
            ticker: `${pair}`
        };

        try {
            const response = await this.requestAPI('/future-position', 'get', options);
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            //console.log(json);
            if ((json.code) && (json.code !== 0))
            {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            }

            return json;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    async fetchFutureBalance() {
        const funcName = '[fetchFutureBalance]:';

        try {
            const response = await this.requestAPI('/future-balance', 'get', {});
            if (response.status !== 200) throw new Error(`${funcName} ${response.status}`);
            const json = response.data;
            //console.log(json);
            if ((json.code) && (json.code !== 0))
            {
                throw new Error(`${funcName} ${response.data.message}[code:${json.code}]`);
            }

            return json;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
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