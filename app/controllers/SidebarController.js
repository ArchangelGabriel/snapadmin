'use strict';

function SidebarController($state, $scope) {
  $scope.$on('$viewContentLoaded', function() {
    Layout.initSidebar($state);
  });

  $scope.title = 'PAGES';
  $scope.links = [
    { sref: 'dashboard',             title: 'Dashboard',         iconClass: 'icon-pie-chart',   access: ['super_admin', 'admin', 'report_viewer'] },
    { sref: 'users',                 title: 'Users',             iconClass: 'icon-users',       access: ['super_admin'] },
    { sref: 'providers',             title: 'Providers',         iconClass: 'icon-home',        access: ['super_admin', 'admin'] },
    { sref: 'gamificationCampaigns', title: 'Gamification',      iconClass: 'icon-diamond',     access: ['super_admin', 'admin'] },
    { sref: 'categories',            title: 'Categories',        iconClass: 'fa fa-tags',       access: ['super_admin', 'admin'] },
    {                                title: 'Notifications',     iconClass: 'fa fa-microphone', access: ['super_admin'],
      children: [
        { sref: 'broadcast',             title: 'Broadcast',         iconClass: 'fa fa-globe',  access: ['super_admin'] },
        { sref: 'notificationLogs',      title: 'Notification Logs', iconClass: 'fa fa-list',   access: ['super_admin'] },
      ]
    },


  ];
};

angular.module('snapadmin')
  .controller('SidebarController', ['$state', '$scope', SidebarController]);
