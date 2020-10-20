const Infraction = require('../models/Infraction');

class InfrationController {
    static index(req, res, db) {
        const warnCase = parseInt(req.params.case) || 0;
        const infractions = db.get('infractions').value();
        
        if (!infractions) {
            return res.status(400).send('Invalid infraction id.');
        }

        const inf = infractions.find(inf => inf._case === warnCase);

        res.send(inf || infractions);
    }

    static store(req, res, db) {

        const infractions = db.get('infractions').value();
        const warnCase = Math.max(...infractions.map(inf => inf._case), 0) + 1;
        
        req.body._case = warnCase;

        infractions.push({
            ...Infraction, 
            ...req.body,
        });
        
        db.set('infractions', infractions).write();

        res.send(db.get('infractions').find({ _case: warnCase }).value());
    }

    static remove(req, res, db) {
        const warnCase = parseInt(req.params.case) || 0;

        if (!warnCase || !db.get('infractions').find({ _case: warnCase }).value()) {
            return res.status(400).send('Invalid infraction id.');
        }

        const infractions = db.get('infractions');

        infractions
            .remove({ _case: parseInt(warnCase) })
            .write();

        res.send(infractions.value());
    }

    static clear(req, res, db) {
        const userId = req.params.userId;
        
        if(!userId) {
            return res.status(400).send('Invalid user id.');
        }

        const infractions = db.get('infractions');

        infractions
            .remove(inf => inf.userId === userId)
            .write();

        res.send(infractions.value());
    }
}

module.exports = InfrationController;