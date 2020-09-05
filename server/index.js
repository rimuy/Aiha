const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const log = require('../src/Aiha/util/Log');

const app = express();

const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(routes);

app.listen(PORT, () => log('FG_GREEN','[Server] Listening on port ' + PORT));