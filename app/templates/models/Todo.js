
module.exports = function (mongoose, name) {
  var schema = mongoose.Schema({
    label: String,
    isDone: Boolean
  });

  mongoose.model(name, schema);
};
