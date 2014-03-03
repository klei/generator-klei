/* global describe, it */
var chai = require('chai'),
    should = chai.should(),
    supertest = require('supertest'),
    db = require('../../config/db')(),
    app = require('../../config/app')(),
    request = supertest(app);

describe('todo-api', function () {
  describe('GET /api/todo', function () {
    it('should give an array of todos', function (done) {
      request.get('/api/todo')
        .expect(200)
        .expect(function (res) {
          res.body.should.be.an('array');
        })
        .end(done);
    });
  });
});
