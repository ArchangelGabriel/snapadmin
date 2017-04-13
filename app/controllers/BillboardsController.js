'use strict';

function BillboardsNewController($scope, $state, $stateParams, BusinessService, BillboardService) {
  BusinessService.get($stateParams.business_id).then(function(result) {
    $scope.business = result.data;
  });

  $scope.createSignboard = function(signboard) {
    console.log(signboard);
    var modifiedSignboard = Object.assign({}, signboard, { business_id: $scope.business.id });
    BillboardService.create(modifiedSignboard).then(function(result) {
      $state.go('businessesEdit', { id: $stateParams.business_id });
    });
  };
}

function BillboardsEditController($scope, $state, $stateParams, BusinessService, BillboardService) {
  BusinessService.get($stateParams.business_id).then(function(result) {
    $scope.business = result.data;
  });

  Promise.all([
    BusinessService.get($stateParams.business_id),
    BillboardService.get($stateParams.id)
  ]).then(function(results) {
    $scope.business = results[0].data;
    $scope.signboard = results[1].data;
    $scope.$apply();
  });

  $scope.editSignboard = function(signboard) {
    BillboardService.update(signboard.id, signboard).then(function(result) {
      $state.go('businessesEdit', { id: $stateParams.business_id });
    })
  }
}

angular.module('snapadmin')
  .controller('BillboardsNewController', ['$scope', '$state', '$stateParams', 'BusinessService', 'BillboardService', BillboardsNewController])
  .controller('BillboardsEditController', ['$scope', '$state', '$stateParams', 'BusinessService', 'BillboardService', BillboardsEditController]);
