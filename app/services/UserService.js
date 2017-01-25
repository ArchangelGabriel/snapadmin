'use strict';

function UserService($http, $auth, settings) {
  var currentUser = $auth.user;
  var adminsEndpoint = settings.railsApi.concat(`administration/admins/${currentUser.id}/admins`);
  console.log(currentUser);

  var api = {
    list: function(params) { return $http.get(adminsEndpoint, { params: params }) },
    get: function(id) {},
    remove: function(id) {},
    create: function(data) { return $http.post(adminsEndpoint, data) },
    update: function(id, data) {}
  };

  return api;
};

angular.module('snapadmin')
  .service('UserService', ['$http', '$auth', 'settings', UserService]);
