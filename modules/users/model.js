var mongoose = require('mongoose'),
  userSchema = require('./schema');

module.exports = mongoose.model('User', userSchema);
