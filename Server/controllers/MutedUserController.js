const MutedUser = require('../models/MutedUser');

class MuteUserController {
    static index(req, res, db) {
        const userId = req.params.userId;
        const muteds = db.get('muted').value();
        
        if (!muteds) {
            return res.status(400);
        }

        const muted = muteds.find(m => userId && m.id === userId);

        if (userId && !muted) {
            return res.status(400).send({ error: 'User is not muted.' });
        }

        res.send(muted || muteds);
    }

    static store(req, res, db) {
        const userId = req.params.userId;
        const muteds = db.get('muted');

        if (!userId) {
            return res.status(400).send({ error: 'Invalid user id.' });
        }

        req.body.id = userId;
        req.body.timestamp = new Date();

        muteds
            .push({ ...MutedUser, ...req.body })
            .write();
        
        res.send(muteds.find({ id: userId }).value());
    }

    static remove(req, res, db) {
        const id = req.params.userId;

        if (!db.get('muted').find({ id }).value()) {
            return res.status(400).send({ error: 'Invalid user id.' });
        }

        const muteds = db.get('muted');

        muteds
            .remove({ id })
            .write();

        res.send(muteds.value());
    }
}

module.exports = MuteUserController;