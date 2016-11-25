'use strict';

function AppController($scope, NotificationService) {
  $scope.$on('$viewContentLoaded', function() {
    App.initComponents();
  });

  $scope.sendBroadcast = function(broadcast) {
    return NotificationService.broadcast({
      message: broadcast.message,
      platform: broadcast.platform
    })
      .then(function() {alert('broadcast success')})
      .catch(function() {alert('broadcast failed')});
  };
};

angular.module('snapadmin')
  .controller('AppController', ['$scope', 'NotificationService', AppController]);
