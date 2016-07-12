var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
//var FacebookTokenStrategy = require('passport-facebook-token');
//var GoogleTokenStrategy = require('passport-google-id-token');
//var configAuth = require('config.json')('./auth.json');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');

var config = require('../config');
var User = require('../models/user');
var AccessToken = require('../models/accessToken');
var RefreshToken = require('../models/refreshToken');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new BearerStrategy(
    function (accessToken, done) {
        AccessToken.findOne({ token: accessToken }, function (err, token) {
            if (err) {
                return done(err);
            }
            if (!token) {
                return done(null, false);
            }
            User.findById(token.userId, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, { message: 'Unknown user' });
                }
                var info = { scope: '*' };
                done(null, user, info);
            });
        });
    }
    ));

passport.use(new LocalStrategy(function (email, password, done) {
    User.findOne({ email: email }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, null); }

        if (user.checkPassword(password)) {
            return done(null, user);
        }
        else {
            return done(null, null);
        }
    });
}));

var saveNewUserAuth = function(newUser, callBack) {
  newUser.save(function (err) {
      if (!err) {
          var accessToken = new AccessToken({
              token: crypto.randomBytes(32).toString('hex'),
              userId: newUser
          });

          accessToken.save(function (err, accessToken) {
              if (err) {
                  return callBack(err, null);
              }
              else {
                  var refreshToken = new RefreshToken({
                      token: crypto.randomBytes(32).toString('hex'),
                      userId: newUser
                  });

                  refreshToken.save(function (err, refreshToken) {
                      if (err) {
                          return callBack(err, null);
                      }
                      else {
                          return callBack(null, newUser);
                      }
                  });
              }
          });
      } else {
          return callBack(err, null);
      }
  });
}

// passport.use(new FacebookTokenStrategy({
//     clientID: configAuth.facebook.appID,
//     clientSecret: configAuth.facebook.appSecret,
//     profileFields: ['id', 'displayName', 'name', 'emails']
// }, function (accessToken, refreshToken, profile, done) {
//     User.findOne({ "email": profile._json.email }, function (error, user) {
//         if (error) {
//             return done(error, null);
//         }
//         if (user) {
//             return done(null, user);
//         }
//
//         var pictureProfileUrl = (profile.photos) ? profile.photos[0].value : null;
//         var newUser = new User({
//             email: profile._json.email,
//             profile: {
//                 firstname: profile.name.familyName,
//                 lastname: profile.name.givenName,
//                 pictureProfileUrl: pictureProfileUrl
//             },
//             auth: {
//                 facebookId: profile.id
//             }
//         });
//         newUser.password = crypto.randomBytes(32).toString('hex');
//         saveNewUserAuth(newUser, done);
//     });
// }));
//
// passport.use(new GoogleTokenStrategy({
//     clientID: configAuth.google.appID
//   },
//   function(parsedUser, googleId, done) {
//     var emailUser = parsedUser.payload.email;
//     User.findOne({email:emailUser}, function(error, user) {
//       if (error) {
//           return done(error, null);
//       }
//       if (user) {
//         return done(null, user);
//       }
//
//       var newUser = new User({
//           email: emailUser,
//           profile: {
//               firstname: parsedUser.payload.given_name,
//               lastname: parsedUser.payload.family_name,
//               pictureProfileUrl: parsedUser.payload.picture
//           },
//           auth: {
//               googleId: googleId
//           }
//       });
//       newUser.password = crypto.randomBytes(32).toString('hex');
//       saveNewUserAuth(newUser, done);
//     });
//   }
// ));
