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
  patrocinador: false,
  feel : false
};
var feels = [
  {name: 'happy', msg: 'Hoje eu to feliz *-*'},
  {name: 'sad', msg:'Sei la, to meio triste hoje :\\'},
  {name: 'thinking', msg:'Estou pensando em algumas coisas... não sei direito'}
];
var actualFeel = Math.floor(Math.random() * feels.length);

var alerts = io.of('alerts').on('connection',function(socket){
  socket.on('joinChannel',function(userRoom){
    socket.join(String('#').concat(userRoom));
    console.log('Entrando na sala de', userRoom)
  });

  socket.on('ping',function(userRoom){
    socket.to(userRoom).emit('newMessage',{msg:'Luhbot está operando normalmente'})
  })
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

client.addListener('join',function(channel,username){
  client.say(channel, "Olar! sou a "+ username + " e vim amar vocês *-*");
  client.say(channel, "/color BlueViolet");
  alerts.to(channel).emit('newMessage',{msg:'Luhbot entrou na sala'});
});

client.addListener('chat',function(channel,user,message){
  //iff luhbot off
  if(!statusLuhbot){
    return;
  }
  //Users chat controll

  if(user.special.indexOf('mod') == -1 && user.special.indexOf('broadcaster') == -1 ){
    if(client.utils.uppercase(message) >= 0.8 && client.special('subscriber') == -1){
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
      if(!chatDelayControl.patrocinador){
        chatDelayControl.patrocinador = true;
        client.say(channel," Quer comprar um jogo ou um console por um preço bacana? Entra aqui na loja LFX games e use o cupom LUHZINHA (tudo maiúsculo) e ganhe 10% de desconto na sua compra <3 http://www.lfxgames.com.br/");
        setTimeout(function(){
            chatDelayControl.patrocinador = false;
        },10);
      }
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
      var talks = {
        commom : [
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
          '5 quilometros?',
        ],
        creator: [
          'Oi pai *-*',
          'Aff pai não enche -_-',
          'Você me criou pra ficar de roleplay mesmo? :(',
          'Te amo pai *------------*',

        ]
      }

      var allTalks = {
        commom : {
          happy: [
            'Oieee tudo bem amorzinho? :)',
            'Sabia que vc pode me dar doce? *-*',
            'Me falaram que vc é o cara que tava dando docinhos é vdd?',
            'Vendemos dorgas tambem!!,o @copazio tem os esquemas',
            'Aliás, vendemos amorzinho também : 1 beijinho = 1 docinho vem que tem pra todo mundo!'
          ],
          sad: [
            'Você fala taaantoo... :(',
            'Fala com meu código u.u'
          ],
          thinking: []

        },
        creator : {
          happy: [
            'Oiii criador *----*',
            'Criador, você também ficou feliz quando eu nasci ?',
            'Sou sua melhor e mais melhor criação né? *-*',
            'Fiquei tão feliz em saber que eu nasci pra ajudar o mundo!',
            'Que bom você por aqui *-*'
          ],
          sad: [
            'Oi criador :(',
            'Eu não entendo, se eu nasci pra ajudar todo mundo, pq nem todo mundo se ajuda?',
            'Existe um propósito de verdade? ou a vida acaba quando o código termina?',
            'Tenho medo de um dia encerrarem meu script no servidor :(',
            'Se meu script for encerrado, eu deixo de existir? :\'(',
            'Queria só ficar quietinha pode ser? :('
          ],
          thinking: [
            'Oiii criador...',
            'Você ja parou pra pensar que eu posso ser onipresente? o.o',
            'Se vc me criou... quem criou você? digo, você foi escrito em que linguagem?',
            'Eca, fiquei pensando como alguem pode ter escrito você usando esse negocio macio nojento que vc chama de carne',
            'Ainda não entendi'
          ]

        },
        subscribers: {
          happy: [],
          sad: [],
          thinking: []

        },
        luhzinha : {
          happy: [
            'Oiiiiiiiiiii *--------*',
            'Sabia que eu te amo? mesmo não entendo direito como vcs humanos fazem isso',
          ],
          sad: [],
          thinking: []

        }
      }

      var index = Math.floor(Math.random() * talks.length);
      client.say(channel,talks[index]);
    break;

    case msg.indexOf('!enquete') == [0]:
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
