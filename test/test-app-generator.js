/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;


describe('klei generator', function () {
  var klei;

  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      klei = helpers.createGenerator('klei:app', [
        '../../app'
      ]);
      done();
    });
  });

  it('should create dotfiles, gulpfile.js, klei.json and package.json', function (done) {
    var expected = [
      '.jshintrc',
      '.editorconfig',
      '.gitignore',
      'package.json',
      'klei.json',
      'gulpfile.js'
    ];

    helpers.mockPrompt(klei, {
      'types': []
    });
    klei.options['skip-install'] = true;
    klei.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('should create css dotfiles and bower.json if stylus is chosen', function (done) {
    var expected = [
      '.csslintrc',
      'bower.json'
    ];

    helpers.mockPrompt(klei, {
      'types': ['stylus']
    });
    klei.options['skip-install'] = true;
    klei.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('should create a main stylesheet (named after chosen modulename) if stylus is chosen', function (done) {
    var expected = [
      'src/styles/myModule.styl'
    ];

    helpers.mockPrompt(klei, {
      'types': ['stylus'],
      'modulename': 'myModule'
    });
    klei.options['skip-install'] = true;
    klei.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('should create a styleguide template if stylus is chosen', function (done) {
    var expected = [
      'src/styles/styleguide.html'
    ];

    helpers.mockPrompt(klei, {
      'types': ['stylus'],
      'modulename': 'myModule'
    });
    klei.options['skip-install'] = true;
    klei.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('should create a layout, module, bower.json and a jshintrc file if angular is chosen', function (done) {
    var expected = [
      'src/app/index.html',
      'src/app/app.js',
      'src/app/.jshintrc',
      'bower.json'
    ];

    helpers.mockPrompt(klei, {
      'types': ['angular'],
      'modulename': 'myModule'
    });
    klei.options['skip-install'] = true;
    klei.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('should create config dir and files if addconfig is true', function (done) {
    var expected = [
      'src/config/index.js',
      'src/config/env.js',
      'src/config/development.json',
      'src/config/production.json',
      'src/config/test.json'
    ];

    helpers.mockPrompt(klei, {
      'types': [],
      'addconfig': true
    });
    klei.options['skip-install'] = true;
    klei.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('should create a frontend module with a controller, test and template if useexample is true and angular is chosen', function (done) {
    var expected = [
      'src/app/todo/todo.js',
      'src/app/todo/todo-controller.js',
      'src/app/todo/todo-controller_test.js',
      'src/app/todo/todo.html',
    ];

    helpers.mockPrompt(klei, {
      'types': ['angular'],
      'useexample': true
    });
    klei.options['skip-install'] = true;
    klei.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('should create a karma config if angular is chosen', function (done) {
    var expected = [
      'karma.conf.js'
    ];

    helpers.mockPrompt(klei, {
      'types': ['angular']
    });
    klei.options['skip-install'] = true;
    klei.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('should create a src dir no type is chosen', function (done) {
    var expected = [
      'src'
    ];

    helpers.mockPrompt(klei, {
      'types': []
    });
    klei.options['skip-install'] = true;
    klei.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('should create a frontend app dir if useexample is false and angular is chosen', function (done) {
    var expected = [
      'src/app'
    ];

    helpers.mockPrompt(klei, {
      'types': ['angular'],
      'useexample': false
    });
    klei.options['skip-install'] = true;
    klei.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('should create a frontend module stylesheet if useexample is true and both angular and stylus is chosen', function (done) {
    var expected = [
      'src/app/todo/todo.styl'
    ];

    helpers.mockPrompt(klei, {
      'types': ['angular', 'stylus'],
      'useexample': true
    });
    klei.options['skip-install'] = true;
    klei.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('should create an api module with controller and test if useexample is true and express is chosen', function (done) {
    var expected = [
      'src/api/todo/todo-api.js',
      'src/api/todo/todo-api_test.js',
    ];

    helpers.mockPrompt(klei, {
      'types': ['express'],
      'useexample': true
    });
    klei.options['skip-install'] = true;
    klei.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('should create an api module with a model if useexample is true and both express and mongo is chosen', function (done) {
    var expected = [
      'src/api/todo/todo-model.js'
    ];

    helpers.mockPrompt(klei, {
      'types': ['express', 'mongo'],
      'useexample': true
    });
    klei.options['skip-install'] = true;
    klei.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('should create an api dir if useexample is false and express is chosen', function (done) {
    var expected = [
      'src/api'
    ];

    helpers.mockPrompt(klei, {
      'types': ['express'],
      'useexample': false
    });
    klei.options['skip-install'] = true;
    klei.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('should create a model if useexample is true and mongo is chosen', function (done) {
    var expected = [
      'src/models/todo-model.js'
    ];

    helpers.mockPrompt(klei, {
      'types': ['mongo'],
      'useexample': true
    });
    klei.options['skip-install'] = true;
    klei.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('should create a model dir if useexample is false and mongo is chosen', function (done) {
    var expected = [
      'src/models'
    ];

    helpers.mockPrompt(klei, {
      'types': ['mongo'],
      'useexample': true
    });
    klei.options['skip-install'] = true;
    klei.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('should create an index, db and models file if mongo is chosen', function (done) {
    var expected = [
      'src/index.js',
      'src/lib/db.js',
      'src/lib/models.js'
    ];

    helpers.mockPrompt(klei, {
      'types': ['mongo']
    });
    klei.options['skip-install'] = true;
    klei.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('should create an index and app file if express is chosen', function (done) {
    var expected = [
      'src/index.js',
      'src/lib/app.js'
    ];

    helpers.mockPrompt(klei, {
      'types': ['express']
    });
    klei.options['skip-install'] = true;
    klei.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });
});
