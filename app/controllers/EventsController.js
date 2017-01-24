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
        { data: 'starts_at',
          fnCreatedCell: function(elem, colData, allData) {
            $(elem).html(moment(colData).format("Do MMM YYYY"));
          }},
        { data: 'ends_at',
          fnCreatedCell: function(elem, colData, allData) {
            $(elem).html(moment(colData).format("Do MMM YYYY"));
          }},
        { data: 'publish_status' },
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
  $scope.event.location = [];

  $scope.createEvent = function(event) {
    console.log(event);
    return EventService.create(event)
      .then(function(newEvent) {
        console.log('newEvent', newEvent);
        $state.go('gamificationCampaignDetail', {id: $scope.campaign.id});
      });
  };
};

function EventEditController($scope, $state, EventService, eventDep, categoriesDep) {
  $scope.event             = eventDep;
  $scope.event.starts_at   = moment($scope.event.starts_at).format("D MMMM YYYY - hh:mm");
  $scope.event.ends_at     = moment($scope.event.ends_at).format("D MMMM YYYY - hh:mm");
  $scope.event.location[0] = parseFloat($scope.event.location[0]);
  $scope.event.location[1] = parseFloat($scope.event.location[1]);
  $scope.categories        = categoriesDep;

  $scope.updateEvent = function(event) {
    var modifiedEvent = angular.extend(
      {},
      event,
      { campaign_id: $('#campaign_id').val(), category_ids: $('#category_ids').val() }
      // { location: [$('#campaign_id').val()] }
    );
    console.log(modifiedEvent);
    return EventService.update(modifiedEvent.id, modifiedEvent)
      .then(function(result) {
        var newEvent = result.data;
        $state.go('gamificationEventDetail', {id: newEvent.id});
      });
  };
};

function EventDetailController($scope, $state, EventService, eventDep) {
  $scope.label = ['default', 'primary', 'info', 'success', 'warning', 'error'];
  $scope.event = eventDep;
  var now         = moment(new Date());
  var start       = moment($scope.event.starts_at);
  var end         = moment($scope.event.ends_at);
  var duration    = moment.duration(end.diff(start)).asDays();
  var difference  = moment.duration(end.diff(now)).asDays();
  $scope.progress = parseInt(((duration-difference)/duration)*100);
  console.log(eventDep);
  $scope.sync = function(event) {
    var modifiedEvent = angular.extend({}, event, { event_id: event.id, published_at: moment().toISOString() });
    return EventService.sync(modifiedEvent)
      .then(function(result) {
        var syncedEvent = result.data;
        console.log(syncedEvent);
        alert('Event: Successfully synced.');
      })
      .catch(function(error) {
        console.error(error);
        alert('Event: Failed to sync.');
      });
  };
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
  .controller('EventEditController',   ['$scope', '$state', 'EventService', 'eventDep', 'categoriesDep', EventEditController])
  .controller('EventDetailController', ['$scope', '$state', 'EventService', 'eventDep', EventDetailController]);
