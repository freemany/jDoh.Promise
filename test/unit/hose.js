const Hose = require('../../src/hose.js');
const spy = {result: 0};

describe('Hose', () => {

    it('no yield no call', () => {
        // 10 + 1 - 2  = 9
        (new Hose(10))
            .pipe((res) => {
               spy.result ++;
               return res + 1;
        }).pipe(res => res - 2);

        expect(spy.result).to.equal(0);
    });

    it('yield', () => {
        // 10 + 1 - 2  = 9
        (new Hose(10))
            .pipe((res) => {
                spy.result ++;
                return res + 1;
            })
            .pipe(res => res - 2)
            .yield((res) => {
                expect(res).to.equal(9);
                expect(spy.result).to.equal(1);
            });
    });
});