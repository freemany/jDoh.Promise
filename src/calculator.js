const spy = { result: 0};
class Calculator {
    constructor(x) {
        this.number = x;
        this._init = true;
        this.cal = null;
    }

    pipe(operation, number) {
        if (true === this._init) {
            this.cal = () => {
                return operation.call(this, number);
            };
            this._init = false;
        } else {
            const _cal = this.cal;
            this.cal = () => {
                const result = _cal.call(this)
                this.number = number;
                return operation.call(this, result);
            };
        }

        return this;
    }

    result(cb) {
        cb.call(this, this.cal.call(this));
    }
}

const plus = function(res)  {
    spy.result ++;
    return res + this.number;
};

const multi = function(res)  {
    spy.result ++;
    return res * this.number;
};

const divide = function(res)  {
    spy.result ++;
    return res / this.number;
};

const minus = function(res) {
    spy.result ++;
    return res - this.number;
};

module.exports = {Calculator, divide, minus, plus, multi, spy};