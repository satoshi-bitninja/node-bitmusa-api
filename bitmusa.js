const request = require('request');
const querystring = require('querystring');

class Bitmusa {
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

    getDefaultOptions() {
        return {
            baseURL: 'https://www.bitmusa.com/api',
            timeOut: 1000
        }
    }

    createWithKey(authKey) {
        return new Bitmusa({ authKey : authKey });
    }

    setBaseURL(baseURL) {
        this.options.baseURL = baseURL;
    }

    setAuthKey(authKey) {
        this.options.authKey = authKey;
    }

    getBaseURL() {
        return this.options.baseURL;
    }

    getAuthKey() {
        return this.options.authKey;
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
}

// export the class
module.exports = Bitmusa;