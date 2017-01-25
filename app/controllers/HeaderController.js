'use strict';

function HeaderController($scope, $state, $auth, auth) {
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
};

angular.module('snapadmin')
  .controller('HeaderController', ['$scope', '$state', '$auth', 'auth', HeaderController]);
