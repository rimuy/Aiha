const Controller = require('../controllers/InfrationController');

module.exports = (routes, db) => {

    routes.get('/infrations', (req, res) => 
        Controller.index(req, res, db));

    routes.get('/infrations/:userId', (req, res) => 
        Controller.index(req, res, db));

    routes.post('/infrations/:userId', (req, res) => 
        Controller.store(req, res, db));

    routes.delete('/infrations/:userId', (req, res) => 
        Controller.remove(req, res, db));

    routes.delete('/infrations/:userId/:case', (req, res) => 
        Controller.remove(req, res, db));
    
};