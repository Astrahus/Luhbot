var irc = require('twitch-irc');

var clientOptions = {
    options: {
        debug: true,
        debugIgnore: ['ping', 'chat', 'action']
    },
    identity: {
        username: 'Luhbot',
        password: 'oauth:kzg26inv3krxaf1pl85r2soz9om4ae'
    },
    connection: {
      preferredServer : 'irc.twitch.tv',
      preferredPort : 6667
    }
};

// Calling a new instance..
var client = new irc.client(clientOptions);

client.addListener('disconnected',function(reason){
  console.log('desconectado',reason)
  throw new Error(reason);
});
client.addListener('connectfail',function(){
  console.log('Erro de conexão');
});

client.addListener('chat',function(channel, user, message){
  if(client.utils.uppercase(message) >= 0.4){
    client.say(channel, "@"+ user.username.toString() + " Por favor, desligue seu CAPS para evitar futuros banimentos");
  }
})
module.exports = client;
