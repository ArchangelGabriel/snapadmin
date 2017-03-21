'use strict';

function StoreService($http, settings) {
  var storesEndpoint = settings.railsApi.concat('stores/');

  function updateOrCreate() {
    var id, data, method;
    if (arguments.length == 1) data = arguments[0], method = "POST";
    else id = arguments[0], data = arguments[1], method = "PUT";
    var keys = Object.keys(data);
    var formData = new FormData();
    angular.forEach(keys, function(key) {
      formData.append(key, data[key]);
    });
    return jQuery.ajax({
      url: id ? storesEndpoint.concat(id) : storesEndpoint,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      type: method
    })
  }

  var api = {
    list: function(params) { return $http.get(storesEndpoint, { params: params }) },
    get: function(id) { return $http.get(storesEndpoint.concat(id)) },
    remove: function(id) {},
    update: updateOrCreate,
    create: updateOrCreate
  };

  return api;
};

angular.module('snapadmin')
  .service('StoreService', ['$http', 'settings', StoreService]);
