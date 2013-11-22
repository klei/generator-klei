
var config = require('./config'),
    pkg = require('./package'),
    express = require('express'),
    app = express(),
    exctrl = require('exctrl');

<% if (mongo) { %>var mongoose = require('mongoose');
mongoose.connect(config.db);<% } %>

app.use(express.bodyParser());
app.use(express.methodOverride());

exctrl
  .bind(app)
  .load({
    pattern: __dirname + '/api/**/*.controller.js',
    prefix: 'api',
    nameRegExp: /([^\/\\]+).controller.js$/
  });

module.exports = app;
