var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    admin: Boolean
})

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', User);
