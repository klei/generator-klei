
var mongoose = require('mongoose'),
    Todo = mongoose.model('Todo');

exports.create = function (req, res) {
  var todo = new Todo(req.body);
  todo.save(function (err) {
    if (err) {
      res.send(400, err);
    } else {
      res.send(todo);
    }
  });
};

exports.read = function (req, res) {
  Todo.findById(req.params.id, function (err, todo) {
    if (err) {
      res.send(400, err);
    } else if (!todo) {
      res.send(404);
    } else {
      res.send(todo);
    }
  });
};

exports.update = function (req, res) {
  var id = req.params.id,
      data = req.body;

  delete data._id; // Just in case...

  Todo.findByIdAndUpdate(id, data, function (err) {
    if (err) {
      res.send(400, err);
    } else {
      res.send({success: true, msg: 'saved'});
    }
  });
};

exports.del = function (req, res) {
  var id = req.params.id;

  Todo.findById(id, function (err, todo) {
    if (err) {
      res.send(400, err);
    } else if (!todo) {
      res.send(404);
    } else {
      todo.remove(function (err) {
        if (err) {
          res.send(400, err);
        } else {
          res.send({success: true, msg: 'removed'});
        }
      });
    }
  });
};

exports.search = function (req, res) {
  Todo.find(req.query, function (err, todos) {
    if (err) {
      res.send(400, err);
    } else {
      res.send(todos);
    }
  });
};

