var express = require('express');
var router = express.Router();
var podcastController = require('../controllers/podcastController');

router.route('/:id/:page')
    .get(podcastController.getPodcasts)

router.route('/:id')
    .put(podcastController.updatePodcast)

module.exports = router;
