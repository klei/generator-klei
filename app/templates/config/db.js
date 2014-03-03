
var config = require('./.'),
    mongoose = require('mongoose'),
    models = require('./models'),
    loaded = false;

module.exports = function () {
  if (!loaded) {
    mongoose.connect(config.db);
    models(mongoose);
    loaded = true;
  }
  return mongoose;
};
