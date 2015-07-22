angular.module('luhbot',[
  'ui.router',
  'dashboard'
])
.factory('Toasts',function(){
  function makeToast(message){
    Materialize.toast(message, 4000);
  }
  function listenIO(){
    var messages = io.connect('http://localhost:3001/toasts');
    messages.on('newMessage',function(data){
      makeToast(data.msg);
    });
  }
  return {
    makeToast: makeToast,
    listenIO : listenIO
  }
})
.config(function($urlRouterProvider){

  $urlRouterProvider.otherwise('/dashboard');
})

.run(function(Toasts){
  Toasts.listenIO();
})
