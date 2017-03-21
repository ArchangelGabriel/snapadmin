'use strict';

function HeaderController($rootScope, $scope, $state, $auth, auth) {
  $scope.email = auth.email;
  $scope.logout = function() {
    $auth.signOut()
      .then(function(response) {
        $state.go('login');
      })
      .catch(function(error) {
        console.error(error);
      })
  };

  $scope.toggleExperimental = function() {
    $rootScope.settings.isExperimental = !$rootScope.settings.isExperimental;
    console.log($rootScope.settings.isExperimental);
  }
};

angular.module('snapadmin')
  .controller('HeaderController', ['$rootScope', '$scope', '$state', '$auth', 'auth', HeaderController]);
