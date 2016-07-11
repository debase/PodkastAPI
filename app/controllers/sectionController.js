var Section   = require('../models/section');
var database  = require('../database');

module.exports.getSections = function (req, res) {
  Section.find({}, function(err, data) {
    if (err) return res.status(500);

    var sections = [];
    for (var i = 0; i < data.length; i++) {
      sections.push({
          name: data[i].name,
          id: data[i]._id
      });
    }
    return res.status(200).json(sections);
  })
}
