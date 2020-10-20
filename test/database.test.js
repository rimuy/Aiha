const { Database } = require('../Server');
const request = Database.request;

describe('data', () => {
    test('ifExists', async () => {
        const data = await request('GET', '');
        expect(typeof data).toBe('object');
    });
});

describe('users', () => {
    test('ifExists', async () => {
        const users = await request('GET', 'users');
        expect(typeof users).toBe('object');
    });

    test('post', async () => {
        const user = await request('POST', 'users/test').catch(() => false);
        expect(typeof user).toBe('object');
    });

    test('patch', async () => {
        const user = await request('PATCH', 'users/test', { test: 1 }).catch(() => ({}));
        expect(user.test).toBe(1);
    });

    test('delete', async () => {
        const data = await request('DELETE', 'users/test').catch(() => false);
        expect(typeof data).toBe('object');
    });
});

describe('infractions', () => {
    test('ifExists', async () => {
        const infractions = await request('GET', 'infractions').catch(() => false);
        expect(typeof infractions).toBe('object');
    });

    let warnCase;

    test('post', async () => {
        const newInf = await request('POST', 'infractions', {})
            .catch(() => ({}));

        warnCase = newInf._case;
        expect(typeof warnCase).toBe('number');
    });

    test('delete', async () => {
        const returned = await request('DELETE', `infractions/${warnCase}`)
            .catch(() => false);

        const infractions = await request('GET', 'infractions');

        expect(returned && returned.length === infractions.length).toBe(true);
    });
});

describe('mudaeObserver', () => {
    test('ifExists', async () => {
        const observer = await request('GET', 'mudae').catch(() => false);
        expect(typeof observer).toBe('object');
    });

    test('categories', async () => {
        const observer = await request('GET', 'mudae');

        ['claims', 'rolls'].forEach(key => {
            expect(typeof observer[key]).toBe('object');
        });
    });
});

describe('starboard', () => {
    test('ifExists', async () => {
        const starboard = await request('GET', 'starboard').catch(() => false);
        expect(typeof starboard).toBe('object');
    });
});

describe('muteds', () => {
    test('ifExists', async () => {
        const muteds = await request('GET', 'muted').catch(() => false);
        expect(typeof muteds).toBe('object');
    });
});

describe('botSettings', () => {
    test('ifExists', async () => {
        const settings = await request('GET', 'settings').catch(() => false);
        expect(typeof settings).toBe('object');
    });
});

describe('levelRoles', () => {
    test('ifExists', async () => {
        const levelroles = await request('GET', 'levelroles').catch(() => false);
        expect(typeof levelroles).toBe('object');
    });
});