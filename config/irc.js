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

module.exports = client;
