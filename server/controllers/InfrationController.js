const Infration = require('../models/Infration');

class InfrationController {
    static index(req, res, db) {
        const userId = req.params.userId;
        const infrations = db.get(`infrations${userId ? '.' + userId : ''}`).value();

        if (!infrations) {
            return res.status(400).send('Invalid user id.');
        }

        res.send(infrations);
    }

    static store(req, res, db) {

        const userId = req.params.userId;
        const infrations = db.get('infrations').value();
        let userData = infrations[userId];

        req.body.case = ++infrations._cases;

        if (!userData) userData = [];
        
        userData.push({
            ...Infration, 
            ...req.body,
        });
        
        db.set('infrations', infrations).write();
        db.set(`infrations.${userId}`, userData).write();

        res.send(db.get(`infrations.${userId}`).find({ case: req.body.case }).value());
    }

    static remove(req, res, db) {
        const userId = req.params.userId;
        const infCase = req.params.case;

        if (!userId || !db.has(`infrations.${userId}`)) {
            return res.status(400).send('Invalid user id.');
        }

        if (infCase) {
            const infrations = db.get(`infrations.${userId}`);

            infrations
                .remove({ case: parseInt(infCase) })
                .write();

            return res.send(infrations.value());
        }

        db.unset(`infrations.${userId}`).write();

        res.send(db.get('infrations'));
    }
}

module.exports = InfrationController;