const MutedUser = require('../models/MutedUser');

class MutedUserController {
    static index(req, res, db) {
        const user = db.get('muted').value();

        res.send(user);
    }

    static store(req, res, db) {
        const post = db.set(`muted.${req.params.userId}`, {
            ...MutedUser, 
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

module.exports = MutedUserController;