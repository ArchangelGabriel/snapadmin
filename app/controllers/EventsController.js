'use strict';

function EventsController($scope, eventsDep) {
  // reset table filtering
  $.fn.dataTable.ext.search = [];
  $scope.events   = eventsDep;
  var eventsTable = null;

  if (eventsTable == null) {

    $.fn.dataTable.ext.search.push(
      function( settings, data, dataIndex ) {
        var filterStatus = getFilterStatus();
        var status       = data[4] || '';

        if(filterStatus.includes(angular.lowercase(status)))
          return true;
        else
          return false;
      }
    );

    eventsTable = $('#eventsTable').DataTable({
      data: $scope.events,
      columns: [
        { data: 'title',
          fnCreatedCell: function(elem, colData, allData) {
            $(elem).html("<a href='/#!/gamification/events/" + allData.id + "'>" + colData + "</a>");
          }},
        { data: 'description' },
        { data: 'start_date',
          fnCreatedCell: function(elem, colData, allData) {
            $(elem).html(moment(colData).format("Do MMM YYYY"));
          }},
        { data: 'end_date',
          fnCreatedCell: function(elem, colData, allData) {
            $(elem).html(moment(colData).format("Do MMM YYYY"));
          }},
        { data: 'status' },
        { data: 'provider.name',
          fnCreatedCell: function(elem, colData, allData) {
            $(elem).html("<a href='/#!/providers/" + allData.provider_id + "'>" + colData + "</a>");
          }}
      ]
    });

    $(".filterStatus").on('click', function(e) {
      var allIsClicked = e.target.value == 'all';

      if      ( allIsClicked && !e.target.checked) untickAll();
      else if ( allIsClicked &&  e.target.checked) tickAll();
      else if (!allIsClicked &&  $(".filterStatus[value='all']")[0].checked) $(".filterStatus[value='all']")[0].checked = false;

      eventsTable.draw();
    });

  };
};

function EventNewController($scope, $state, EventService, categoriesDep, campaignDep) {
  $scope.categories = categoriesDep;
  $scope.campaign   = campaignDep;
  $scope.event      = {};

  $scope.createEvent = function(event) {
    return EventService.create(event)
      .then(function(newEvent) {
        $state.go('gamificationCampaignDetail', {id: $scope.campaign.id});
      });
  };
};

function EventDetailController($scope, $state, eventDep) {
  $scope.event = eventDep;
  var now         = moment(new Date());
  var start       = moment($scope.event.start_date);
  var end         = moment($scope.event.end_date);
  var duration    = moment.duration(end.diff(start)).asDays();
  var difference  = moment.duration(end.diff(now)).asDays();
  $scope.progress = parseInt(((duration-difference)/duration)*100);
};

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

angular.module('snapadmin')
  .controller('EventsController',      ['$scope', 'eventsDep', EventsController])
  .controller('EventNewController',    ['$scope', '$state', 'EventService', 'categoriesDep', 'campaignDep', EventNewController])
  .controller('EventDetailController', ['$scope', '$state', 'eventDep', EventDetailController]);
