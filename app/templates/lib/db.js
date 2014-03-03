
var config = require('../config'),
    mongoose = require('mongoose'),
    models = require('./models');

module.exports = function () {
  mongoose.connect(config.db);
  models(mongoose);
  return mongoose;
};
