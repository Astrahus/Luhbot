var client = require('../../../config/irc');
var io = require('../../../config/io');
var redis = require('../../../config/redis');
var _user = require('../../users/model');
var twitch = require('../../twitch/api/controllers');
var request = require('request');
var profile = 0;
var statusLuhbot = null;
var chatDelayControl = {
  luhzinha : false,
  eu: false,
  subscribers: false,
  patrocinador: false
}
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
  //iff luhbot off
  if(!statusLuhbot){
    return;
  }
  //Users chat controll

  if(user.special.indexOf('mod') == -1 && user.special.indexOf('broadcaster') == -1 ){
    if(client.utils.uppercase(message) >= 0.8){
      client.timeout(channel, user.username, 10).then(function(){
        client.say(channel, "@"+ user.username.toString() + " evite usar caps");
      });
      return;
    }
    //if link, ban of 10 secons
    var re = new RegExp(/(http(s)?:\/\/)?\w{2,}\.\w{2,}(\.\w{2,})*/g);
    if(re.test(message.toString())){
      client.timeout(channel, user.username, 10);
      return;
    }
  }
  var msg = message.toLowerCase().split(' ');
  //switch of global enabled actions
  switch(true){
    case msg.indexOf('!luhzinha') >= 0:
      if(!chatDelayControl.luhzinha){
        chatDelayControl.luhzinha = true;
        client.say(channel,"Facebook: https://www.facebook.com/Luhzinhapage https://twitter.com/Luhzinhaluna https://www.youtube.com/user/luhzinhaplayer https://instagram.com/luhzinhaluna/");
        setTimeout(function(){
            chatDelayControl.luhzinha = false;
        },10);
      }
    break;

    case msg.indexOf('!subscribers') >= 0:
      if(!chatDelayControl.subscribers){
        chatDelayControl.subscribers = true;
        client.say(channel,"Seja um subscriber! Subscribers tem direito a sorteios de jogos da steam, prioridade para jogar na live e um teamspeak para falar com a Luhzinha.");
        setTimeout(function(){
            chatDelayControl.subscribers = false;
        },10);
      }
    break;

    case msg.indexOf('!patrocinador') >= 0:
      client.say(channel," Quer comprar um jogo ou um console por um preço bacana? Entra aqui na loja LFX games e use o cupom LUHZINHA (tudo maiúsculo) e ganhe 10% de desconto na sua compra <3 http://www.lfxgames.com.br/");
    break;

    case msg.indexOf('!eu') >= 0:
      _user.findOne({twitchId: profile}, function(err,doc){
        console.log(doc)
        if(err || !doc ){
          console.log(err);
          return;
        }
        if(!doc.isSelected('bio') || doc.bio == null){
          return;
        }
        client.say(channel, doc.bio);
      });
    break;

    case msg.indexOf('!ping') >= 0:
      client.say(channel,'@'+ user.username + ', pong');
    break;

    case msg.indexOf('@luhbot') >= 0:
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

    case msg.indexOf('!enquete') == [0]:
      //make a
      client.say(channel,'Enquete em desenvolvimento');
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
