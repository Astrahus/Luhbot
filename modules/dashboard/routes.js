var express = require('express'),
  router = express.Router(),
  passport = require('../../config/passport')

router.get('/',function(req, res, next){
  res.render('dashboard/views/layout');
});

module.exports = router;
