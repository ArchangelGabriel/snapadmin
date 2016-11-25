'use strict';

function NotificationService($http, settings) {
  var broadcastCMSEndpoint = settings.cmsApi.concat('notifications');
  var notificationsEndpoint = settings.railsApi.concat('notifications/');

  var api = {
    broadcast: function(data) { return $http.post(broadcastCMSEndpoint, data) },
    list: function(params) { return $http.get(notificationsEndpoint, { params: params }) },
    get: function(id) { return $http.get(notificationsEndpoint.concat(id)) },
    remove: function(id) { return $http.delete(notificationsEndpoint.concat(id)) },
    update: function(id, data) { return $http.put(notificationsEndpoint.concat(id), data) },
    create: function(data) { return $http.post(notificationsEndpoint, data) },
  };

  return api;
};

angular.module('snapadmin')
  .service('NotificationService', ['$http', 'settings', NotificationService]);
