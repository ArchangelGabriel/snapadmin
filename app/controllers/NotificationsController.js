'use strict';

function NotificationsController($scope, NotificationService, notificationsDep) {
  $scope.filters = {
    
  };
  $scope.notifications = notificationsDep;
};

angular.module('snapadmin')
  .controller('NotificationsController', ['$scope', 'NotificationService', 'notificationsDep', NotificationsController]);
