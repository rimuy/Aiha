const fetch = require('node-fetch');

const URL = 'http://localhost:' + process.env.PORT + '/';

class Database {
    static async request(method, key, body) {
        const options = { method };

        if (method.toUpperCase() === 'POST') {
            options.body = JSON.stringify(body);
            options.headers = { 'Content-Type': 'application/json' };
        }

        const response = await fetch(URL + key, options)
            .then(res => res.json());

        return response;
    }
}

module.exports = Database;