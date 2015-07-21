var express = require('express');
var router = express.Router();
var passport = require('../../config/passport');

router.get('/twitch',passport.authenticate('twitchtv',{session:true}));

router.get('/twitch/callback',
  passport.authenticate('twitchtv', { failureRedirect: '/erro' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  }
);

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
