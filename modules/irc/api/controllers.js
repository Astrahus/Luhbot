var client = require('../../../config/irc');
var io = require('../../../config/io');
var _user = require('../../users/model');
var twitch = require('../../twitch/api/controllers');
var request = require('request');
var profile = 0;

var toasts = io.of('/toasts').on('connection',function(socket){
  return socket;
});
var statusLuhbot = false;

client.connect().then(function(){
  statusLuhbot = true;
  console.log('luhbot conectado');
});

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
  if(!statusLuhbot){
    return false;
  }
  if(client.utils.uppercase(message) >= 0.4){
    client.say(channel, "@"+ user.username.toString() + " Ó U BAN VINO LEEEEEK");
    return;
  }
  var re = new RegExp(/(http(s)?:\/\/)?\w{2,}\.\w{2,}(\.\w{2,})*/g);
  if(re.test(message.toString())){
    client.timeout(channel, user.username, 10).then(function(){
      client.say(channel,'E da proxima vez, @' + user.username.toString() + ' vai mandar link na stream da sua avó!');
    });
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
      _user.findOne({twitchId: profile}, function(err,doc){
        if(err || !doc ){
          console.log(err);
          return;
        }
        if(!doc.hasOwnProperty('bio')){
          return;
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
        'Seu **'
      ];
      var index = Math.floor(Math.random() * talks.length) ;
      client.say(channel,talks[index]);
      break;
    default:
      console.log(message)
      // client.say(channel, '@'+user.username.toString() + ' disse ' + message.toString());
  }
});

var _irc = {
  join: function(req, res, next){
    if(!statusLuhbot){
      res.json({msg:'Luhbot não está conectado'});
      return;
    }
    client.join(profile || req.session.passport.user.twitchUser).then(function(){
      profile = req.session.passport.user.twitchId;
      toasts.emit('newMessage',{msg:'Entrando na sala'});
    });
    res.status(202).end();
  },
  ping : function(req, res, next){
    if(!statusLuhbot){
      res.json({msg:'Luhbot está desconectado'});
      return;
    }
    res.json({msg:'Enviando ping'});
    client.ping();
  },
  disconnect: function(req, res, next){
    if(!statusLuhbot){
      res.json({msg:'Luhbot está desconectado'});
      return;
    }
    statusLuhbot = false;
    res.json({msg:'Luhbot foi desconectado'});
  },
  forceRestart: function(req, res, next){
    client.disconnect();
    client.connect();
    client.join(profile || req.session.passport.user.twitchUser);
  }
}

module.exports = _irc;
