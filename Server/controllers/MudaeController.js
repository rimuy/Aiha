
class MudaeController {
    static index(req, res, db) { /* GET */
        const key = req.params.key;
        const data = db.get(`mudae${key ? '.' + key : ''}`).value();

        if (!data) {
            return res.status(400).send('Invalid key.');
        }

        res.send(data);
    }

    static store(req, res, db) { /* POST */
        const key = req.params.key;
        const userId = req.params.userId;
        const data = db.get(`mudae.${key}`).value();

        if (!data || !userId) {
            return res.status(400).send('Invalid key.');
        }

        if (new Set(data).has(userId)) {
            return res.send({ response: 'ID is already stored.' });
        }

        data.push(userId);

        db.set(`mudae.${key}`, data).write();
        
        res.send(db.get(`mudae.${key}`).value());
    }

    static remove(req, res, db) { /* DELETE */
        const key = req.params.key;
        const userId = req.params.userId;
        const data = db.get(`mudae.${key}`);

        if (!data.value() || !key) {
            return res.status(400).send('Invalid key.');
        }

        const set = new Set(data.value());

        if (!set.has(userId)) {
            return res.status(400).send('Invalid user ID.');
        }
        
        set.delete(userId);

        db.set(`mudae.${key}`, [...set]).write();

        res.send(data.value());
    }

    static clear(req, res, db) { /* PURGE */
        const data = db.get('mudae').value();
        const keys = req.params.key 
            ? [req.params.key]
            : Object.keys(data); 

        if (keys.length === 1 && !db.get(`mudae.${keys[0]}`).value()) {
            return res.status(400).send('Invalid key.');
        }

        const newData = data;

        keys.forEach(key => {
            newData[key] = [];
        });

        db.set('mudae', newData).write();

        res.send(db.get('mudae').value());
    }
}

module.exports = MudaeController;