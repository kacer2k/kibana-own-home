import chrome from 'ui/chrome';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import './less/main.less';
import template from './templates/index.html';

function generateUserInfo(resp, tab, object) {
  return {
    currentKibanaIndex: resp.data.currentKibanaIndex,
    kibanaIndexPrefix: resp.data.kibanaIndexPrefix,
    username: resp.data.username,
    groups: resp.data.groups,
    moveTo: tab ? {tab: tab, object: object || ''} : null,
    backHref: resp.data.backHref
  }
}

uiRoutes.enable();
uiRoutes
.when('/:suffix', {
  template,
  resolve: {
    userInfo($route, $http) {
      return $http.get('../api/own_home/selection/' + $route.current.params.suffix).then(function (resp) {
        return generateUserInfo(resp, null, null);
      });
    }
  }
}).when('/:suffix/:tab', {
  template,
  resolve: {
    userInfo($route, $http) {
      return $http.get('../api/own_home/selection/' + $route.current.params.suffix).then(function (resp) {
        return generateUserInfo(resp, $route.current.params.tab, null);
      });
    }
  }
}).when('/:suffix/:tab/:object', {
  template,
  resolve: {
    userInfo($route, $http) {
      return $http.get('../api/own_home/selection/' + $route.current.params.suffix).then(function (resp) {
        return generateUserInfo(resp, $route.current.params.tab, $route.current.params.object);
      });
    }
  }
}).otherwise({
  template,
  resolve: {
    userInfo($route, $http) {
      return $http.get('../api/own_home/selection').then(function (resp) {
        return generateUserInfo(resp, null, null);
      });
    }
  }
});

require('ui/modules')
.get('app/own_home', [])
.controller('ownHome', function ($scope, $route, $location) {
  const userInfo = $route.current.locals.userInfo;
  $scope.currentKibanaIndex = userInfo.currentKibanaIndex;
  $scope.kibanaIndexPrefix = userInfo.kibanaIndexPrefix;
  $scope.username = userInfo.username;
  $scope.groups = userInfo.groups;
  $scope.backHref = userInfo.backHref;
  $location.path('').replace();
  if (userInfo.moveTo && ['discover', 'visualize', 'dashboard'].indexOf(userInfo.moveTo.tab) > -1) {
    window.location = './own_home';
    window.location.replace('./kibana#/' + userInfo.moveTo.tab + '/' + userInfo.moveTo.object);
  }
});
