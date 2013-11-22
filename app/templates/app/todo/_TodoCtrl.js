
angular
  .module('<%= modulename %>.todo', [])
  .controller('TodoCtrl', function ($scope<% if (express) { %>, $http<% } %>) {
    'use strict';
    <% if (express) {
    %>$http.get('/api/todo')
      .success(function (result) {
        $scope.todos = result;
      })
      .error(function (err) {
        console.error('Oops!', err);
      });<%
    } else {
    %>$scope.todos = JSON.parse(localStorage.getItem('todos') || '[]');
    $scope.$watch('todos', function (newTodos, oldTodos) {
      if (newTodos !== oldTodos) {
        localStorage.setItem('todos', JSON.stringify(angular.copy($scope.todos));
      }
    }, true);<%
    } %>

    $scope.add = function () {
      var todo = {label: $scope.label, done: false};
      <% if (express) {
      %>$scope.posting = true;
      $http.post('/api/todo', todo)
        .success(function (todo) {
          $scope.todos.push(todo);
          $scope.label = '';
        })
        .error(function (err) {
          console.error('Oops!', err);
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
      this.todo.done = !this.todo.done;<% if (express) { %>
      $http.put('/api/todo/' + this.todo.id, this.todo)
        .error(function (err) {
          console.error('Oops!', err);
        });<% } %>
    };
  });
