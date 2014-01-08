
var config = require('./config'),
    env = require('./config/env'),
    pkg = require('../package')<% if (express) { %>,
    http = require('http'),
    port = process.env.PORT || 1337,
    app = require('./app')<% } %><% if (mongo) { %>,
    mongoose = require('mongoose'),
    models = require('./models');

mongoose.connect(config.db);
models(mongoose);<% } else { %>;<% } %>

<% if (express) { %>
http.createServer(app()).listen(port, function () {
  console.log(env.toUpperCase() + ' Server listening on port ' + port);
});<% } %>
