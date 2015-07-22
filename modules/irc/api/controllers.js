var client = require('../../../config/irc');
var io = require('../../../config/io');
var _user = require('../../users/model');
var request = require('request');

var toasts = io.of('/toasts').on('connection',function(socket){
  return socket;
});

var statusLuhbot = false;
client.addListener('connected',function(adress,port){
  toasts.emit('newMessage',{msg:'Conectado'});
});
client.addListener('disconnected',function(reason){
  toasts.emit('newMessage',{msg:'Luhbot desconectado'});
  console.log('desconectado',reason)
});
client.addListener('connectfail',function(){
  toasts.emit('newMessage',{msg:'Luhbot não conseguiu se conectar'});
});
client.addListener('pong',function(l){
  statusLuhbot = l;
  toasts.emit('newMessage',{msg:'Latência luhbot :'+ statusLuhbot});
});
client.addListener('join',function(channel,username){
  client.say(channel, "Olar! sou a "+ username + " e vim amar vocês *-*");
  toasts.emit('newMessage',{msg:'Luhbot entrou na sala'});
});
client.addListener('chat',function(channel,user,message){
  if(client.utils.uppercase(message) >= 0.4){
    client.say(channel, "@"+ user.username.toString() + " Ó U BAN VINO LEEEEEK");
  }
  var msg = message.toLowerCase();
  switch(true){
    case msg.split(' ').indexOf('!luhzinha') >= 0:
      client.say(channel,"Facebook: https://www.facebook.com/Luhzinhapage https://twitter.com/Luhzinhaluna https://www.youtube.com/user/luhzinhaplayer https://instagram.com/luhzinhaluna/");
      break;
    case msg.split(' ').indexOf('!subscribers') >= 0:
      client.say(channel,"Seja um subscriber! Subscribers tem direito a sorteios de jogos da steam, prioridade para jogar na live e um teamspeak para falar com a Luhzinha.");
      break;
    case msg.split(' ').indexOf('!eu') >= 0:
      _user.findOne({twitchId: req.session.passport.user.twitchId},{bio:1},function(err,doc){
        if(err){
          throw new Error(err)
        }
        client.say(channel, doc.bio);
      });
      break;
    case msg.split(' ').indexOf('!ping') >= 0:
      client.say(channel,'@'+ user.username + ', pong');
      break;
    case msg.split(' ').indexOf('@luhbot') >= 0:
      var talks = [
        'Oiii tudo bem amore?',
        'Você fala muito :(',
        'Quero doce :(',
        'Amanda?',
        'Romero brito?',
        'SAMU?!?',
        'Seu **...'
      ];
      var index = Math.floor(Math.random() * 7) ;
      client.say(channel,talks[index]);
      break;
    default:
      // client.say(channel, '@'+user.username.toString() + ' disse ' + message.toString());
  }
});

module.exports = {
  connect : function(req,res,next){
    if(!statusLuhbot) {
      client.connect().then(function(){
        statusLuhbot = true;
      });
      client.join(req.session.passport.user.twitchUser);
      res.status(200).json({msg: 'Conectando Luhbot'});
      return;
    }
    res.json({msg:"Luhbot ja está conectado"});
  },
  disconnect : function(req,res,next){
    if(!statusLuhbot){
      res.json({msg:'Luhbot já está desconectado'});
      return;
    }
    res.status(202).json({msg:'Desconectando luhbot'});
    client.disconnect();
    statusLuhbot = false;
  },
  ping : function(req, res, next){
    if(!statusLuhbot){
      res.json({msg:'Luhbot está desconectado'});
      return;
    }
    res.json({msg:'Enviando ping'});
    client.ping();
  }
}
