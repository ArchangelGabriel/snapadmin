'use strict';

function ActivitiesListController() {

}

function ActivitiesNewController($scope, $state, ActivityService, eventDep) {
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

function ActivitiesEditController($scope, $state, ActivityService, activityDep, eventDep) {
  $scope.event      = eventDep;
  $scope.activity   = activityDep;
  $scope.activity.starts_at = moment($scope.activity.starts_at).format("D MMMM YYYY - hh:mm");
  $scope.activity.end_date   = moment($scope.activity.end_date).format("D MMMM YYYY - hh:mm");
  $scope.activity_params = {};

  $scope.templates = [{
    id: 'template1',
    name: 'Quiz TEST 1',
    description: 'This is a quiz template in which a user can play and participate in a quiz. You have to specify the number of <b>daily_submission_count</b> and <b>submission_correct</b> count before the user can claim the reward.',
    parameters: {
      daily_submission_count: 'number',
      submission_correct: 'string',
      submission_whatever: 'number'
    }
  },{
    id: 'template2',
    name: 'Catch a Brand',
    description: 'This is a game in which a user has to take a snap of a brand logo.',
    parameters: {
      number_of_logos_caught: 'number',
      daily_submission_count: 'number',
      submission_correct: 'string'
    }
  }];

  $scope.updateActivity = function(activity) {
    return ActivityService.update(activity.id, activity)
      .then(function(result) {
        var newActivity = result.data;
        $state.go('gamificationEventDetail', {id: newActivity.event_id});
      });
  };

  $scope.addTemplate = function(template, params) {
    var activity_rule = angular.merge({}, template, { parameters: params });
    $scope.activity = angular.merge({}, $scope.activity, { activity_rule: activity_rule });
    console.log($scope.activity);
  };

  $scope.removeTemplate = function(id) {
    delete $scope.activity.activity_rule;
    $('#'.concat(id)).collapse('hide');
  };
};

angular.module('snapadmin')
  .controller('ActivitiesListController', [ActivitiesListController])
  .controller('ActivitiesNewController', ['$scope', '$state', 'ActivityService', 'eventDep', ActivitiesNewController])
  .controller('ActivitiesEditController', ['$scope', '$state', 'ActivityService', 'activityDep', 'eventDep', ActivitiesEditController])
