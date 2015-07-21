angular.module('dashboard',[
  'dashboard.controllers',
  'dashboard.services',
  'dashboard.directives'
])

.config(function($stateProvider){
  $stateProvider
    .state('dashboard',{
      url: '/',
      views:{
        'content':{
          templateUrl: '/expose/dashboard/index.jade',
          controller: 'dashboardCtrl'
        }
      }
    })
});
