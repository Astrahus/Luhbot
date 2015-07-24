var User = require('../model');

var _ctrl = {
  getAll : function(req,res,next){
    User.find({},function(err,docs){
      if(err){
        console.log(err);
        res.status(500).json({error:err});
      }
      res.json(docs);
    });
  },
  getOne: function(req, res, next){
    if(req.params.id == "me"){
        res.json(req.session.passport.user);
        return;
    }
    User.findOne({_id:req.params.id},function(err,doc){
      if(err){
        res.status(500).json({error:err});
        return;
      }
      res.status(200).json(doc);
    });
  },
  createUser: function(req, res, next){
    User.create(req.body,function(err, doc){
      if(err){
        console.log(err);
        res.status(500).json({error:err});
      }
      res.status(201).json(doc);
    });
  },
  editUser: function(req, res, next){
    //TODO req.body deve conter os dados para alteração de usuário,
    // validar se é melhor pegar o ID pela rota (usando req.params) ou na body
    res.status(501).end();
  }
}

module.exports = _ctrl;
