var User      = require('../models/user');
var database  = require('../database');

module.exports.createUser = function (req, res) {
  var user = new User(req.body);
  user.save(function(err, user) {
      if (err) return console.error(err);
      res.json(user);
  })
}
