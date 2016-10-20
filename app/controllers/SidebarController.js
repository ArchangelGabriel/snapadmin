'use strict';

function SidebarController($state, $scope) {
  $scope.$on('$includeContentLoaded', function() {
    Layout.initSidebar($state);
  });

  $scope.title = 'PAGES';
  $scope.links = [
    { sref: 'dashboard',              title: 'Dashboard',    iconClass: 'icon-pie-chart' },
    { sref: 'users',                  title: 'Users',        iconClass: 'icon-users' },
    { sref: 'providers',              title: 'Providers',    iconClass: 'icon-home' },
    { sref: 'gamificationCampaigns', title: 'Gamification', iconClass: 'icon-diamond' },
    { sref: 'categories',             title: 'Categories',   iconClass: 'fa fa-tags' },
  ];
};

angular.module('snapadmin')
  .controller('SidebarController', ['$state', '$scope', SidebarController]);
