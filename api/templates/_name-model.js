
module.exports = function (mongoose, name) {
  var schema = mongoose.Schema({
    /* Place your schema definition for model <%= modelName %> here, e.g: */
    name: String
  });

  mongoose.model(name, schema);
};

