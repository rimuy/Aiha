const Starboard = require('../models/Starboard');

class StarboardController {
    static index(req, res, db) {
        const id = req.params.id;
        const starboard = db.get('starboard').value();
        
        if (!starboard) {
            return res.status(400).send({ error: 'Starboard does not exist.' });
        }

        const board = starboard.find(b => b.id === id);

        if (!board && id) {
            return res.status(400).send({ error: 'Board does not exist.' });
        }

        res.send(board || starboard);
    }

    static store(req, res, db) {
        const starboard = db.get('starboard').value();
        const id = req.params.id;
        
        req.body.id = id;

        starboard.push({
            ...Starboard, 
            ...req.body,
        });
        
        db.set('starboard', starboard).write();

        res.send(db.get('starboard').find({ id }).value());
    }

    static remove(req, res, db) {
        const id = req.params.id;

        if (!id || !db.get('starboard').find({ id }).value()) {
            return res.status(400).send({ error: 'Invalid id.' });
        }

        const starboard = db.get('starboard');

        starboard
            .remove({ id })
            .write();

        res.send(starboard.value());
    }
}

module.exports = StarboardController;