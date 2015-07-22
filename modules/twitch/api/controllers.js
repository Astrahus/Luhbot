var request = require('request');
var headers = {Accept: 'application/vnd.twitchtv.v3+json'};
var defaultUrl = 'https://api.twitch.tv/kraken/';
var User = require('../../users/model');


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
        throw new Error(err);
      }
    });
  }
}
