const express = require('express');
const low = require('lowdb');

const routes = express.Router();
const adapter = require('./config/Adapter');

// Controllers
const UController = require('./controllers/UserController');
const MUController = require('./controllers/MutedUserController');
const IController = require('./controllers/InfrationController');
const LRController = require('./controllers/LevelRoleController');

const db = low(adapter);

db.defaults({
    users: {},
    muted: {},
    infrations: { cases: 0 },
    levelroles: {},
}).write();

/* GET */
routes.get('/users', (req, res) => 
    UController.index(req, res, db));

routes.get('/muted', (req, res) => 
    MUController.index(req, res, db));

routes.get('/infrations', (req, res) => 
    IController.index(req, res, db));

routes.get('/infrations/:userId', (req, res) => 
    IController.index(req, res, db));

routes.get('/levelroles', (req, res) => 
    LRController.index(req, res, db));

/* POST */
routes.post('/users/:userId', (req, res) => 
    UController.store(req, res, db));

routes.post('/muted/:userId', (req, res) => 
    MUController.store(req, res, db));

routes.post('/infrations/:userId', (req, res) => 
    IController.store(req, res, db));

routes.post('/levelroles/:roleId', (req, res) => 
    LRController.store(req, res, db));

/* PUT */

/* DELETE */
routes.delete('/infrations/:userId', (req, res) => 
    IController.remove(req, res, db));

routes.delete('/infrations/:userId/:case', (req, res) => 
    IController.remove(req, res, db));

routes.delete('/users/:userId', (req, res) => 
    UController.remove(req, res, db));

routes.delete('/muted/:userId', (req, res) => 
    MUController.remove(req, res, db));

module.exports = routes;