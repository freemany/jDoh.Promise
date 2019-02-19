class P {
    constructor(resolveCallback, rejectCallback) {
        this.cbRejectStack = [];
        this.resolveCallback = resolveCallback;
        this.resolve = null;
        this.result = null;
    }

    catch(cb) {
        if (typeof cb === 'function') {
            this.cbRejectStack.push(cb);
        }

        return this;
    }

    then(cb) {
        const reject = () => {};
        if (null === this.resolve) {
            this.resolve= (result) => {
                if (typeof cb === 'function') {
                    this.result = cb.call(cb, result);
                }
            }
        } else {
            this.resolve = (result) => {
                if (typeof cb === 'function') {
                    if (null === this.result || undefined=== this.result) {
                        this.result = cb.call(cb, result);
                    } else {
                        this.result = cb.call(cb, this.result);
                    }
                }
            }
        }
        this.resolveCallback.call(this.resolveCallback, this.resolve, reject);

        return this
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