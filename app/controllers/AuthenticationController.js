'use strict';

function AuthenticationController($scope, $state, $auth) {
  $scope.login = function(admin) {
    $auth.submitLogin(admin)
      .then(function() {
        $state.go('dashboard');
      })
      .catch(function() {
        alert('Invalid Credentials');
      })
  }
};

angular.module('snapadmin')
  .controller('AuthenticationController', ['$scope', '$state', '$auth', AuthenticationController]);
