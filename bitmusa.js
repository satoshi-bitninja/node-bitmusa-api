const request = require('request');
const querystring = require('querystring');

class Bitmusa {
    /**
     * Creates an instance of Bitmusa.
     * @param {string|Object} [options={}] - The API options. If string, the authentication key. If object, the options object.
     * @param {string} [options.authKey] - The authentication key.
     * @param {string} [options.baseURL=https://www.bitmusa.com/api] - The API base URL.
     * @param {number} [options.timeout=1000] - The API request timeout in milliseconds.
     * @throws {Error} Invalid options.
     */
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

    /**
     * Returns the default options for the Bitmusa API.
     * @returns {Object} The default options object.
     */
    getDefaultOptions() {
        return {
            baseURL: 'https://www.bitmusa.com/api',
            timeout: 1000
        }
    }


    /**
     * Sets the API base URL.
     * @param {string} baseURL - The API base URL.
     */
    setBaseURL(baseURL) {
        this.options.baseURL = baseURL;
    }

    /**
     * Returns the API base URL.
     * @returns {string} The API base URL.
     */
     getBaseURL() {
        return this.options.baseURL;
    }

    /**
     * Sets the authentication key.
     * @param {string} authKey - The authentication key.
     */
    setAuthKey(authKey) {
        this.options.authKey = authKey;
    }

    /**
     * Returns the authentication key.
     * @returns {string} The authentication key.
     */
     getAuthKey() {
        return this.options.authKey;
    }

    /**
     * Sets the API request timeout in milliseconds.
     * @param {number} timeout - The API request timeout in milliseconds.
     */
     setTimeout(timeout) {
        this.options.timeout = timeout;
    }

    /**
     * Returns the API request timeout in milliseconds.
     * @returns {number} The API request timeout in milliseconds.
     */
    getTimeout() {
        return this.options.timeout;
    }

    /**
     * Builds the request options object for the specified API endpoint and method.
     * @param {string} path - The API endpoint path.
     * @param {string} method - The HTTP method (GET, POST, etc.).
     * @param {Object|null} [parameter=null] - The request parameter object.
     * @returns {Object} The request options object.
     */
    buildRequestOptions(path, method, parameter = null) {
        const requestOptions = {
            url: `${this.options.baseURL}${path}`,
            json: true,
            method: method.toUpperCase(),
            timeout: this.options.timeout,
            cache: false,
            headers: {
              'x-auth-token': this.options.authKey,
              'Content-Type': 'application/json'
            }
        };
        
        if (method.toUpperCase() === 'GET' && parameter) {
            requestOptions.url += `?${querystring.stringify(parameter)}`;
        } else if (parameter) { // when method is POST, PUT, DELETE, etc.
            requestOptions.body = parameter;
        }
    
        //console.log(requestOptions);
    
        return requestOptions;
    }

