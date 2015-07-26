var _config = require('../../../config/spotify.json');
var request = require('request');


function login(req, res, next){
  var urlEncoded = String('https://accounts.spotify.com/authorize')
    .concat('?response_type=code','&client_id=',_config.client.id)
    .concat('&scope=', encodeURIComponent(_config.scopes))
    .concat('&redirect_uri=', encodeURIComponent(_config.redirect_uri));
    res.redirect(urlEncoded);
}


module.exports = {
  login: login
}
