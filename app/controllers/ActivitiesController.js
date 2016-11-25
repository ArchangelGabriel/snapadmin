'use strict';

function ActivityNewController($scope, $state, ActivityService, eventDep) {
  $scope.event      = eventDep;
  $scope.activity   = {};

  $scope.createActivity = function(activity) {
    console.log(activity);
    return ActivityService.create(activity)
      .then(function() {
        $state.go('gamificationEventDetail', {id: $scope.event.id});
      });
  };
};

function ActivityEditController($scope, $state, ActivityService, activityDep, eventDep) {
  $scope.event      = eventDep;
  $scope.activity   = activityDep;
  $scope.activity.starts_at = moment($scope.activity.starts_at).format("D MMMM YYYY - hh:mm");
  $scope.activity.end_date   = moment($scope.activity.end_date).format("D MMMM YYYY - hh:mm");
  console.log($scope);

  $scope.updateActivity = function(activity) {
    return ActivityService.update(activity.id, activity)
      .then(function(result) {
        var newActivity = result.data;
        $state.go('gamificationEventDetail', {id: newActivity.event_id});
      });
  };
};

angular.module('snapadmin')
  .controller('ActivityNewController', ['$scope', '$state', 'ActivityService', 'eventDep', ActivityNewController])
  .controller('ActivityEditController', ['$scope', '$state', 'ActivityService', 'activityDep', 'eventDep', ActivityEditController])
