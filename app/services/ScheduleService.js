'use strict';

function ScheduleService($http, settings) {
  var schedulesEndpoint = settings.railsApi.concat('schedules/');

  var api = {
    list: function(params) { return $http.get(schedulesEndpoint, { params: params }) },
    get: function(id) { return $http.get(schedulesEndpoint.concat(id)) },
    remove: function(id) { return $http.delete(schedulesEndpoint.concat(id)) },
    update: function(id, data) { return $http.put(schedulesEndpoint.concat(id), data) },
    create: function(data) { return $http.post(schedulesEndpoint, data) },
  };

  return api;
};

angular.module('snapadmin')
  .service('ScheduleService', ['$http', 'settings', ScheduleService]);
