'use strict';

function ProviderService($http, settings) {
  var providersEndpoint = settings.railsApi.concat('providers/');

  var api = {
    list: function(params) { return $http.get(providersEndpoint, { params: params }) },
    get: function(id) { return $http.get(providersEndpoint.concat(id)) },
    remove: function(id) {},
    update: function(id, data) { return $http.put(providersEndpoint.concat(id), data) },
    create: function(data) { return $http.post(providersEndpoint, data) }
  };

  return api;
};

angular.module('snapadmin')
  .service('ProviderService', ['$http', 'settings', ProviderService]);
