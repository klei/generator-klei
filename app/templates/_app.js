
var path = require('path'),
    express = require('express'),
    exctrl = require('exctrl');

module.exports = function () {
  var app = express();

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compress());

  exctrl
    .bind(app)
    .load({
      pattern: __dirname + '/api/**/*-api.js',
      prefix: 'api',
      nameRegExp: /([^\/\\]+)-api.js$/
    });

  app.configure('development', function () {
    app.use(express.static(path.join(__dirname, 'app')));
    app.use(express.static(path.join(__dirname, '..', '.tmp')));
    app.use(express.static(path.join(__dirname, '..', 'bower_components')));
  });

  app.configure('production', function () {
    app.use(express.static(path.join(__dirname, '..', 'dist')));
  });

  return app;

};
