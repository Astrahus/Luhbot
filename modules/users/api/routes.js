var express = require('express'),
  router = express.Router(),
  User = require('../model');

router.get('/', function(req, res, next){
  User.find({},function(err,docs){
    if(err){
      console.log(err);
      res.status(500).json({error:err});
    }
    res.json(docs);
  });
});

router.put('/',function(req, res, next){
  User.create(req.body,function(err, doc){
    if(err){
      console.log(err);
      res.status(500).json({error:err});
    }
    res.status(201).json(doc);
  })
});

module.exports = router;
