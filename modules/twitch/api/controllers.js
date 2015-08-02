var request = require('request');
var User = require('../../users/model');
var redis = require('../../../config/redis');
var defaultUrl = 'https://api.twitch.tv/kraken/';
var headers = {Accept: 'application/vnd.twitchtv.v3+json'};
module.exports = {
  updateUser : function(req, res, next){
    request({
      url:defaultUrl+ 'users/' + req.session.passport.user.twitchUser,
      headers: headers
    },function(err,response,body){
      if(!err && response.statusCode == 200){
        body = JSON.parse(body);
        User.update({twitchId:body._id},{$set:{bio: body.bio,displayName: body.displayName}},function(err,doc){
          if(err){
            throw new Error(err);
          }
          res.status(200).json(doc);
        });
      }
      if(err){
        console.log(err);
      }
    });
  },
  getSubscriptions: function(req,res,next){
    redis.hget(req.session.passport.user.twitchId,'token', function(err, reply){
      headers.Authorization = String('OAuth ').concat(reply);   
      request({
        url:defaultUrl+ 'channels/' + req.session.passport.user.twitchUser + '/subscriptions?direction=desc',
        headers: headers
      },function(err,response,body){
        body = JSON.parse(body);
        if(err || response.statusCode != 200){
          if(response.statusCode === 422){
            res.status(422).json([]);
            return;
          }
          res.status(500).end();
          return;
        };
        res.json(body);
      });
    });
  },
  getLastSubscription: function(req, res, next){
    redis.hget(req.session.passport.user.twitchId,'token',function(err,reply){
      headers.Authorization = String('OAuth ').concat(reply);
      request({
        url: defaultUrl + 'channels/' + req.session.passport.user.twitchUser + '/subscriptions?direction=desc&limit=1',
        headers: headers
      },function(err, response, body){

        console.log(req.params.param)
        body = JSON.parse(body);
        if(err || response.statusCode != 200){
          if(response.statusCode == 422){
            res.status(422).json({});
            return;
          }
          res.status(404).end();
          return;
        }
        console.log(body);
        if(req.params.param != undefined && body.users.indexOf(req.params.param) >= 0){

          res.status(200).send(body.user[req.params.param]).end();
        
        }

        res.json(body);
      })
    });
  }
}
