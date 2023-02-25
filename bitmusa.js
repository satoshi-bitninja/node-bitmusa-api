const request = require('request');
const querystring = require('querystring');

class Bitmusa {
    /**
     * Creates an instance of Bitmusa.
     * @param {string|Object} [options={}] - The API options. If string, the authentication key. If object, the options object.
     * @param {string} [options.authKey] - The authentication key.
     * @param {string} [options.baseURL=https://www.bitmusa.com/api] - The API base URL.
     * @param {number} [options.timeOut=1000] - The API request timeout in milliseconds.
     * @throws {Error} Invalid options.
     */
    constructor(options = {}) {
        if (typeof options === 'string') {
            this.options = Object.assign(this.getDefaultOptions(), { authKey: options });
        } else {
            if (typeof options === 'object') {
                if (Object.keys(options).length === 0) {
                    this.options = this.getDefaultOptions();
                } else {
                    this.options = Object.assign(this.getDefaultOptions(), options);
                }
            } else {
                throw new Error('[constructor] Invalid options');
            }
        }

    }

    /**
     * Returns the default options for the Bitmusa API.
     * @returns {Object} The default options object.
     */
    getDefaultOptions() {
        return {
            baseURL: 'https://www.bitmusa.com/api',
            timeOut: 1000
        }
    }

    /**
     * Creates a new instance of Bitmusa with the specified authentication key.
     * @param {string} authKey - The authentication key.
     * @returns {Bitmusa} The new Bitmusa instance.
     */
    createWithKey(authKey) {
        return new Bitmusa({ authKey : authKey });
    }

    /**
     * Sets the API base URL.
     * @param {string} baseURL - The API base URL.
     */
    setBaseURL(baseURL) {
        this.options.baseURL = baseURL;
    }

    /**
     * Sets the authentication key.
     * @param {string} authKey - The authentication key.
     */
    setAuthKey(authKey) {
        this.options.authKey = authKey;
    }

    /**
     * Returns the API base URL.
     * @returns {string} The API base URL.
     */
    getBaseURL() {
        return this.options.baseURL;
    }

    /**
     * Returns the authentication key.
     * @returns {string} The authentication key.
     */
    getAuthKey() {
        return this.options.authKey;
    }

    /**
     * Builds the request options object for the specified API endpoint and method.
     * @param {string} path - The API endpoint path.
     * @param {string} method - The HTTP method (GET, POST, etc.).
     * @param {Object|null} [parameter=null] - The request parameter object.
     * @returns {Object} The request options object.
     */
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
    } // end of cancelOrder

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
            request(this.buildRequestOptions("/market/latest-trade", 'GET', { symbol: `${targetSymbol}/${baseSymbol}`, size: size }), (error, response, body) => {
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