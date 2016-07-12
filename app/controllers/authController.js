var crypto = require('crypto');
var User = require('../models/user');
var AccessToken = require('../models/accessToken');
var RefreshToken = require('../models/refreshToken');

var generateAccessToken = function(user, res) {
  var accessToken = new AccessToken({
    token: crypto.randomBytes(32).toString('hex'),
    userId: user
  });
  accessToken.save(function (err, accessToken) {
    if (err) {
      return res.json({
        success: false,
        error: err
      });
    }
    else {
      var refreshToken = new RefreshToken({
        token: crypto.randomBytes(32).toString('hex'),
        userId: user
      });
      refreshToken.save(function (err, refreshToken) {
        if (err) {
          return res.json({
            success: false,
            error: err
          });
        }
        else {
          return res.json({
            success: true,
            email: user.email,
            user: user,
            isPro: user.isPro,
            accessToken: accessToken.token,
            refreshToken: refreshToken.token
          });
        }
      });
    }
  });
}

var tokenFromUser = function(req, res) {
  var user = req.user;
  if (user) {
    RefreshToken.findOne({ userId: user._id }, function (err, refreshToken) {
      if (err) {
        return res.sendStatus(401);
      }
      if (!refreshToken) {
        return generateAccessToken(req.user._id, res);
      }
      else {
        AccessToken.findOne({ userId: user._id }, function (err, accessToken) {
          if (err) {
            return res.sendStatus(401);
          }
          if (accessToken) {
            return res.send({
              user: user._id,
              accessToken: accessToken.token,
              refreshToken: refreshToken.token
            });
          }
          else {
            return generateAccessToken(req.user._id, res);
          }
        });
      }
    });
  }
  else {
    return res.sendStatus(401);
  }
}

var refreshAccessToken = function(req, res) {
  var refresh_token = req.body.refresh_token;
  var user_id = req.body.user_id;

  if (refresh_token && user_id) {
    RefreshToken.findOne({ userId: user_id, token: refresh_token }, function (err, refreshToken) {
      if (err || !refreshToken) {
        return res.sendStatus(401);
      }
      else {
        AccessToken.findOne({ userId: user_id }, function (err, accessToken) {
          if (err || !accessToken) {
            return res.sendStatus(401);
          }
          else {
            accessToken.token = crypto.randomBytes(32).toString('hex')
            accessToken.save(function(err) {
              if (err) {
                return res.sendStatus(401);
              }
              else {
                return res.send({
                  user: refreshToken.userId,
                  accessToken: accessToken.token,
                  refreshToken: refreshToken.token
                });
              }
            });
          }
        });
      }
    });
  }
  else {
    res.sendStatus(401);
  }
}

exports.generateAccessToken = generateAccessToken;
exports.refreshAccessToken = refreshAccessToken;
exports.tokenFromUser = tokenFromUser;
