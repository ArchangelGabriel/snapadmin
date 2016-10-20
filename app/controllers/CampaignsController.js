'use strict';

function CampaignsController($scope, campaignsDep) {
  // reset table filtering
  $.fn.dataTable.ext.search = [];
  $scope.campaigns = campaignsDep;
  var campaignsTable = null;

  if (campaignsTable == null) {

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

    campaignsTable = $('#campaignsTable').DataTable({
      data: $scope.campaigns,
      columns: [
        { data: 'name',
          fnCreatedCell: function(elem, colData, allData) {
            $(elem).html("<a href='/#!/gamification/campaigns/" + allData.id + "'>" + colData + "</a>");
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

      campaignsTable.draw();
    });

  }

};

function CampaignNewController($scope, $state, CampaignService, providersDep) {
  $scope.providers = providersDep;
  $scope.campaign  = {};

  $scope.createCampaign = function(campaign) {
    return CampaignService.create(campaign)
      .then(function() {
        $state.go('gamificationCampaigns');
      });
  };
};

function CampaignDetailController($scope, $state, campaignDep) {
  $scope.campaign = campaignDep;
  var now         = moment(new Date());
  var start       = moment($scope.campaign.start_date);
  var end         = moment($scope.campaign.end_date);
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
  .controller('CampaignsController',      ['$scope', 'campaignsDep', CampaignsController])
  .controller('CampaignNewController',    ['$scope', '$state', 'CampaignService', 'providersDep', CampaignNewController])
  .controller('CampaignDetailController', ['$scope', '$state', 'campaignDep', CampaignDetailController]);
