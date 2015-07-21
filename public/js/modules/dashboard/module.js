angular.module('dashboard',[
  'dashboard.controllers',
  'dashboard.services'
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
