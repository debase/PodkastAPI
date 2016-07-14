var express = require('express');
var router = express.Router();
var sectionController = require('../controllers/sectionController');

router.route('/')
    .get(sectionController.getSections);

router.route('/:id')
    .post(sectionController.updateSections)

module.exports = router;
