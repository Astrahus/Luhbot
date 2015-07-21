var irc = require('../../config/irc');
module.exports = {
  conectar : function(){
    irc.connect().then(function(){
      console.log('conectado')
    })
  }
}
