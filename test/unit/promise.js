const P = require('../../src/promise.js');

describe('Promise', () => {
    const service = (val, timeout) => {
        return new P((resolve, reject) => {
            resolve(val);
            setTimeout(() => {
                resolve(val);
                // reject({msg: 'reject', error: val});
            }, timeout);
        })
    };

    const oneService = {service: service('Result', 7), expected: 'Result'};

    it('testing promise', () => {
        const p = new P();

        expect(p instanceof P).to.eql(true);
        expect(typeof p.then).to.eql('function');
        expect(typeof P.race).to.eql('function');
        expect(typeof P.all).to.eql('function');
    });

    it('resolve', async () => {
        const result = Math.random();
        const res = await service(result, 0);

        expect(res).to.eql(result);
    });

    it('chain resolve', async () => {
        const result = Math.random();
        const serviceP = service(result, 0).then(() => {}).then(() => {});
        const res = await serviceP;

        expect(res).to.eql(result);
    });

    it('multi resolve1', async () => {
        const res = await oneService.service;

        expect(res).to.eql(oneService.expected);
    });
    it('multi resolve2', async () => {
        const res = await oneService.service;

        expect(res).to.eql(oneService.expected);
    });
    it('multi resolve3', async () => {
        const res = await oneService.service;

        expect(res).to.eql(oneService.expected);
    });

    it('chain return', async () => {
        const result = Math.random();
        const result1 = Math.random();
        const result2 = Math.random();
        const serviceP = service(result, 5).then(() => result1).then(() => result2);
        const res = await serviceP;

        expect(res).to.eql(result2);
    });

    it('Promise.resolve string', async () => {
        const expected = Math.random();
        const res = await P.resolve(expected);

        expect(res).to.eql(expected);
    });

    it('Promise.resolve native promise', async () => {
        const expected = Math.random();
        const promisefy = (val, timeout) => {
            return new Promise((resolve) => {
                resolve(val);
                setTimeout(() => {
                    resolve(val);
                }, timeout);
            })
        };
        const res = await P.resolve(promisefy(expected, 1));

       expect(res).to.eql(expected);
    });

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
        const res = await P.all(p);

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
        const res = await P.race(p);

        expect(res).to.eql(res);
    })
});