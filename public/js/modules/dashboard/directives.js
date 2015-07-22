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
            <li><a class="btn-floating red waves-effect waves-light" ng-click='ligar()'><i class="material-icons">insert_chart</i></i></a></li>
            <li><a class="btn-floating yellow darken-1 waves-effect waves-light" ng-click='desligar()'><i class="material-icons">format_quote</i></a></li>
            <li><a class="btn-floating green waves-effect waves-light" ng-click='ping()'><i class="material-icons">publish</i></a></li>
            <li><a class="btn-floating blue"><i class="material-icons">attach_file</i></a></li>
          </ul>
        </div>
      */
    }),
    link: function(scope,elem, attr){
      scope.ligar = function(){
        BOT.connect();
      }
      scope.desligar = function(){
        BOT.disconnect()
      }
      scope.ping = function(){
        BOT.ping();
      }
    }
  }
})
