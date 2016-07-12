var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

var Profile = new Schema({
    firstname: { type: String, required: true},
    lastname: { type: String, required: true },
    phone: { type: String, default: null },
    birthday: { type: String, default: null },
    pictureProfileUrl: {type: String, default: null}
});

// User
var User = new Schema({
    email: {type: String, unique: true, required: true},
    hashedPassword: { type: String, required: true },
    admin: Boolean,
    salt: {type: String, required: true},
    created: {type: Date, default: Date.now },
    profile: Profile,
    auth: {
        facebookId: {
            type: String,
            default: null},
        googleId: {
            type: String,
            default: null}
    }
});

User.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    //more secure – return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
};

User.virtual('password')
    .get(function() { return this._plainPassword; })
    .set(function(password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString('hex');
        //more secure - this.salt = crypto.randomBytes(128).toString('hex');
        this.hashedPassword = this.encryptPassword(password);
    });

User.virtual('userId').get(function () {
      return this.id;
});


User.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

module.exports = mongoose.model('User', User);
