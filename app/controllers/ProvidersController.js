'use strict';

function ProvidersController($scope, providersDep) {
  $scope.providers = providersDep;
  $scope.viewMode = 'list';

  $scope.changeViewMode = function(mode) {
    $scope.viewMode = mode;
  };
};

function ProvidersDetailController($scope, $state, providerDep, campaignsDep, eventsDep) {
  $scope.provider  = providerDep;
  $scope.campaigns = campaignsDep;
  $scope.events    = eventsDep;
};

function ProvidersNewController($scope, $state, ProviderService) {
  $scope.provider = {};
  $scope.createProvider = function(provider) {
    return ProviderService.create(provider)
      .then(function() {
         $state.go('providers')
      });
  };
};

angular.module('snapadmin')
  .controller('ProvidersController', ['$scope', 'providersDep', ProvidersController])
  .controller('ProvidersNewController', ['$scope', '$state', 'ProviderService', ProvidersNewController])
  .controller('ProvidersDetailController', ['$scope', '$state', 'providerDep', 'campaignsDep', 'eventsDep', ProvidersDetailController]);
