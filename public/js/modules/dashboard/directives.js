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
            <li><a class="btn-floating green waves-effect waves-light tooltipped" data-position="left" data-delay="50" data-tooltip="Ping" ng-click='ping()'><i class="material-icons">settings_remote</i></a></li>
          </ul>
        </div>
      */
    }),
    link: function(scope,elem, attr){
      scope.ligar = function(){
        BOT.connect();
      }
      scope.ping = function(){
        BOT.ping();
      }
    }
  }
})
