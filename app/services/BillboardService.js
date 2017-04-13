'use strict';

function BillboardService($http, settings) {
  var billboardsEndpoint = settings.railsApi.concat('signboards/');

  var api = {
    list: function(params) { return $http.get(billboardsEndpoint, { params: params }) },
    get: function(id) { return $http.get(billboardsEndpoint.concat(id)) },
    remove: function(id) { return $http.delete(billboardsEndpoint.concat(id)) },
    update: function(id, data) { return $http.put(billboardsEndpoint.concat(id), data) },
    create: function(data) { return $http.post(billboardsEndpoint, data) },
  };

  return api;
};

angular.module('snapadmin')
  .service('BillboardService', ['$http', 'settings', BillboardService]);
