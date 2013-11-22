
angular.module('<%= modulename %>', [
  'ngRoute',
  <% if (useexample) { %>'<%= modulename %>.todo',
  <% } %>'<%= modulename %>Templates'
])<% if (useexample) { %>
.config(function ($routeProvider, $locationProvider) {
  'use strict';
  $routeProvider
    .when('/todo', {
      controller: 'TodoCtrl',
      templateUrl: '/<%= modulename %>/todo/todo.html'
    })
    .otherwise({
      redirectTo: '/todo'
    });
  <% if (express) { %>
  $locationProvider.html5Mode(true);<% } %>
})<% } %>;
