var mongoload = require('mongoload');

module.exports = function (mongoose) {
  mongoload
    .bind(mongoose)
    .load({
      pattern: __dirname + <% if (express) { %>'/api/**/*-model.js'<% } else { %>'/models/*-model.js'<% } %>,
      nameRegExp: /([^\/\\]+)-model.js$/
    });
};
