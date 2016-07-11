var Section   = require('../models/section');
var Podcast   = require('../models/podcast');
var database  = require('../database');

module.exports.getPodcasts = function(req, res) {
  Section.findById(req.params.id)
      .populate({path: 'podcasts', options: {limit: 10, skip: 10 * (req.params.page - 1)}})
      .exec(function(err, data) {
        if (err) return res.status(500);
        return res.status(200).json(data.podcasts);
      });
}

module.exports.updatePodcast = function(req, res) {
  Podcast.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, podcast) {
    if (err) return res.status(400);
    res.status(200).json(podcast);
  });
}
