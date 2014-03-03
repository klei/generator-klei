
var env = require('./config/env')<% if (express) { %>,
    http = require('http'),
    port = process.env.PORT || 1337,
    app = require('./config/app')<% } %><% if (mongo) { %>,
    db = require('./config/db');

// Connect db and load models:
db();<% } else { %>;<% } %>

<% if (express) { %>
http.createServer(app()).listen(port, function () {
  console.log(env.toUpperCase() + ' Server listening on port ' + port);
});<% } %>
