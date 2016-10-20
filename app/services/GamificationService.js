'use strict';

function GamificationService($http) {
  var api = {
    list: function(params) {},
    get: function(id) {},
    remove: function(id) {},
    update: function(id, data) {}
  };

  return api;
};

angular.module('snapadmin')
  .service('GamificationService', ['$http', GamificationService]);
