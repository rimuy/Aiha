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

        const post = db.set(`infrations.${userId}`, userData).write();

        res.send(post);
    }

    static remove(req, res, db) {
        const userId = req.params.userId;
        const infCase = req.params.case;

        if (!userId || !db.has(`infrations.${userId}`)) {
            return res.status(400).send('Invalid user id.');
        }

        if (infCase) {
            const infraction = db.get(`infrations.${userId}`)
                .remove({ case: parseInt(infCase) })
                .write();

            return res.send(infraction);
        }

        db.unset(`infrations.${userId}`).write();

        res.send(db.get('infrations'));
    }
}

module.exports = InfrationController;