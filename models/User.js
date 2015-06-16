var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var q = require('q');

var GeneralUserSchema = new Schema({
  name: {type: String},
  email: { type: String, unique: true, lowercase: true, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  favorites: {
    apartments: [{
      type: Schema.Types.ObjectId,
      ref: 'Apartment'
    }]
  // hotels: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'GeneralUser'
  // }],
  // realEstate: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'GeneralUser'
  // }],
  // entertainment: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'GeneralUser'
  // }]
  }

});


//Pre('save') runs before every user is created
GeneralUserSchema.pre('save', function(next) {
  var user = this;
  //passw encryption
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      //console.log(hash)
      user.password = hash;
      next();
    });
  });
});

GeneralUserSchema.methods.verifyPassword = function(password) {
  var deferred = q.defer();
  var user = this;
  bcrypt.compare(password, user.password, function(err, res) {
    if (err) {
      deferred.resolve(false);
    }
    deferred.resolve(true);
  });
  return deferred.promise;
}

module.exports = mongoose.model('GeneralUser', GeneralUserSchema);
