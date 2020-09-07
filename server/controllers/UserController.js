const User = require('../models/User');

class UserController {
    static index(req, res, db) { /* GET */
        const userId = req.params.userId;
        const usersOrUser = db.get(`users${userId ? '.' + userId : ''}`).value();

        if (!usersOrUser) {
            return res.status(400).send('Invalid user id.');
        }

        res.send(usersOrUser);
    }

    static store(req, res, db) { /* POST */
        const userId = req.params.userId;

        db.set(`users.${userId}`, {
            ...User, 
            ...req.body || {},
        })
        .write();
        
        res.send(db.get(`users.${userId}`).value());
    }

    static overwrite(req, res, db) { /* PATCH */
        const userId = req.params.userId;
        const savedData = db.get(`users.${userId}`);

        if (!savedData.value()) {
            return res.status(400).send('Invalid user id.');
        }

        savedData.assign(req.body).write();
        
        res.send(savedData);
    }

    static remove(req, res, db) { /* DELETE */
        const userId = req.params.userId;

        if (!db.get(`users.${userId}`).value()) {
            return res.status(400).send('User not found.');
        }

        db.unset(`users.${userId}`).write();

        res.send(db.get('users').value());
    }
}

module.exports = UserController;