
angular.module('<%= modulename %>', [
  'ngRoute',
  <% if (useexample) { %>'<%= modulename %>.todo',
  <% if (express) { %>'restangular',
  <% } %><% } %>'<%= modulename %>Templates'
])<% if (useexample) { %>
.config(function ($routeProvider<% if (express) { %>, RestangularProvider<% } %>) {
  'use strict';
  $routeProvider
    .when('/todo', {
      controller: 'TodoCtrl',
      templateUrl: '/<%= modulename %>/todo/todo.html'
    })
    .otherwise({
      redirectTo: '/todo'
    });<% if (express) { %>

  RestangularProvider.setBaseUrl('/api');<% if (mongo) { %>
  RestangularProvider.setRestangularFields({
    id: '_id'
  });<% } %><% } %>
})<% } %>;
