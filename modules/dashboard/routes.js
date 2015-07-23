var express = require('express'),
  router = express.Router(),
  passport = require('../../config/passport')

router.get('/',function(req, res, next){
  if(req.session.passport.user){
    res.render('dashboard/views/layout');
    return;
  }
  res.redirect('/');
});

module.exports = router;
