const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router');
const log = require('../src/Aiha/util/Log');

const app = express();

const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(router);

app.listen(PORT, () => log('FG_GREEN','[Server] Listening on port ' + PORT));

module.exports = {
    Recipient: app,
    Router: router,
    Database: require('./config/Database'),
};