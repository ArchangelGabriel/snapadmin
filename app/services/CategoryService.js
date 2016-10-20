'use strict';

function CategoryService($http, settings) {
  var categoriesEndpoint = settings.railsApi.concat('categories/');

  var api = {
    list: function(params) { return $http.get(categoriesEndpoint) },
    get: function(id) { return $http.get(categoriesEndpoint.concat(id)) },
    remove: function(id) {},
    update: function(id, data) {},
    create: function(data) { return $http.post(categoriesEndpoint, data) }
  };

  return api;
};

angular.module('snapadmin')
  .service('CategoryService', ['$http', 'settings', CategoryService]);
