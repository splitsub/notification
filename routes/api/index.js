const app = module.exports = require('express')();
const config = require('../../config');

app.use('/template', require('./template'));
app.use('/', require('./notification'));
if (config.LOG_DUMP) {
    app.use('/notificationDump', require('./notificationDump'));
}