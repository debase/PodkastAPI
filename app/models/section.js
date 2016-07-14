var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;
var podcast         = require('./podcast');
var radioStation    = require('./radioStation');

var Section = new Schema({
  name: {type: String, required: true, unique: true},
  image_url: {type: String},
  radio_station: { type: Schema.ObjectId, ref: 'RadioStation' },
  podcasts: [{ type: Schema.ObjectId, ref: 'Podcast' }]
});

module.exports = mongoose.model('Section', Section);
