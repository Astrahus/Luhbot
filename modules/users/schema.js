var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

module.exports = new Schema({
  name: String,
  displayName : String,
  twitchId: String,
  twitchUser : String,
  email: String,
  commands: [],
  provider: String,
  created: {type: Date, default: Date.now}
});
