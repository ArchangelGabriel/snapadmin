'use strict';

function CategoriesController($scope, categoriesDep) {
  $scope.categories = categoriesDep;
};

function CategoryNewController($scope, $state, CategoryService) {
  $scope.category = {};

  $scope.createCategory = function(category) {
    return CategoryService.create(category)
      .then(function() {
        $state.go('categories');
      });
  };
};

function CategoryEditController($scope, $state, CategoryService, categoryDep) {
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
  .controller('CategoriesController',   ['$scope', 'categoriesDep', CategoriesController])
  .controller('CategoryNewController',  ['$scope', '$state', 'CategoryService', CategoryNewController])
  .controller('CategoryEditController', ['$scope', '$state', 'CategoryService', 'categoryDep', CategoryEditController]);
