var passport = require('passport'),
  bCrypt = require('bcrypt-nodejs'),
  twitchStrategy = require('passport-twitchtv').Strategy,
  User = require('../modules/users/model'),
  redis = require('./redis');

///////////////////// Strategies ///////////////////////

passport.use(new twitchStrategy({
    clientID: process.env.LUHBOT_TWITCH_CLIENT_ID || '5ly77uvih89ugnp10vryol48pqlm6no',
    clientSecret: process.env.LUHBOT_TWITCH_SECRET || 'bnei1h59ilxsp4hmemyezgdgy00fawu',
    callbackURL: process.env.LUHBOT_TWITCH_CB || "http://localhost:3000/auth/twitch/callback",
    scope: [
      "user_read",
      "user_subscriptions",
      "channel_subscriptions",
      "user_follows_edit",
      "user_blocks_edit",
      "user_blocks_read",
      "channel_check_subscription",
      "chat_login"
    ]
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function(){
      redis.set(profile.id + '-token', accessToken);
      User.findOne({twitchId: profile.id}, function(err, user){
        if(err){
          return done(err,null);
        }
        if(!user){
          user = {
            twitchId: profile.id,
            twitchUser : profile.username,
            displayName: profile.displayName,
            provider: 'twitch',
            email: profile.email,
            bio: profile.bio
          };
          User.create(user,function(err,doc){
            return done(err,doc)
          });
        }
        return done(err,user);
      });
    });
  }
));
//serializers
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;
