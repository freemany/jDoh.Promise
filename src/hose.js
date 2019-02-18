class Hose {

    constructor(v) {
        this.initValue = v;
        this._init = true;
        this.cal = null;
    }

    pipe(operation) {
        let resolver = null;
        const p = new Promise((resolve) => {
            resolver = resolve;
        });

        if (true === this._init) {
            this.cal = () => {
                operation.call(this, this.initValue, resolver);

                return p;
            };
            this._init = false;
        } else {
            const _cal = this.cal;
            this.cal = () => {
                _cal.call(this).then((res) => {
                    operation.call(this, res, resolver);
                });

                return p;
            };
        }

        return this;
    }

    yield(cb) {
        cb.call(this, this.cal.call(this));
    }
}

module.exports = Hose;