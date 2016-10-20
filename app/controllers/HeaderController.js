'use strict';

function HeaderController($scope) {
  $scope.$on('$includeContentLoaded', function(asdf) {
    Layout.initHeader();
  });
};

angular.module('snapadmin')
  .controller('HeaderController', ['$scope', HeaderController]);
