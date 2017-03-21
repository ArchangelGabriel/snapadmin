'use strict';

function UsersListController($scope, UserService) {
  $scope.$on('$viewContentLoaded', function() {
    UserService.list().then(function(result) {
      $scope.users = result.data;
      var usersTable = null;

      if (usersTable == null) {

        usersTable = $('#usersTable').DataTable({
          data: $scope.users,
          columns: [
            { data: 'id', fnCreatedCell: function(elem, colData, allData) {
              $(elem).html("<a href='/#!/users/" + allData.id + "'>" + colData + "</a>");
              }},
            { data: 'email',
              fnCreatedCell: function(elem, colData, allData) {
                $(elem).html("<a href='/#!/users/" + allData.id + "'>" + colData + "</a>");
              }},
            { data: 'roles' },
            { data: 'enabled' }
          ]
        });

      }
    });
  });

};

function UsersNewController($scope, $state, UserService) {

  $scope.createUser = function(new_user) {
    console.log(new_user);
    return UserService.create(new_user)
      .then(function(result) {
        $state.go('userDetail', { id: result.data.id });
      })
      .catch(alert)
  };

};

function UsersDetailController($scope, $state, UserService) {

};

angular.module('snapadmin')
  .controller('UsersListController', ['$scope', 'UserService', UsersListController])
  .controller('UsersNewController', ['$scope', '$state', 'UserService', UsersNewController])
  .controller('UsersDetailController', ['$scope', '$state', 'UserService', UsersDetailController]);

function getFilterStatus() {
  var statuses = [];
  angular.forEach($(".filterStatus:checked"), function(box) {
    statuses.push(box.value);
  });
  return statuses;
};

function tickAll() {
  angular.forEach($(".filterStatus"), function(box) {
    box.checked = true;
  });
};

function untickAll() {
  angular.forEach($(".filterStatus"), function(box) {
    box.checked = false;
  });
};
