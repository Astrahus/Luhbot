var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

module.exports = new Schema({
  name: {type: String},
  displayName : {type: String},
  twitchId: {type: String},
  twitchUser : {type: String},
  email: {type: String},
  commands: [],
  provider: {type: String},
  created: {type: Date, default: Date.now},
  bio: {type:String}
});
