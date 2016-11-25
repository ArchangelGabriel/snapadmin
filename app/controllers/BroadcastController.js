'use strict';



function BroadcastController($scope, NotificationService, notificationsDep) {
  $scope.execution_time = null;
  $scope.notifications = notificationsDep.map(n => Object.assign({}, n, { execute_time: moment.utc(n.execute_time).valueOf() }));

  $scope.sendNotification = function(notification) {
    console.log(notification);
    return NotificationService.create(notification)
    .then(function(newNotification) {
      // console.log(newNotification);
      $scope.notifications = $scope.notifications.concat(newNotification.data);
      alert('Create Notification Success');
    })
    .catch(function() { alert('Create Notification Failed') });
  };

  $scope.removeNotification = function(notification) {
    var isConfirmed = confirm('Are you sure you want to delete?')
    if (isConfirmed) {
      return NotificationService.remove(notification.id)
        .then(function() {
          $scope.notifications = $.grep($scope.notifications, function(e) { return e.id != notification.id });
          alert('Delete Notification Success')
        })
        .catch(function(err) {alert('Delete Notification Failed')});  
    }
  };
};

function BroadcastEditController($scope, $state, NotificationService, notificationDep) {
  $scope.notification = angular.extend({}, notificationDep, { execute_time: moment.utc(notificationDep.execute_time).format("D MMMM YYYY - hh:mm") });
  console.log($scope.notification);

  $scope.updateNotification = function(notification) {
    return NotificationService.update(notification.id, notification)
      .then(function(newNotification) {
        console.log(newNotification.data);
        $state.go('broadcast');
      });
  };
};

angular.module('snapadmin')
  .controller('BroadcastController', ['$scope', 'NotificationService', 'notificationsDep', BroadcastController])
  .controller('BroadcastEditController', ['$scope', '$state', 'NotificationService', 'notificationDep', BroadcastEditController]);
