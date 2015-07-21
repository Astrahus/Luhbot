angular.module('luhbot',[
  'ui.router',
  'dashboard'
])
.config(function($urlRouterProvider){
  $urlRouterProvider.otherwise('/dashboard');
})
.factory('socketIO',function(){
  
})
.run()
