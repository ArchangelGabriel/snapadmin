'use strict';

function AppController($scope) {
  $scope.$on('$viewContentLoaded', function() {
    App.initComponents();
  });
};

angular.module('snapadmin')
  .controller('AppController', ['$scope', AppController]);
