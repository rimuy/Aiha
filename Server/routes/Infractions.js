const Controller = require('../controllers/InfractionController');

module.exports = (routes, db) => {

    routes.get('/infractions', (req, res) => 
        Controller.index(req, res, db));

    routes.get('/infractions/:case', (req, res) => 
        Controller.index(req, res, db));

    routes.post('/infractions', (req, res) => 
        Controller.store(req, res, db));

    routes.delete('/infractions/:case', (req, res) => 
        Controller.remove(req, res, db));

    routes.purge('/infractions/:userId', (req, res) =>
        Controller.clear(req, res, db));
    
};