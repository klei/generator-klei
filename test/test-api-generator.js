/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;


describe('klei:api generator', function () {
  var api;

  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      api = helpers.createGenerator('klei:api', [
        '../../api'
      ]);
      done();
    });
  });

  it('should a controller with given name camelized in an api directory with same name', function (done) {
    var expected = [
      'src/api/myNewApi/myNewApi.controller.js'
    ];

    helpers.mockPrompt(api, {
      'name': 'my new api'
    });
    api.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });
});
