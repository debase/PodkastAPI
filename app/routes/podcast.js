var express = require('express');
var passport = require('passport');

var router = express.Router();
var podcastController = require('../controllers/podcastController');
var auth = passport.authenticate('bearer', { session: false });

router.route('/:id/:page')
    .get(podcastController.getPodcasts)

router.route('/:id')
    .put(auth, podcastController.updatePodcast)

module.exports = router;
