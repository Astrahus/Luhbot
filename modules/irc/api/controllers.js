var client = require('../../../config/irc');
var io = require('../../../config/io');
var redis = require('../../../config/redis');
var _user = require('../../users/model');
var twitch = require('../../twitch/api/controllers');
var request = require('request');
var profile = 0;
var statusLuhbot = null;
var alerts = io.on('connection',function(socket){
  return socket;
});

function getLuhbotStatus(userId){
  return redis.hget(userId,'status',function(reply){
    return reply;
  });
}

client.connect();

client.addListener('connected',function(adress,port){
  alerts.emit('newMessage',{msg:'Conectado'});
});

client.addListener('disconnected',function(reason){
  alerts.emit('newMessage',{msg:'Luhbot desconectado'});
});

client.addListener('connectfail',function(){
  alerts.emit('newMessage',{msg:'Luhbot não conseguiu se conectar'});
});

client.addListener('pong',function(l){
  alerts.to(profile).emit('newMessage',{msg:'Latência luhbot :'+ l});
});

client.addListener('join',function(channel,username){
  client.say(channel, "Olar! sou a "+ username + " e vim amar vocês *-*");
  client.say(channel, "/color BlueViolet");
  alerts.to(profile).emit('newMessage',{msg:'Luhbot entrou na sala'});
});

client.addListener('chat',function(channel,user,message){
  console.log(user);
  if(!statusLuhbot){
    return;
  }
  if(client.utils.uppercase(message) >= 0.8){
    client.timeout(channel, user.username, 1).then(function(){
      client.say(channel, "@"+ user.username.toString() + " Ó U BAN VINO LEEEEEK");
    })
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
    case msg.split(' ').indexOf('!patrocinador') >= 0:
      client.say(channel," Quer comprar um jogo ou um console por um preço bacana? Entra aqui na loja LFX games e use o cupom LUHZINHA (tudo maiúsculo) e ganhe 10% de desconto na sua compra <3 http://www.lfxgames.com.br/");
      break;
    case msg.split(' ').indexOf('!eu') >= 0:
      _user.findOne({twitchId: profile}, function(err,doc){
        if(err || !doc ){
          console.log(err);
          return;
        }
        if(!doc.isSelected('bio')){
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
        'Seu **',
        'Katrina?',
        'Adriano? Alá Juliana! Seu **! Faz isso comigo não velho',
        'Guarapari búzios, é minha arte!',
        'Rave? RAVE? Felipe! Smith! Seu **',
        '16, 18, quebro véi, quebro o meu braço! Quebroo o meu braço',
        'minha vida? Cabô',
        '5 quilometros?'
      ];
      var index = Math.floor(Math.random() * talks.length) ;
      client.say(channel,talks[index]);
      break;
  }
});

var _irc = {
  join: function(req, res, next){
    redis.hget(req.session.passport.user.twitchId,"status",function(err, actualState){
      if(err){console.log(err)};
      if(actualState == "on"){
        res.json({msg:"Luhbot já está conectada"});
        return;
      }
      client.join(req.session.passport.user.twitchUser);
      profile = req.session.passport.user.twitchId;
      statusLuhbot = true;
      redis.hset(profile,"status","on",redis.print);
      res.status(202).json({msg:"Conectando luhbot no canal"});
    });
  },
  ping : function(req, res, next){
    res.json({msg:'Enviando ping'});
    client.ping();
  },
  disconnect: function(req, res, next){
    statusLuhbot = redis.hget(profile,"status",function(err,actualState){
      return actualState;
    });
    if(statusLuhbot == "off"){
      res.json({msg:'Luhbot já está desconectada'});
      return;
    }
    statusLuhbot = false;
    redis.hset(req.session.passport.user.twitchId,"status","off",redis.print);
    res.json({msg:'Luhbot foi desconectada'});
  }
}

module.exports = _irc;
