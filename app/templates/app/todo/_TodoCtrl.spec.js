/* jshint strict:false, globalstrict:false */
/* global describe, it, beforeEach, inject, module, should */

describe('TodoCtrl', function () {
  var <% if (express) { %>todos = [{label: 'One', done: false}, {label: 'Two', done: true}],
      $httpBackend,<% } %>
      todoCtrl,
      scope;

  beforeEach(module('<%= modulename %>'));

  beforeEach(inject(function ($injector) {<% if (express) { %>
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', '/api/todo').respond(todos);
    <% } %>
    scope = $injector.get('$rootScope');

    todoCtrl = function () {
      return $injector.get('$controller')('TodoCtrl', {'$scope': scope});
    };
  }));
<% if (express) { %>
  it('should get all todos from /api/todo on load', function () {
    todoCtrl();
    should.not.exist(scope.todos);
    $httpBackend.flush();
    scope.todos.length.should.equal(2);
  });<% } %>

  it('should add new todos on add()', function () {
    var todo = {label: 'A new todo'<% if (express) { %>, _id: 'abc123'<% } %>};
    todoCtrl();<% if (express) { %>
    $httpBackend.flush();
    $httpBackend.when('POST', '/api/todo').respond(todo);<% } %>
    scope.label = todo.label;
    scope.add();<% if (express) { %>
    scope.posting.should.equal(true);
    $httpBackend.flush();
    scope.posting.should.equal(false);<% } %>
    scope.label.length.should.equal(0);
    scope.todos.length.should.equal(<% if (express) { %>3<% } else { %>1<% } %>);<% if (express) { %>
    scope.todos[scope.todos.length - 1]._id.should.equal('abc123');<% } %>
    scope.todos[scope.todos.length - 1].label.should.equal(todo.label);
    scope.todos[scope.todos.length - 1].done.should.equal(false);
  });
});
