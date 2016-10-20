'use strict';

function EventService($http, settings) {
  var eventsEndpoint = settings.railsApi.concat('events/');

  var api = {
    list: function(params) { return $http.get(eventsEndpoint, { params: params }) },
    get: function(id) { return $http.get(eventsEndpoint.concat(id)) },
    remove: function(id) {},
    update: function(id, data) {},
    create: function(data) { return $http.post(eventsEndpoint, data) }
  };

  return api;
};

angular.module('snapadmin')
  .service('EventService', ['$http', 'settings', EventService]);
