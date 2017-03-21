'use strict';

function StoresController($scope) {

}

function StoresNewController($scope, $state, $stateParams, MallService, StoreService) {
  MallService.get($stateParams.mall_id).then(function(result) {
    $scope.mall = result.data;
    $scope.createStore = function(store, status = 'submitted') {
      // TODO: INSECURE RELATIONSHIP
      store = Object.assign({}, store, { mall_id: $scope.mall.id, publish_status: status }, $scope.image != undefined && { image: $scope.image });
      StoreService.create(store).then(function(result) {
        $state.go('mallsDetail', { id: $scope.mall.id });
      });
    };
  });
}

function StoresEditController($scope, $state, $stateParams, MallService, StoreService) {
  Promise.all([
    MallService.get($stateParams.mall_id),
    StoreService.get($stateParams.id)
  ]).then(function(results) {
    $scope.mall = results[0].data;
    $scope.store = results[1].data;
    $scope.editStore = function(store, status = 'submitted') {
      // TODO: INSECURE RELATIONSHIP
      if (typeof store.image == "object") delete store["image"];
      store = Object.assign({}, store, { mall_id: $scope.mall.id, publish_status: status }, $scope.image != undefined && { image: $scope.image });
      StoreService.update(store.id, store).then(function(result) {
        $state.go('mallsDetail', { id: $scope.mall.id });
      });
    };
    $scope.$apply();
  });

}

angular.module('snapadmin')
  .controller('StoresController',      ['$scope', StoresController])
  .controller('StoresNewController', ['$scope', '$state', '$stateParams', 'MallService', 'StoreService', StoresNewController])
  .controller('StoresEditController', ['$scope', '$state', '$stateParams', 'MallService', 'StoreService', StoresEditController])
