const Controller = require('../controllers/UserController');

module.exports = (routes, db) => {

    routes.get('/users', (req, res) => 
        Controller.index(req, res, db));

    routes.get('/users/:userId', (req, res) => 
        Controller.index(req, res, db));

    routes.post('/users/:userId', (req, res) => 
        Controller.store(req, res, db));

    routes.patch('/users/:userId', (req, res) => 
        Controller.overwrite(req, res, db));

    routes.delete('/users/:userId', (req, res) => 
        Controller.remove(req, res, db));
    
};