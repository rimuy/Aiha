const Infration = require('../models/Infration');

class InfrationController {
    static index(req, res, db) {
        const user = db.get('infrations').value();

        res.send(user);
    }

    static store(req, res, db) {
        const post = db.set(`infrations.${req.params.userId}`, {
            ...Infration, 
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

module.exports = InfrationController;