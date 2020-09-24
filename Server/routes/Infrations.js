const Controller = require('../controllers/InfrationController');

module.exports = (routes, db) => {

    routes.get('/infrations', (req, res) => 
        Controller.index(req, res, db));

    routes.get('/infrations/:case', (req, res) => 
        Controller.index(req, res, db));

    routes.post('/infrations', (req, res) => 
        Controller.store(req, res, db));

    routes.delete('/infrations/:case', (req, res) => 
        Controller.remove(req, res, db));

    routes.purge('/infrations/:userId', (req, res) =>
        Controller.clear(req, res, db));
    
};