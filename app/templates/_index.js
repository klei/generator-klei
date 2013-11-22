
var config = require('./config'),
    pkg = require('./package')<% if (express) { %>,
    express = require('express'),
    app = express(),
    exctrl = require('exctrl')<% } %>;

<% if (mongo) { %>var mongoose = require('mongoose'),
    mongoload = require('mongoload');
mongoose.connect(config.db);

mongoload
  .bind(mongoose)
  .load({
    pattern: __dirname + <% if (express) { %>'/api/**/*.model.js'<% } else { %>'/models/*.js'<% } %><% if (express) { %>,
    nameRegExp: /([^\/\\]+).model.js$/<% } %>
  });<% } %>

<% if (express) { %>
app.use(express.bodyParser());
app.use(express.methodOverride());

exctrl
  .bind(app)
  .load({
    pattern: __dirname + '/api/**/*.controller.js',
    prefix: 'api',
    nameRegExp: /([^\/\\]+).controller.js$/
  });

module.exports = app;<% } %>
