const FileSync = require('lowdb/adapters/FileSync');
const Path = require('path');
const adapter = new FileSync(Path.resolve(__dirname, '..', '..', 'Server', 'Adapter.json'));

module.exports = adapter;