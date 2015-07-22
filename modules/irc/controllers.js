var client = require('../../config/irc');
module.exports = {
  conectar : function(req,res,next){
    client.connect().then(function(){
      console.log('conectando...')
    });
    try{
      client.addListener('connected',function(adress,port){
        client.join(req.session.passport.user.twitchUser);
        client.addListener('join',function(channel,username){
          client.say(channel, "Olar! sou a "+ username + " e vim amar vocês *-*");
        });
        client.addListener('chat',function(channel,user,msg){
          console.log('chating')
          switch(msg.toString()){
            case '!brasil':
              client.say(channel,"7X1 7X1 7X1 7X1");
              break;
            case '!comandos':
              client.say(channel,'/w '+ user.username + " !brasil, !comandos, !stream");
              break;
            case '!raw':
              client.raw('RAWR RAWR RAWR')
              break;
            default:
            console.log(user);
              client.say(channel, '@'+user.username.toString() + ' disse ' + msg.toString());
          }
        });
      });
      res.status(200).end();
    }catch(Exception){
      throw new Error(Exception);
    }
  },
  desconectar : function(channelPassed){

  }
}
