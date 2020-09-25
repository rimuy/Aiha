const Server = require('../Server');

class Muteds {
    static async add(id, options = {}) {
        if (!id) throw 'Error: No user ID.';
        return await Server.Database.request('POST', `muted/${id}`, options);
    }

    static async delete(id) {
        return await Server.Database.request('DELETE', `muted/${id}`);
    }

    static async get(id) {
        return await Server.Database.request('GET', `muted/${id || ''}`);
    }
}

module.exports = Muteds;