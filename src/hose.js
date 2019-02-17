class Hose {

    constructor(v) {
        this.initValue = v;
        this._init = true;
        this.cal = null;
    }

    pipe(operation) {
        if (true === this._init) {
            this.cal = () => {
                return operation.call(this, this.initValue);
            };
            this._init = false;
        } else {
            const _cal = this.cal;
            this.cal = () => {
                const result = _cal.call(this);
                return operation.call(this, result);
            };
        }

        return this;
    }

    yield(cb) {
        cb.call(this, this.cal.call(this));
    }
}

module.exports = Hose;