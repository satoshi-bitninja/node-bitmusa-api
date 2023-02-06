const request = require('request');

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
            method: method,
            timeout: this.options.timeOut,
            headers: {
                'x-auth-token': this.options.authKey
            }
        };

        if (parameter) {
            options = Object.assign(options, { data: parameter });
        }

        return options;
    }

    balance() {
        return new Promise((resolve, reject) => {
            request(this.buildRequestOptions("/users/asset/wallet", 'GET'), (error, response, body) => {
                if (error)

                    reject(error);
                else {
                    if (response.statusCode !== 200) {
                        reject("statusCode : " + response.statusCode);
                    }

                    let json = JSON.parse(body);
                    if (json.code !== 0) {
                        reject(json);
                    } else {
                        resolve(json);
                    }
                }
            });
        });
    }

    buy(pair, amount, type = null, price = null) {
        var opts = { 
            symbol : pair, 
            amount : amount,
            direction : 'buy'
        };

        if (type === null) {
            opts = Object.assign(opts, { type: 'MARKET' });
        }

        if (type === 'LIMIT_PRICE') {
            // if price is null throw error
            if (price === null) {
                throw new Error('[buy] price is null');
            }
        }

        return new Promise((resolve, reject) => {
            request(this.buildRequestOptions("/exchange/order/add", 'POST'), (error, response, body) => {
                if (error)
                    reject(error);
                else {
                    if (response.statusCode !== 200) {
                        reject("statusCode : " + response.statusCode);
                    }

                    let json = JSON.parse(body);
                    if (json.code !== 0) {
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