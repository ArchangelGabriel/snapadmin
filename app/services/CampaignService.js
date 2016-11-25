'use strict';

function CampaignService($http, settings) {
  var campaignsEndpoint = settings.railsApi.concat('campaigns/');

  var api = {
    list: function(params) { return $http.get(campaignsEndpoint, { params: params }) },
    get: function(id) { return $http.get(campaignsEndpoint.concat(id)) },
    remove: function(id) {},
    update: function(id, data) { return $http.put(campaignsEndpoint.concat(id), data) },
    create: function(data) { return $http.post(campaignsEndpoint, data) }
  };

  return api;
};

angular.module('snapadmin')
  .service('CampaignService', ['$http', 'settings', CampaignService]);
