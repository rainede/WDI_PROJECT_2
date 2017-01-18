const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt');
const validator = require('validator');

// Using mongoose method for creating schemas
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true }
  // gender: {type: String, enum: ['male', 'female' ,'other']},
  // age: {type: Number},
  // walkingSpeed: {type: String, enum: ['slow', 'medium' ,'fast']},
  // location: {type: [Number]}, // [Long, Lat] backwards order to google
  // admin: {type: Boolean, default: false}},
}, {
  timestamps: true
});

userSchema
//virtual not saved to Database
.virtual('password')
.set(setPassword);

userSchema
.virtual('passwordConfirmation')
.set(setPasswordConfirmation);

userSchema
.path('passwordHash')
.validate(validatePasswordHash);

userSchema
.path('email')
.validate(validateEmail);

userSchema.methods.validatePassword = validatePassword;

userSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.passwordHash;
    delete ret.email;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);

function setPassword(value){
  this._password    = value;
  this.passwordHash = bcrypt.hashSync(value, bcrypt.genSaltSync(8));
}

function setPasswordConfirmation(passwordConfirmation) {
  this._passwordConfirmation = passwordConfirmation;
}

function validatePasswordHash() {
  if (this.isNew) {
    if (!this._password) {
      return this.invalidate('password', 'A password is required.');
    }

    if (this._password.length < 6) {
      this.invalidate('password', 'must be at least 6 characters.');
    }

    if (this._password !== this._passwordConfirmation) {
      return this.invalidate('passwordConfirmation', 'Passwords do not match.');
    }
  }
}

function validateEmail(email) {
  if (!validator.isEmail(email)) {
    return this.invalidate('email', 'must be a valid email address');
  }
}

function validatePassword(password){
  return bcrypt.compareSync(password, this.passwordHash);
}

//https://scotch.io/tutorials/making-mean-apps-with-google-maps-part-i
// Sets the created_at parameter equal to the current time
userSchema.pre('save', function(next){
  const now = new Date();
  this.updated = now;
  if(!this.created) {
    this.created= now;
  }
  next();
});

// Indexes this schema in 2dsphere format (critical for running proximity searches)
userSchema.index({location: '2dsphere'});
