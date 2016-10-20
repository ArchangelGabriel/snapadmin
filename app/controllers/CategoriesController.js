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

angular.module('snapadmin')
  .controller('CategoriesController',  ['$scope', 'categoriesDep', CategoriesController])
  .controller('CategoryNewController', ['$scope', '$state', 'CategoryService', CategoryNewController]);
