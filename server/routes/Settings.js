const Controller = require('../controllers/SettingsController');

module.exports = (routes, db) => {
    
    routes.get('/settings', (req, res) => 
        Controller.index(req, res, db));

    routes.post('/settings', (req, res) => 
        Controller.reset(req, res, db));

    routes.patch('/settings', (req, res) => 
        Controller.overwrite(req, res, db));
    
};