'use strict';

function ProvidersController($scope, providersDep) {
  $scope.providers = providersDep;
  $scope.viewMode = 'list';

  $scope.changeViewMode = function(mode) {
    $scope.viewMode = mode;
  };
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

function ProvidersEditController($scope, $state, ProviderService, providerDep) {
  $scope.provider = providerDep;

  $scope.editProvider = function(provider) {
    return ProviderService.update(provider.id, provider)
      .then(function(result) {
        var newProvider = result.data;
        $state.go('providerDetail', {id: newProvider.id});
      });
  };
};

function ProvidersDetailController($scope, $state, providerDep, campaignsDep, eventsDep) {
  $scope.provider  = providerDep;
  $scope.campaigns = campaignsDep;
  $scope.events    = eventsDep;
};

angular.module('snapadmin')
  .controller('ProvidersController', ['$scope', 'providersDep', ProvidersController])
  .controller('ProvidersNewController', ['$scope', '$state', 'ProviderService', ProvidersNewController])
  .controller('ProvidersEditController', ['$scope', '$state', 'ProviderService', 'providerDep', ProvidersEditController])
  .controller('ProvidersDetailController', ['$scope', '$state', 'providerDep', 'campaignsDep', 'eventsDep', ProvidersDetailController]);
