var express = require('express');
var passport = require('passport');
var router = express.Router();

var User = require('../models/user');
var AccessToken = require('../models/accessToken');
var authController = require('../controllers/authController');

router.post('/token', authController.refreshAccessToken);

//router.post('/google/token', passport.authenticate('google-id-token', { scope: [ 'email' ] }), authController.tokenFromUser(req, res));

//router.post('/facebook/token', passport.authenticate('facebook-token', { scope: [ 'email' ] }), authController.tokenFromUser(req, res));

router.post('/email', passport.authenticate('local', { failureRedirect: '/login' }), function (req, res) {
    authController.tokenFromUser(req, res);
});


module.exports = router;
