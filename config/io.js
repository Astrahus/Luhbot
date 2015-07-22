var io = require('socket.io')(3001)

var teste = io
  .of('/toasts')
  .on('connection',function(socket){
    socket.emit('newMessage',{msg:'oie'})
  });

  teste.emit('newMessage',{msg: 'oiii'})

  module.exports = teste;
