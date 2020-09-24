const Controller = require('../controllers/MudaeController');

module.exports = (routes, db) => {

    routes.get('/mudae', (req, res) => 
        Controller.index(req, res, db));

    routes.get('/mudae/:key', (req, res) => 
        Controller.index(req, res, db));

    routes.post('/mudae/:key/:userId', (req, res) => 
        Controller.store(req, res, db));

    routes.delete('/mudae/:key/:userId', (req, res) => 
        Controller.remove(req, res, db));

    routes.purge('/mudae', (req, res) => 
        Controller.clear(req, res, db));

    routes.purge('/mudae/:key', (req, res) => 
        Controller.clear(req, res, db));
    
};