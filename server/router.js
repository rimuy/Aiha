const express = require('express');
const consign = require('consign');
const low = require('lowdb');

const routes = express.Router();
const adapter = require('./config/Adapter');

const db = low(adapter);

db.defaults({
    users: {},
    muted: {},
    infrations: { _cases: 0 },
    levelroles: {},
}).write();

routes.get('/', (_, res) => res.send(db.value()));

consign()
    .include('server/routes')
    .into(routes, db);

module.exports = routes;