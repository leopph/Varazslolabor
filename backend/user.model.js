const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  isAdmin: { type: Boolean, required: true }
}, { collection: 'users' });

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
    }
    catch (error) {
      return next(error);
    }
  }

  return next();
});

userSchema.methods.comparePasswords = function(password, next) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    next(err, isMatch);
  });
};

mongoose.model('user', userSchema);
