'use strict';

function MallService($http, settings) {
  var mallsEndpoint = settings.railsApi.concat('malls/');

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
      url: id ? mallsEndpoint.concat(id) : mallsEndpoint,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      type: method
    })
  }

  var api = {
    list: function(params) { return $http.get(mallsEndpoint, { params: params }) },
    get: function(id) { return $http.get(mallsEndpoint.concat(id)) },
    remove: function(id) {},
    update: updateOrCreate,
    create: updateOrCreate
  };

  return api;
};

angular.module('snapadmin')
  .service('MallService', ['$http', 'settings', MallService]);
