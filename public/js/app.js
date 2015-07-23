angular.module('luhbot',[
  'ui.router',
  'dashboard'
])
.factory('Toasts',function(){
  function makeToast(message){
    Materialize.toast(message, 4000);
  }
  function listenIO(){
    var messages = io.connect(window.location.origin +':7171/toasts');
    messages.on('newMessage',function(data){
      makeToast(data.msg);
    });
  }
  return {
    makeToast: makeToast,
    listenIO : listenIO
  }
})
.factory('BOT',function($http,Toasts){
  function connect(){
    $http.get('/api/irc/turn/on')
      .success(function(data,status){
        Toasts.makeToast(data.msg)
      })
      .error(function(data,status){
        Toasts.makeToast(data.msg)
      });
  }

  function disconnect(){
    $http.get('/api/irc/turn/off')
      .success(function(data,status){
        Toasts.makeToast(data.msg)
      })
      .error(function(data,status){
        Toasts.makeToast(data.msg)
      });
  }
  function ping(){
    $http.get('/api/irc/ping')
      .success(function(data,status){
        Toasts.makeToast(data.msg)
      })
      .error(function(data,status){
        Toasts.makeToast(data.msg)
      });
  }

  return {
    connect : connect,
    disconnect: disconnect,
    ping : ping
  }
})
.config(function($urlRouterProvider){

  $urlRouterProvider.otherwise('/dashboard');
})

.run(function(Toasts){
  Toasts.listenIO();
})
