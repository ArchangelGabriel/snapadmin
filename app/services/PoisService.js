'use strict';

function PoisService($http, settings) {
  var poisCMSEndpoint = settings.cmsApi.concat('pois/');

  var api = {
    list: function(params) {
      return $http({
        method: 'GET',
        url: poisCMSEndpoint,
        params: params,
        headers: { apikey: '1w1GP2zREF2rZczfTPODDaFfs1COtwE2RlKYcdZk4HplbxIVIn648TKFppsqnmm' }
      })
    },
    get: function(id) {
      return $http.get(poisCMSEndpoint.concat(id));
    },
    createOrUpdate: function(data) {
      return $http.post(
        poisCMSEndpoint,
        data,
        { headers: { apikey: '1w1GP2zREF2rZczfTPODDaFfs1COtwE2RlKYcdZk4HplbxIVIn648TKFppsqnmm' } }
      )
    }
  };

  return api;
};

angular.module('snapadmin')
  .service('PoisService', ['$http', 'settings', PoisService]);
