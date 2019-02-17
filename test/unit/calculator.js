const {Calculator, divide, minus, multi, plus, spy} = require('../../src/calculator.js');

describe('Calculator', () => {

    it('no result no call', () => {
        // (10 + 1 - 2 -2) * 4 / 4 = 7
        (new Calculator(10)).pipe(plus, 1).pipe(minus, 2).pipe(minus, 2).pipe(multi, 4).pipe(divide, 4);
        expect(spy.result).to.equal(0);
    });

    it('yield result', () => {
        // (10 + 1 - 2 -2) * 4 / 4 = 7
        const c = (new Calculator(10)).pipe(plus, 1).pipe(minus, 2).pipe(minus, 2).pipe(multi, 4).pipe(divide, 4);

        c.result((res) => {
            expect(res).to.equal(7);
            expect(spy.result).to.equal(5);
        })
    });
});