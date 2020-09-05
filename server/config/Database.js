const fetch = require('node-fetch');

const URL = 'http://localhost:' + process.env.PORT + '/';

class Database {
    static async request(method, key, body) {
        const options = { method };

        if (['POST', 'PUT'].includes(method.toUpperCase())) {
            options.body = JSON.stringify(body, {});
            options.headers = { 
                'Content-Type': 'application/json; charset=UTF-8' 
            };
        }

        const response = await fetch(URL + key, options);

        return response.json();
    }
}

module.exports = Database;