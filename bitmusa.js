class Bitmusa {
    constructor(options = {}) {
        this.options = options;
        console.log(this.options);
    }

    createWithKey(authKey ) {
        return new Bitmusa({ authKey : authKey });
    }
}

// export the class
module.exports = Bitmusa;