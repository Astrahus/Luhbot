var irc = require('twitch-irc');
var io = require('./io');
var toasts = io.of('/toasts').on('connection',function(socket){
  return socket;
});

var clientOptions = {
    options: {
        debug: true,
        debugIgnore: ['ping', 'chat', 'action'],
        tc: 2
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

module.exports = client;
