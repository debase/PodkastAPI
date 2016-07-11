var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var Podcast = new Schema({
  name: {type: String, required: true},
  url: {type: String, unique: true},
  isProtected: {type: Boolean, required: true},
  upload_time: {type: Date, required: true},
  date: {type: Date, required: true}
});

module.exports = mongoose.model('Podcast', Podcast);
