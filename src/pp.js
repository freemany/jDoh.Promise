

class P {
    constructor(fn) {
        this.cbStack = [];
        this.result = null;

        const resolve = (result) => {
            this.result = result;
            this.cbStack.forEach(cb => {
                cb(result);
            });
        };
        fn(resolve);
    }

    then(cb) {
        if(this.result) {
            return P.resolve(cb(this.result));
        }
        return new P(resolve => {
            this.cbStack.push(result => {
                const cbResult = cb(result);
                resolve(cbResult);
            });
        });
    }
}
P.resolve = function resolve(result) {
    return new P(resolve => {
        resolve(result);
    });
}
P.all = function all(promiseArr) {
    const arrLength = promiseArr.length;

    return new P(resolve => {
        const results = [];

        promiseArr.forEach((promise, i) => {
            promise.then(res => {
                results[i] = res;
                if (Object.keys(results).length === arrLength) {
                    resolve(results);
                }
            });
        });
    });
}

// Could not figure out Promise.race :(

module.exports = P;

