'use strict';

function DashboardController() {
  console.log('Me is DashboardController');
};

angular.module('snapadmin')
  .controller('DashboardController', ['EventService', '',DashboardController]);
