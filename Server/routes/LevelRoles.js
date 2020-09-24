const Controller = require('../controllers/LevelRoleController');

module.exports = (routes, db) => {

    routes.get('/levelroles', (req, res) => 
        Controller.index(req, res, db));

    routes.post('/levelroles/:roleId', (req, res) => 
        Controller.store(req, res, db));

    routes.put('/levelroles/:roleId', (req, res) => 
        Controller.update(req, res, db));

    routes.patch('/levelroles/:roleId', (req, res) => 
        Controller.overwrite(req, res, db));

    routes.delete('/levelroles/:roleId', (req, res) => 
        Controller.remove(req, res, db));
    
};