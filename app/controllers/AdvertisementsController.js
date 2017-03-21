'use strict';

function AdvertisementsListController($scope) {

}

function AdvertisementsNewController($scope) {

}

angular.module('snapadmin')
  .controller('AdvertisementsListController', ['$scope', AdvertisementsListController])
  .controller('AdvertisementsNewController', ['$scope', AdvertisementsNewController]);
