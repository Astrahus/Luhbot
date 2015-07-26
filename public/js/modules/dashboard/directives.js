angular.module('dashboard.directives',[])

.directive('bottomMenu',function(BOT){
  return {
    scope: {},
    template: window.multiline(function(){
      /*
        <div class="fixed-action-btn" style="bottom: 45px; right: 24px;">
          <a class="btn-floating btn-large red">
            <i class="large material-icons">mode_edit</i>
          </a>
          <ul>
            <li><a class="btn-floating red waves-effect waves-light tooltipped" data-position="left" data-delay="50" data-tooltip="Ligar" ng-click='ligar()'><i class="material-icons">power_settings_new</i></i></a></li>
            <li><a class="btn-floating red waves-effect waves-light tooltipped" data-position="left" data-delay="50" data-tooltip="Desligar" ng-click='desconectar()'><i class="material-icons">power_settings_new</i></i></a></li>
            <li><a class="btn-floating green waves-effect waves-light tooltipped" data-position="left" data-delay="50" data-tooltip="Ping" ng-click='ping()'><i class="material-icons">settings_remote</i></a></li>
          </ul>
        </div>
      */
    }),
    controller: function($scope,IO){
      $scope.ligar = function(){
        BOT.connect();
      }
      $scope.ping = function(){
        BOT.ping();
      }
      $scope.desconectar = function(){
        BOT.disconnect();
      }
    }
  }
})
.directive('twitchChat',function(User){
  return {
    scope: {
      'width' : '=',
      'height': '='
    },
    template: window.multiline(function(){/*
      <iframe ng-if='channel' frameborder="0"
        scrolling="true"
        id="chat_embed"
        src={{trust(linkChat)}}
        height="{{height}}"
        width="{{width}}">
        </iframe>
        */
    }),
    controller: function($scope,User,$sce){
      $scope.trust = function(src) {
        return $sce.trustAsResourceUrl(src);
      }
      $scope.channel = User.getData('twitchUser');
      // http://twitch.tv/chat/embed?channel=tunxlol&popout_chat=true
      $scope.linkChat = "http://www.twitch.tv/" + $scope.channel + "/chat"
    }
  }
})
