var express = require('express');
var router = express.Router();
var ctrl = require('./controllers');

router.get('/',function(req,res,next){
  console.log(req.session.passport)
});


module.exports = router;
