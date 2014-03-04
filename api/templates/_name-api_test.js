/* jshint unused: false */
/* global describe, it */
var chai = require('chai'),
    should = chai.should(),
    supertest = require('supertest')<% if (mongo) { %>,
    db = require('../../config/db')()<% } %>,
    app = require('../../config/app')(),
    request = supertest(app);

describe('<%= name %>-api', function () {
  describe('GET /api/<%= name %>', function () {
    it('should be ok', function (done) {
      request.get('/api/<%= name %>').expect(200, done);
    });
  });
});
