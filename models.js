var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var Section = new Schema({
  name: {type: String, required: true, unique: true},
  image_url: {type: String},
  podcasts: [{ type: Schema.ObjectId, ref: 'Section' }]
});

var Podcast = new Schema({
  name: {type: String, required: true},
  url: {type: String, unique: true},
  isProtected: {type: Boolean, required: true},
  upload_time: {type: Date, required: true},
  date: {type: Date, required: true}
});

module.exports.Podcast = mongoose.model('Podcast', Podcast);
module.exports.Section = mongoose.model('Section', Section);
