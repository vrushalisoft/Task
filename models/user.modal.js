const config = require("../config");
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;


var UserSchema = new Schema(
  {
    userName: { type: String, unique: true },
    password: String,
    qualification: String,
    city: String,
    phone: String,
    image : String,
    role: String,
  },
  { timestamps: true, versionKey: false }
);

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, 8);
};

UserSchema.methods.validatePassword = function(password) {
  isValid = bcrypt.compareSync(password, this.password);
  return isValid
};

UserSchema.methods.generateLoginToken = function() {
  var user_data = {
    _id: this._id,
    role: this.role,
    userName: this.firstName,
    qualification: this.qualification,
    city: this.city,
    phone: this.phone,
  }
  const jwt = config.issueJWT(user_data)
  return jwt
}

UserSchema.methods.getUserData = function() {
  var user_data = {
    _id: this._id,
    role: this.role,
    userName: this.firstName,
    qualification: this.qualification,
    city: this.city,
    phone: this.phone,
  }
  return user_data
}

UserSchema.path('userName').validate({
  isAsync: true,
  validator: function(userName, callback) {
    const User = mongoose.model(config.tables.USER);
    if (this.isNew || this.isModified('userName')) {
      User.find({ userName: userName }).exec(function(err, users) {
        callback(!err && users.length === 0);
      });
    } else {
      callback(true);
    }
  },
  message: 'This User Name already exists. Please try to log in instead.',
});

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = this.generateHash(this.password);
  }
  next();
});

var User = module.exports.UserModal = mongoose.model(
  config.tables.USER, 
  UserSchema, 
  config.tables.USER
);
