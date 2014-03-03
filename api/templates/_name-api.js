var mongoose = require('mongoose'),
    <%= titleModelName %> = mongoose.model('<%= modelName %>');

/* POST /api/<%= name %> */
exports.create = function (req, res) {
  var <%= camelModelName %> = new <%= titleModelName %>(req.body);
  <%= camelModelName %>.save(function (err) {
    if (err) {
      res.send(400, err);
    } else {
      res.send(<%= camelModelName %>);
    }
  });
};

/* GET /api/<%= name %> */
exports.read = function (req, res) {
  <%= titleModelName %>.findById(req.params.id, function (err, <%= camelModelName %>) {
    if (err) {
      res.send(400, err);
    } else if (!<%= camelModelName %>) {
      res.send(404);
    } else {
      res.send(<%= camelModelName %>);
    }
  });
};

/* PUT /api/<%= name %>/:id */
exports.update = function (req, res) {
  var id = req.params.id,
      data = req.body;

  delete data._id; // Just in case...

  <%= titleModelName %>.findByIdAndUpdate(id, data, function (err) {
    if (err) {
      res.send(400, err);
    } else {
      res.send({success: true, msg: 'saved'});
    }
  });
};

/* DELETE /api/<%= name %>/:id */
exports.del = function (req, res) {
  var id = req.params.id;

  <%= titleModelName %>.findById(id, function (err, <%= camelModelName %>) {
    if (err) {
      res.send(400, err);
    } else if (!<%= camelModelName %>) {
      res.send(404);
    } else {
      <%= camelModelName %>.remove(function (err) {
        if (err) {
          res.send(400, err);
        } else {
          res.send({success: true, msg: 'removed'});
        }
      });
    }
  });
};

/* GET /api/<%= name %> */
exports.search = function (req, res) {
  <%= titleModelName %>.find(req.query, function (err, <%= camelModelName %>List) {
    if (err) {
      res.send(400, err);
    } else {
      res.send(<%= camelModelName %>List);
    }
  });
};

