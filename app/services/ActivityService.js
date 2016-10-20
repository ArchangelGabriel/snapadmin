'use strict';

function ActivityService($http, settings) {
  var activitiesEndpoint = settings.railsApi.concat('activities/');

  var api = {
    list: function(params) { return $http.get(activitiesEndpoint) },
    get: function(id) { return $http.get(activitiesEndpoint.concat(id)) },
    remove: function(id) {},
    update: function(id, data) {},
    create: function(data) { return $http.post(activitiesEndpoint, data) }
  };

  return api;
};

angular.module('snapadmin')
  .service('ActivityService', ['$http', 'settings', ActivityService]);
