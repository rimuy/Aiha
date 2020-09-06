const LevelRole = require('../models/LevelRole');

class LevelRoleController {
    static index(req, res, db) {
        const roleId = req.params.roleId;
        const roles = db.get(`levelroles${roleId ? '.' + roleId : ''}`).value();

        if (!roles) {
            return res.status(404).send('Invalid role id.');
        }

        res.send(roles);
    }

    static store(req, res, db) {
        const roleId = req.params.roleId;

        if (!roleId) {
            return res.status(400).send('Role ID was not provided.');
        }

        const post = db.set(`levelroles.${roleId}`, {
            ...LevelRole, 
            ...req.body,
        })
        .write();
        
        res.send(post.levelroles);
    }

    static update(req, res, db) {
        const roleId = req.params.roleId;

        if (!roleId) {
            return res.status(400).send('Role ID was not provided.');
        }

        const role = db.get(`levelroles.${roleId}`);

        if (!role) {
            return res.status(404).send('Invalid role id.');
        }

        role.assign(req.body).write();

        res.send(role);
    }

    static remove(req, res, db) {
        const roles = db.get('levelroles').value();
        const roleId = req.params.roleId;

        if (!roleId) {
            return res.status(400).send('Role ID was not provided.');
        }
        else if (!roles[roleId]) {
            return res.status(404).send('Invalid role id.');
        }

        delete roles[roleId];

        const del = db.set('levelroles', roles).write();

        res.send(del);
    }
}

module.exports = LevelRoleController;