
var todos = [];

exports.search = function (req, res) {
  res.send(todos);
};

exports.create = function (req, res) {
  var todo = req.body;
  todo.id = 1;
  if (todos.length) {
    todo.id += todos[todos.length - 1].id;
  }
  todos.push(todo);
  res.send(todo);
};

exports.read = function (req, res) {
  var todo = getById(req.params.id);
  if (todo) {
    res.send(todo);
  } else {
    res.send(404);
  }
};

exports.update = function (req, res) {
  var todo = getById(req.params.id);
  if (todo) {
    todo.label = req.body.label || todo.label;
    todo.isDone = !!req.body.isDone;
    res.send(todo);
  } else {
    res.send(404);
  }
};

exports.del = function (req, res) {
  for (var i = 0; i < todos.length; i++) {
    if (todos[i].id === req.params.id) {
      todos.splice(i, 1);
      res.send(true);
      return;
    }
  }
  res.send(404);
};

function getById (id) {
  return todos.filter(function (todo) {
    return todo.id === +id;
  })[0];
}
