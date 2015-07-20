var express = require('express');
var router = express.Router();
var passport = require('../../config/passport');

router.get('/twitch',passport.authenticate('twitchtv'));

router.get('/twitch/callback',function(req, res, next){
  passport.authenticate('twitchtv',function(err,user,info){
    if(err) console.log('err',err);
    if(!user) console.log('No user', user);
    if(info) console.log(info);

    res.json(user);
  })(req,res)
});

module.exports = router;
