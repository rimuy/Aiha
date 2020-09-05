const Database = require('../config/Database');
const User = require('../models/User');

class UserController {
    static index(req, res, db) {
        const user = db.get(`users`).value();

        res.send(user);
    }

    static store(req, res, db) {
        const post = db.set(`users.${req.params.userId}`, {
            ...User, 
            ...req.body,
        })
        .write();
        
        res.send(post);
    }

    static update(req, res, db) {

    }

    static remove(req, res, db) {

    }
}

module.exports = UserController;