const Controller = require('../controllers/StarboardController');

module.exports = (routes, db) => {

    routes.get('/starboard', (req, res) => 
        Controller.index(req, res, db));

    routes.get('/starboard/:id', (req, res) => 
        Controller.index(req, res, db));

    routes.post('/starboard/:id', (req, res) => 
        Controller.store(req, res, db));

    routes.delete('/starboard/:id', (req, res) => 
        Controller.remove(req, res, db));
    
};