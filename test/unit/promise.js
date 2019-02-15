const Promise = require('../../src/promise.js');

describe('Promise', () => {

    const service = (val, timeout) => {
        return new Promise((resolve, reject) => {
            resolve(val);
            setTimeout(() => {
                resolve(val);
                // reject({msg: 'reject', error: val});
            }, timeout);
        })
    };

    it('testing promise', () => {
        const p = new Promise();

        expect(p instanceof Promise).to.eql(true);
        expect(typeof p.then).to.eql('function');
        expect(typeof Promise.race).to.eql('function');
        expect(typeof Promise.all).to.eql('function');
    });

    it('resolve', async () => {
        const result = Math.random();
        const res = await service(result, 0);

        expect(res).to.eql(result);
    })

    it('all', async () => {
        const data = [
            {
                result: '1_xxxxx', timeout: 2,
            },
            {
                result: '2_xxxxx', timeout: 3,
            },
            {
                result: '3_xxxxx', timeout: 1,
            },
            {
                result: '4_xxxxx', timeout: 0,
            },

        ];
        const expected = Object.values(data.map(x => x.result));
        const p = [];
        data.forEach((x) => {
            p.push(service(x.result, x.timeout));
        });
        const res = await Promise.all(p);

        expect(res).to.eql(res);
    });

    it('race', async () => {
        const data = [
            {
                result: '1_xxxxx', timeout: 1000,
            },
            {
                result: '2_xxxxx', timeout: 10,
            },
            {
                result: '3_xxxxx', timeout: 100,
            },
            {
                result: '4_xxxxx', timeout: 5550,
            },

        ];
        const expected = data.sort((a, b) => a.timeout < b.timeout)[0].result;
        const p = [];
        data.forEach((x) => {
            p.push(service(x.result, x.timeout));
        });
        const res = await Promise.race(p);

        expect(res).to.eql(res);
    })
});