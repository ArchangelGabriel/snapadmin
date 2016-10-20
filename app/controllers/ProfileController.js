'use strict';

function ProfileController($scope) {
  $scope.$on('$viewContentLoaded', function() {
      App.initAjax();
      // Layout.setAngularJsSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile'), $state);
  });
};

angular.module('snapadmin')
  .controller('ProfileController', ['$scope', ProfileController]);
