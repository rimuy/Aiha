const fetch = require('node-fetch');

module.exports = async (method, url, body, type) => {
    const options = { method };

    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
        options.body = JSON.stringify(body, {});
        options.headers = { 
            'Content-Type': 'application/json; charset=UTF-8' 
        };
    }

    const response = await fetch(url, options)
        .then(res => {

            if (type && res[type]) return res[type]();

            return res.json();
        });

    return response;
};