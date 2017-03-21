'use strict';

function CategoriesListController($scope, categoriesDep) {
  $scope.categories = categoriesDep;
};

function CategoriesNewController($scope, $state, CategoryService) {
  $scope.category = {};

  $scope.createCategory = function(category) {
    return CategoryService.create(category)
      .then(function() {
        $state.go('categories');
      });
  };
};

function CategoriesEditController($scope, $state, CategoryService, categoryDep) {
  $scope.category = categoryDep;

  $scope.updateCategory = function(category) {
    return CategoryService.update(category.id, category)
      .then(function(result) {
        var newCategory = result.data;
        $state.go('categories');
      });
  };
};

angular.module('snapadmin')
  .controller('CategoriesListController',   ['$scope', 'categoriesDep', CategoriesListController])
  .controller('CategoriesNewController',  ['$scope', '$state', 'CategoryService', CategoriesNewController])
  .controller('CategoriesEditController', ['$scope', '$state', 'CategoryService', 'categoryDep', CategoriesEditController]);
