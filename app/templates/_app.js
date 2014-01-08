
var path = require('path'),
    express = require('express'),
    exctrl = require('exctrl');

module.exports = function () {
  var app = app = express();

  app.use(express.bodyParser());
  app.use(express.methodOverride());

  exctrl
    .bind(app)
    .load({
      pattern: __dirname + '/api/**/*.controller.js',
      prefix: 'api',
      nameRegExp: /([^\/\\]+).controller.js$/
    });

  app.configure('development', function () {
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(__dirname, 'app')));
    app.use(express.static(path.join(__dirname, '..', '.tmp')));
    app.use(express.static(path.join(__dirname, '..', 'bower_components')));
  });

  app.configure('production', function () {
    app.use(express.static(path.join(__dirname, '..', 'dist')));
  });

  return app;

};
