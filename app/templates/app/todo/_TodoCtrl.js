
angular
  .module('<%= modulename %>.todo')
  .controller('TodoCtrl', function ($scope<% if (express) { %>, Restangular, $log<% } %>) {
    'use strict';
    <% if (express) {
    %>var Todo = Restangular.all('todo');
    Todo.getList()
      .then(function (todos) {
        $scope.todos = todos;
      })
      .catch(function (err) {
        $log.error(err);
      });<%
    } else {
    %>$scope.todos = JSON.parse(localStorage.getItem('todos') || '[]');
    $scope.$watch('todos', function (newTodos, oldTodos) {
      if (newTodos !== oldTodos) {
        localStorage.setItem('todos', JSON.stringify(angular.copy($scope.todos)));
      }
    }, true);<%
    } %>

    $scope.add = function () {
      var todo = {label: $scope.label, isDone: false};
      <% if (express) {
      %>$scope.posting = true;
      Todo.post(todo)
        .then(function (todo) {
          $scope.todos.push(todo);
          $scope.label = '';
        })
        .catch(function (err) {
          $log.error(err);
        })
        .finally(function () {
          $scope.posting = false;
        });<%
      } else {
      %>$scope.todos.push(todo);
      localStorage.setItem('todos', JSON.stringify(angular.copy($scope.todos)));
      $scope.label = '';<%
      } %>
    };

    $scope.check = function () {
      this.todo.isDone = !this.todo.isDone;<% if (express) { %>
      this.todo.put().catch(function (err) {
        $log.error(err);
      });<% } %>
    };
  });
