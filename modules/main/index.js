var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.passport.user){
    res.redirect('/dahsboard#/');
    return
  }
  res.render('main/views/home');
});

router.get('/expose/:module/:template',function(req, res, next){
  res.render(req.params.module + '/views/' + req.params.template);
});

module.exports = router;
