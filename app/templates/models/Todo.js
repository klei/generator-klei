
module.exports = function (mongoose, name) {
  var schema = mongoose.Schema({
    label: String,
    done: Boolean
  });

  mongoose.model(name, schema);
};
