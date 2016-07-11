var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;
var podcast        = require('./podcast');

var Section = new Schema({
  name: {type: String, required: true, unique: true},
  image_url: {type: String},
  podcasts: [{ type: Schema.ObjectId, ref: 'Podcast' }]
});

module.exports = mongoose.model('Section', Section);
