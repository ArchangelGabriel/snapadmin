'use strict';

function PoisListController($scope, PoisService) {
  PoisService
    .list({ limit: 1000 })
    .then(result => result.data.results_local)
    .then(result => $scope.pois = result);
};

function PoisNewController($scope, $state, PoisService) {
  $scope.createPoi = (poi) => {
    PoisService.createOrUpdate(poi)
      .then(poi => poi.data)
      .then(poi => $state.go('poiShow', { id: poi._id }));
  }
};

function PoisShowController($scope, currentPoi) {
  $scope.poi = currentPoi;
};

function PoisEditController($scope, $state, currentPoi, PoisService) {
  $scope.poi = currentPoi;

  $scope.updatePoi = (poi) => {
    PoisService.createOrUpdate(poi)
    .then(poi => poi.data)
    .then(poi => $state.go('poiShow', { id: poi._id }));
  };
}

angular.module('snapadmin')
  .controller('PoisListController', ['$scope', 'PoisService', PoisListController])
  .controller('PoisNewController', ['$scope', '$state', 'PoisService', PoisNewController])
  .controller('PoisShowController', ['$scope', 'currentPoi', PoisShowController])
  .controller('PoisEditController', ['$scope', '$state', 'currentPoi', 'PoisService', PoisEditController]);
