/* jshint strict:false, globalstrict:false */
/* global describe, it, beforeEach, inject, module, should */

describe('TodoCtrl', function () {
  var todos = [{label: 'One', done: false}, {label: 'Two', done: true}],
      $httpBackend,
      todoCtrl,
      scope;

  beforeEach(module('<%= modulename %>'));

  beforeEach(inject(function ($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', '/api/todo').respond(todos);

    scope = {};

    todoCtrl = function () {
      return $injector.get('$controller')('TodoCtrl', {'$scope': scope});
    };
  }));

  it('should get all todos from /api/todo on load', function () {
    todoCtrl();
    should.not.exist(scope.todos);
    $httpBackend.flush();
    scope.todos.length.should.equal(2);
  });
});
