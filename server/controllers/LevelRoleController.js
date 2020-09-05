const LevelRole = require('../models/LevelRole');

class LevelRoleController {
    static index(req, res, db) {
        const user = db.get('levelroles').value();

        res.send(user);
    }

    static store(req, res, db) {
        const post = db.set(`levelroles.${req.params.roleId}`, {
            ...LevelRole, 
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

module.exports = LevelRoleController;