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

  it('should create dotfiles, Gruntfile.js and package.json', function (done) {
    var expected = [
      '.jshintrc',
      '.editorconfig',
      '.gitignore',
      'package.json',
      'Gruntfile.js'
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
      'styles/myModule.styl'
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
      'app/myModule.html',
      'app/myModule.js',
      'app/.jshintrc',
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
      'config/index.js',
      'config/env.js',
      'config/development.json'
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

  it('should create a frontend module with a controller, spec and template if useexample is true and angular is chosen', function (done) {
    var expected = [
      'app/todo/index.js',
      'app/todo/TodoCtrl.js',
      'app/todo/TodoCtrl.spec.js',
      'app/todo/todo.html',
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
      'karma/karma.conf.js'
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

  it('should create a frontend app dir if useexample is false and angular is chosen', function (done) {
    var expected = [
      'app'
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
      'app/todo/todo.styl'
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

  it('should create an api module with controller if useexample is true and express is chosen', function (done) {
    var expected = [
      'api/todo/todo.controller.js'
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
      'api/todo/Todo.model.js'
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
      'api'
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
      'models/Todo.js'
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
      'models'
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
});