    /**
     * Sends a sign-in request to the Bitmusa API with the specified email and password.
     * @param {string} email - The user's email.
     * @param {string} password - The user's password.
     * @returns {Promise} A Promise that resolves with the response body if the sign-in is successful, or rejects with an error message otherwise.
     */
    signIn(email, password) {
        return new Promise((resolve, reject) => {
            request(this.buildRequestOptions("/users/v1/signin", 'POST', { email: email, password: password }), (error, response, body) => {
                
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
    } // end of signIn

    /**
     * Retrieves the user's asset balance from the Bitmusa API.
     * @returns {Promise} A Promise that resolves with the response body if the balance is retrieved successfully, or rejects with an error message otherwise.
     */
    balance() {
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
    } // end of balance

    /**
     * Places a buy order for the specified currency pair, amount, and price.
     * @param {string} pair - The currency pair to buy.
     * @param {number} amount - The amount of the currency to buy.
     * @param {string|null} [type=null] - The order type (MARKET_PRICE or LIMIT_PRICE).
     * @param {number|null} [price=null] - The price at which to buy the currency (required for LIMIT_PRICE orders).
     * @returns {Promise} A Promise that resolves with the response body if the order is placed successfully, or rejects with an error message otherwise.
     * @throws {Error} If the order type is LIMIT_PRICE and the price parameter is null.
     */
    buy(pair, amount, type = null, price = null) {
        var options = { 
            symbol : pair, 
            amount : amount+"",
            direction : 'BUY'
        };

        if ((type === null) || (type === 'MARKET_PRICE')) {
            options = Object.assign(options, { type: 'MARKET_PRICE', price: "0" });
        }

        if (type === 'LIMIT_PRICE') {
            // if price is null throw error
            if (price === null) {
                throw new Error('[buy] price is null');
            }

            options = Object.assign(options, { type: 'LIMIT_PRICE', price: price+"" });
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
    } // end of buy

    /**
     * Places a sell order for the specified currency pair, amount, and price.
     * @param {string} pair - The currency pair to sell.
     * @param {number} amount - The amount of the currency to sell.
     * @param {string|null} [type=null] - The order type (MARKET_PRICE or LIMIT_PRICE).
     * @param {number|null} [price=null] - The price at which to sell the currency (required for LIMIT_PRICE orders).
     * @returns {Promise} A Promise that resolves with the response body if the order is placed successfully, or rejects with an error message otherwise.
     * @throws {Error} If the order type is LIMIT_PRICE and the price parameter is null.
     */
    sell(pair, amount, type = null, price = null) {
        var options = { 
            symbol : pair, 
            amount : amount+"",
            direction : 'SELL'
        };

        if ((type === null) || (type === 'MARKET_PRICE')) {
            options = Object.assign(options, { type: 'MARKET_PRICE', price: "0" });
        }

        if (type === 'LIMIT_PRICE') {
            // if price is null throw error
            if (price === null) {
                throw new Error('[sell] price is null');
            }

            options = Object.assign(options, { type: 'LIMIT_PRICE', price: price+"" });
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

    /**
     * Places a order for the specified currency pair, amount, and price.
     * @param {string} direction - The direction of the order (BUY or SELL).
     * @param {string} pair - The currency pair to buy.
     * @param {number} amount - The amount of the currency to buy.
     * @param {string|null} [type=null] - The order type (MARKET_PRICE or LIMIT_PRICE).
     * @param {number|null} [price=null] - The price at which to buy the currency (required for LIMIT_PRICE orders).
     * @returns {Promise} A Promise that resolves with the response body if the order is placed successfully, or rejects with an error message otherwise.
     * @throws {Error} If the order type is LIMIT_PRICE and the price parameter is null.
     * @throws {Error} If the direction is not BUY or SELL.
     */
    order(direction = "buy", pair, amount, type = null, price = null) {        
        direction = direction.toUpperCase();
        if (direction !== 'BUY' && direction !== 'SELL') {
            throw new Error('[order] direction is not BUY or SELL');
        }
        var options = { 
            symbol : pair, 
            amount : amount+"",
            direction : direction
        };

        if ((type === null) || (type === 'MARKET_PRICE')) {
            options = Object.assign(options, { type: 'MARKET_PRICE', price: "0" });
        }

        if (type === 'LIMIT_PRICE') {
            // if price is null throw error
            if (price === null) {
                throw new Error('[sell] price is null');
            }

            options = Object.assign(options, { type: 'LIMIT_PRICE', price: price+"" });
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
    } // end of order

    /**
     * Cancels the order with the specified order ID.
     * @param {string} orderId - The ID of the order to cancel.
     * @returns {Promise} A Promise that resolves with the response body if the order is cancelled successfully, or rejects with an error message otherwise.
     */
    cancel(orderId) {
        return new Promise((resolve, reject) => {
            request(this.buildRequestOptions("/exchange/order/cancel/"+orderId, 'GET'), (error, response, body) => {
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
    } // end of cancel

    /**
     * Cancels all orders for the specified currency pair, direction, and type.
     * @param {string} targetSymbol - The target currency symbol.
     * @param {string} baseSymbol - The base currency symbol.
     * @param {string} direction - The direction of the orders to cancel (BUY or SELL).
     * @returns {Promise} A Promise that resolves with the response body if the orders are cancelled successfully, or rejects with an error message otherwise.
     * @throws {Error} If the direction is not BUY or SELL.
     */
    cancelAll(targetSymbol = "", baseSymbol = "USDT", direction = "buy") {
        targetSymbol = targetSymbol.toUpperCase();
        baseSymbol = baseSymbol.toUpperCase();
        direction = direction.toUpperCase();
        const pair = `${targetSymbol}/${baseSymbol}`;
        if (direction=="BUY") direction = 0;
        else if (direction=="SELL") direction = 1;

        if (direction !== 'BUY' && direction !== 'SELL') {
            throw new Error('[cancelAll] direction is not BUY or SELL');
        }
        
        var options = {
            symbol : pair,
            direction : direction,
            type : 1 // 0: Market Price, 1: Limit Price ??
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
    } // end of cancelAll


    /**
     * Retrieves the user's open orders from the Bitmusa API.
     * @param {number} [page=1] - The page number to retrieve (default is 1).
     * @param {number} [size=10] - The page size to retrieve (default is 10).
     * @returns {Promise} A Promise that resolves with the response body if the orders are retrieved successfully, or rejects with an error message otherwise.
     */
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
    } // end of openOrders

    /**
     * Retrieves the Ticker from the Bitmusa API.
     * @param {string} targetSymbol - The target symbol to retrieve.
     * @param {string} baseSymbol - The base symbol to retrieve.
     * @returns {Promise} A Promise that resolves with the response body if the ticker is retrieved successfully, or rejects with an error message otherwise.
     * @throws {Error} If the ticker is not found.
     */
    
    ticker(targetSymbol="", baseSymbol="USDT") {
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
                    if (targetSymbol!="")
                    {
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

    /**
     * Retrieves the Price from the Bitmusa API.
     * 
     * @param {string} targetSymbol - The target symbol to retrieve (ex> "BTC", default is empty).
     * @param {string} baseSymbol - The base symbol to retrieve (ex> "USDT", default is empty).
     * @returns {Promise} A Promise that resolves with the response body if the orders are retrieved successfully, or rejects with an error message otherwise.
     * @throws {Error} If the symbol is empty.
     */
    price(targetSymbol="", baseSymbol="USDT") {
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

    /**
     * Retrieves the user's wallet from the Bitmusa API.
     * @returns {Promise} A Promise that resolves with the response body if the wallet is retrieved successfully, or rejects with an error message otherwise.
     * @throws {Error} If the wallet is not found.
     * @throws {Error} If the response status code is not 200.
     * @throws {Error} If the response code is not 0.
     * @throws {Error} If the response message is not "success".
     * @throws {Error} If the response data is not found.
     * @throws {Error} If the response data is not an array.
     */
    wallet(){
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

    /**
     * Retrieves the latestTrade from the Bitmusa API.
     * @param {string} targetSymbol - The target symbol to retrieve.
     * @param {string} baseSymbol - The base symbol to retrieve.
     * @returns {Promise} A Promise that resolves with the response body if the latestTrade is retrieved successfully, or rejects with an error message otherwise.
     * @throws {Error} If the latestTrade is not found.
     * @throws {Error} If the response status code is not 200.
     * @throws {Error} If the response code is not 0.
     */
    latestTrade(targetSymbol = "", baseSymbol="USDT", size = 1){
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

    /**
     * Retrieves the orderbook from the Bitmusa API.
     * @param {string} targetSymbol - The target symbol to retrieve.
     * @param {string} baseSymbol - The base symbol to retrieve.
     * @returns {Promise} A Promise that resolves with the response body if the orderbook is retrieved successfully, or rejects with an error message otherwise.
     * @throws {Error} If the orderbook is not found.
     * @throws {Error} If the response status code is not 200.
     */
    orderbook(targetSymbol = "", baseSymbol="USDT"){
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

    /**
     * Retrieves the Lastest trade from the Bitmusa Future API.
     * @param {string} targetSymbol - The target symbol to retrieve.
     * @param {string} baseSymbol - The base symbol to retrieve.
     * @returns {Promise} A Promise that resolves with the response body if the Lastest trade is retrieved successfully, or rejects with an error message otherwise.
     * @throws {Error} If the Lastest trade is not found.
     * @throws {Error} If the response status code is not 200.
     */
    fLatestTrade(targetSymbol = "", baseSymbol="TUSDT", size = 50){
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

    /**
     * Retrieves the Orderbook from the Bitmusa Future API.
     * @param {string} targetSymbol - The target symbol to retrieve.
     * @param {string} baseSymbol - The base symbol to retrieve.
     * @returns {Promise} A Promise that resolves with the response body if the Orderbook is retrieved successfully, or rejects with an error message otherwise.
     * @throws {Error} If the Orderbook is not found.
     * @throws {Error} If the response status code is not 200.
     */
    fOrderbook(targetSymbol = "", baseSymbol="TUSDT", size=50){
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

    /**
     * Retrieves the Position Open from the Bitmusa Future API.
     * @param {string} targetSymbol - The target symbol to retrieve.
     * @param {string} baseSymbol - The base symbol to retrieve.
     * @param {string} margin_mode - The margin mode to retrieve.
     * @param {string} position - The position to retrieve.
     * @param {string} order_type - The order type to retrieve.
     * @param {string} leverage - The leverage to retrieve.
     * @param {string} order_price - The order price to retrieve.
     * @param {string} order_qty - The order qty to retrieve.
     * @returns {Promise} A Promise that resolves with the response body if the Position Open is retrieved successfully, or rejects with an error message otherwise.
     * @throws {Error} If the Position Open is not found.
     * @throws {Error} If the response status code is not 200.
     * @throws {Error} If the Position is not BUY or SELL.
     */
    fOpen(targetSymbol = "", baseSymbol="TUSDT", margin_mode=0, position="buy", order_type=1, leverage=10, order_price=1, order_qty=0){
        targetSymbol = targetSymbol.toUpperCase();
        baseSymbol = baseSymbol.toUpperCase();
        const pair = `${targetSymbol}${baseSymbol}`;

        position = position.toUpperCase();
        if (position != "BUY" && position != "SELL") throw new Error("Position must be BUY or SELL");
        if (position == "BUY") position = 0;
        if (position == "SELL") position = 1;

        var options = {
            ticker : `${pair}`,
            margin_mode : margin_mode,
            position : position,
            order_type : order_type,
            leverage : leverage,
            order_price : order_price,
            order_qty : order_qty
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

}

// export the class
module.exports = Bitmusa;