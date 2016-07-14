var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var RadioStation = new Schema({
  name: {type: String, required: true, unique: true},
  image_url: {type: String}
});

module.exports = mongoose.model('RadioStation', RadioStation);
