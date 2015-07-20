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
    //TODO Quando passar um ID na rota, deve retornar apenas um usuario
    res.status(501).end();
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
