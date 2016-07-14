var express     = require('express');
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var passport    = require('passport');

var podcasts    = require('./app/routes/podcast');
var sections    = require('./app/routes/section');
var users       = require('./app/routes/user');
var login       = require('./app/routes/login');
var database    = require('./app/database');

var port        = process.env.PORT || 8080;
var app         = express();

var auth = require('./app/auth/auth');

app.use(express.static(__dirname + "/public/dist"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use('/api/sections', sections);
app.use('/api/podcasts', podcasts);
app.use('/api/users',    users);
app.use('/api/login',    login);

app.listen(port, function() {
  console.log("API running on port " + port);
})

// catch 404 and forward to error handler
app.use(function(req, res, next){
    res.status(404);
    console.log('%s %d %s', req.method, res.statusCode, req.url);
    return res.json({
    	error: 'Not found'
    });
});

// error handlers
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    console.error('%s %d %s', req.method, res.statusCode, err.message);
    return res.json({
    	error: err.message
    });
});
