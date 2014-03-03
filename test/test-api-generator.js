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

  it('should create a controller and test with given name dasherized in an api directory with same name', function (done) {
    var expected = [
      'src/api/my-new-api/my-new-api-api.js',
      'src/api/my-new-api/my-new-api-api_test.js',
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
