'use strict';

function BusinessService($http, settings) {
  var businessesEndpoint = settings.railsApi.concat('businesses/');

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
      url: id ? businessesEndpoint.concat(id) : businessesEndpoint,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      type: method
    })
  }

  var api = {
    list: function(params) { return $http.get(businessesEndpoint, { params: params }) },
    get: function(id) { return $http.get(businessesEndpoint.concat(id)) },
    remove: function(id) {},
    update: updateOrCreate,
    create: updateOrCreate
  };

  return api;
}

angular.module('snapadmin')
  .service('BusinessService', ['$http', 'settings', BusinessService]);
