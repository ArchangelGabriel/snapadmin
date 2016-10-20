'use strict';

function ActivityNewController($scope, $state, ActivityService, eventDep) {
  $scope.event      = eventDep;
  $scope.activity   = {};

  $scope.createActivity = function(activity) {
    return ActivityService.create(activity)
      .then(function() {
        $state.go('gamificationEventDetail', {id: $scope.event.id});
      });
  };
};

angular.module('snapadmin')
  .controller('ActivityNewController', ['$scope', '$state', 'ActivityService', 'eventDep', ActivityNewController])
