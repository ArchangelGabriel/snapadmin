'use strict';

function SidebarController($rootScope, $state, $scope) {
  $scope.$on('$viewContentLoaded', function() {
    Layout.initSidebar($state);
  });

  var links = [
    { sref: 'dashboard',             title: 'Dashboard',         iconClass: 'icon-pie-chart',   access: ['super_admin', 'admin', 'report_viewer'] },
    { sref: 'users',                 title: 'Users',             iconClass: 'icon-users',       access: ['super_admin'] },
    { sref: 'providers',             title: 'Providers',         iconClass: 'icon-home',        access: ['super_admin', 'admin'] },
    { sref: 'gamificationCampaigns', title: 'Gamification',      iconClass: 'icon-diamond',     access: ['super_admin', 'admin'] },
    { sref: 'categories',            title: 'Categories',        iconClass: 'fa fa-tags',       access: ['super_admin', 'admin'] },
    {                                title: 'Notifications',     iconClass: 'fa fa-microphone', access: ['super_admin'],
      children: [
        { sref: 'broadcast',             title: 'Broadcast',         iconClass: 'fa fa-globe',  access: ['super_admin'] },
        { sref: 'notifications',      title: 'Notification Logs', iconClass: 'fa fa-list',   access: ['super_admin'] },
      ]
    }
  ];

  $scope.title = 'PAGES';
  $scope.links = links;

  $scope.$watch('settings.isExperimental', function() {
    var experimentalLinks = [
      { sref: 'malls',                 title: 'My Malls',          iconClass: 'fa fa-building',   access: ['super_admin'] },
      { sref: 'businesses',            title: 'My Business',       iconClass: 'fa fa-dollar',     access: ['super_admin'] },
      { sref: 'advertisements',        title: 'My Ads',            iconClass: 'fa fa-industry',   access: ['super_admin'] },
      { sref: 'campaigns',             title: 'Campaigns',         iconClass: 'fa fa-flag',       access: ['super_admin'] },
      { sref: 'reports',               title: 'Reports',           iconClass: 'fa fa-pie-chart',  access: ['super_admin'] },
      { sref: 'pois',                  title: 'Pois',              iconClass: 'fa fa-spoon',      access: ['super_admin'] }
    ]
    $scope.links = $rootScope.settings.isExperimental ?
                   $scope.links.concat(experimentalLinks) :
                   $scope.links.slice(0, $scope.links.length > links.length ? $scope.links.length - experimentalLinks.length : links.length);
  })
};

angular.module('snapadmin')
  .controller('SidebarController', ['$rootScope', '$state', '$scope', SidebarController]);
