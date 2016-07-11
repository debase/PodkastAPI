var express = require('express');
var router = express.Router();
var sectionController = require('../controllers/sectionController');

router.route('/')
    .get(sectionController.getSections)

module.exports = router;
