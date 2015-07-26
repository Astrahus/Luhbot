var _config = require('../../../config/spotify.json');
var request = require('request');

// router.get('/login', function(req, res) {
// var scopes = 'user-read-private user-read-email';
// res.redirect('https://accounts.spotify.com/authorize' +
//   '?response_type=code' +
//   '&client_id=' + my_client_id +
  (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
  '&redirect_uri=' + encodeURIComponent(redirect_uri));
// });

function login(req, res, next){
  var urlEncoded = String('https://accounts.spotify.com/authorize')
    .concat('?response_type=code','&client_id=',_config.client.id)
    .concat('&scope=', encodeURIComponent(_config.scopes))
    .concat('&redirect_uri=', encodeURIComponent(_config.redirect_uri));
    res.redirect(urlEncoded);
}
