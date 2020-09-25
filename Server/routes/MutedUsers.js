const Controller = require('../controllers/MutedUserController');

module.exports = (routes, db) => {

    routes.get('/muted', (req, res) => 
        Controller.index(req, res, db));

    routes.get('/muted/:userId', (req, res) => 
        Controller.index(req, res, db));

    routes.post('/muted/:userId', (req, res) => 
        Controller.store(req, res, db));

    routes.delete('/muted/:userId', (req, res) => 
        Controller.remove(req, res, db));
    
};