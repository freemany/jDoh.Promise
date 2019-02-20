class P {
    constructor(resolveCallback) {
        this._cb = null;
        this.result = null;

        const resolve = (result) => {
            this.result = result;
            if ('function' === typeof this._cb) {
                this._cb(result);
            }
        };
        resolveCallback(resolve);
    }

    then(cb) {
        if(this.result) {
            this._cb = cb;
            return P.resolve(cb(this.result));
        }
        return new P(resolve => {
            this._cb = (result) => {
                resolve(cb(result));
            };
        });
    }
}

P.all = (arrP) => {
    const maxTimeout = 10000;

    if (!Array.isArray(arrP) || arrP.length === 0) {
        throw new Error('Invalid array of promise');
    }
    arrP.forEach((p) => {
        if (typeof p.then !== 'function') {
            throw new Error('Invalid array of promise');
        }
    })

    return new P((resolve) => {
        const pTotal = arrP.length;
        const arrRes = [];
        let isTimeout = false;

        let timer = setTimeout(() => {
            isTimeout = true;
            resolve(arrRes);
        }, maxTimeout);

        for(let i=0; i < pTotal; i++) {
            if (true === isTimeout) break;
            arrP[i].then((res) => {
                if (true === isTimeout) return;
                arrRes[i] = res;
                if (Object.keys(arrRes).length === pTotal) {
                    clearTimeout(timer);
                    timer = null;
                    resolve(arrRes);
                }
            });
        }
    });
};

P.race = (arrP) => {
    const maxTimeout = 10000;

    if (!Array.isArray(arrP) || arrP.length === 0) {
        throw new Error('Invalid array of promise');
    }
    arrP.forEach((p) => {
        if (typeof p.then !== 'function') {
            throw new Error('Invalid array of promise');
        }
    })

    return new P((resolve, reject) => {
        const pTotal = arrP.length;
        let isTimeout = false;
        let hasResult = false;

        let timer = setTimeout(() => {
            isTimeout = true;
            const error = {error: 'timeout'};
            console.warn(error);
            if (typeof reject == 'function') {
                reject.call(this, error);
            };
        }, maxTimeout);

        for(let i=0; i < pTotal; i++) {
            if (true === isTimeout) break;
            arrP[i].then((res) => {
                if (true === isTimeout || true === hasResult) return;
                clearTimeout(timer);
                timer = null;
                hasResult = true;
                resolve(res);
            });
        }
    });
};


P.resolve = (p) => {
    const resolver = function(cb) {
        if (typeof p.then === 'function') {
            p.then((res) => {
                cb.call(cb, res);
            });
        } else {
            cb.call(cb, p);
        }
    }

    return {
        then: resolver
    }
};

module.exports = P;