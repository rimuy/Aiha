const Infration = require('../models/Infration');

class InfrationController {
    static index(req, res, db) {
        const warnCase = parseInt(req.params.case) || 0;
        const infrations = db.get('infrations').value();
        
        if (!infrations) {
            return res.status(400).send('Invalid infration id.');
        }

        const inf = infrations.find(inf => inf._case === warnCase);

        res.send(inf || infrations);
    }

    static store(req, res, db) {

        const infrations = db.get('infrations').value();
        const warnCase = Math.max(...infrations.map(inf => inf._case), 0) + 1;
        
        req.body._case = warnCase;

        infrations.push({
            ...Infration, 
            ...req.body,
        });
        
        db.set('infrations', infrations).write();

        res.send(db.get('infrations').find({ _case: warnCase }).value());
    }

    static remove(req, res, db) {
        const warnCase = parseInt(req.params.case) || 0;

        if (!warnCase || !db.get('infrations').find({ _case: warnCase }).value()) {
            return res.status(400).send('Invalid infration id.');
        }

        const infrations = db.get('infrations');

        infrations
            .remove({ _case: parseInt(warnCase) })
            .write();

        res.send(infrations.value());
    }

    static clear(req, res, db) {
        const userId = req.params.userId;
        
        if(!userId) {
            return res.status(400).send('Invalid user id.');
        }

        const infrations = db.get('infrations');

        infrations
            .remove(inf => inf.userId === userId)
            .write();

        res.send(infrations.value());
    }
}

module.exports = InfrationController;