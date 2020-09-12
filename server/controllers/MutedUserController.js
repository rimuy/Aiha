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
}

module.exports = MutedUserController;