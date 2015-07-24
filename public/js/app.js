angular.module('luhbot',[
  'ui.router',
  'dashboard'
])
.factory('Toasts',function(User){
  var userId = User.getData('twitchId');
  function makeToast(message){
    Materialize.toast(message, 4000);
  }
  function listenIO(){
    userId.then(function(id){
      var messages = io.connect('http://' + window.location.hostname + ':7171')
      messages.on('newMessage',function(data){
        makeToast(data.msg);
      });
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

  function restart(){
    $http.get('/api/irc/force')
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
.factory('User',function($http,$q){
  var _user = new Object();
  var df = $q.defer();
  function getUserApi(){
    $http.get('/api/users/me')
      .success(function(data,status){
        df.resolve(data);
      })
      .error(function(data,status){
        console.error(data);
        df.reject(data)
      });
      return df.promise;
  }
  function retrieveUserData(property){
    if(!Object.keys(_user).length){
      return getUserApi().then(function(data){
        _user = data;
        if(property){
          return _user[property];
        }
        return _user;
      });
      ;
    }
    if(property){
      return _user[property];
    }
    return _user;
  }
  return {
    getData: retrieveUserData
  }
})
.config(function($urlRouterProvider){
  $urlRouterProvider.otherwise('/dashboard');
})
.run(function(Toasts){
  Toasts.listenIO();
});
