'use strict';

function EventService($http, settings) {
  var eventsEndpoint    = settings.railsApi.concat('events/');
  var eventsCMSEndpoint = settings.cmsApi.concat('events/');

  var api = {
    list: function(params) { return $http.get(eventsEndpoint, { params: params }) },
    get: function(id) { return $http.get(eventsEndpoint.concat(id)) },
    remove: function(id) {},
    update: function(id, data) { return $http.put(eventsEndpoint.concat(id), data) },
    create: function(data) { return $http.post(eventsEndpoint, data) },
    sync: function(data) { return $http.post(eventsCMSEndpoint, data
      ,{headers: { apikey: '1w1GP2zREF2rZczfTPODDaFfs1COtwE2RlKYcdZk4HplbxIVIn648TKFppsqnmm' }}
    ) }
  };

  return api;
};

angular.module('snapadmin')
  .service('EventService', ['$http', 'settings', EventService]);
