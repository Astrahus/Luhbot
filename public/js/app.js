angular.module('luhbot',[
  'ui.router',
  'dashboard'
])
//TODO: Persistance of socket
.factory('IO',function(Toasts){
  var IO = function(){
    this.namespace = null;
    this.socket = {};
    var self = this;

    this.connect = function(namespace){
      if(namespace){
        this.namespace = String('/').concat(namespace);
        this.socket = io.connect(String("http://").concat(window.location.hostname).concat(':7171').concat(this.namespace));
        return this;
      }
      this.socket = io.connect(String("http://").concat(window.location.hostname).concat(':7171').concat(this.namespace));
      return this;
    }

    this.listenNewMessages = function(){
      this.socket.on('newMessage',function(data){
        Toasts.makeToast(data.msg);
      });
      return this;
    }

    this.joinChannel = function(channel){
      this.socket.emit('joinChannel', channel);
      console.log('join')
      return this;
    }

    return this;
  }
  return new IO;
})
.factory('Toasts',function(){

  function makeToast(message){
    Materialize.toast(message, 4000);
  }
  return {
    makeToast: makeToast
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
      $http.get('/api/twitch/update/user')
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
.run(function(IO, User){
  User.getData('twitchUser').then(function(channel){
    IO.connect('alerts').listenNewMessages().joinChannel(channel);
  });
});
