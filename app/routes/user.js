var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

router.route('/')
    .post(userController.createUser)

module.exports = router;
