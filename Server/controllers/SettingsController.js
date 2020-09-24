const Settings = require('../models/Settings');

class SettingsController {
    static index(_, res, db) {
        res.send(db.get('settings').value());
    }

    static reset(_, res, db) {

        db.set('settings', Settings).write();

        res.send(db.get('settings').value());
    }

    static overwrite(req, res, db) {

        const data = db.get('settings');

        if (!req.body) {
            return res.status(404).send('Invalid body.');
        }

        data
            .assign(req.body)
            .write();

        res.send(data.value());
    }
}

module.exports = SettingsController;