'use strict';

var businesses = [
  {id: 1, name: 'Business A', address: "68 Orchard Rd, Singapore 238839", img: "http://www.cmt.com.sg/images/banner-bugis-junction.jpg", description: "Bugis Junction is an integrated development located at Victoria Street, Middle Road and North Bridge Road in Bugis, Downtown Core in Singapore. The development consists of a shopping mall, an office tower and the InterContinental Singapore Hotel." },
  {id: 2, name: 'Business B', address: "200 Victoria St, Singapore 188021", img: "http://www.malls.com/upload/resize_cache/iblock/b63/700_448_18770f3828b088159f747f14acd6eb0b3/b63bc03bc767281dc43643038cf4e3a5.jpg", description: "Plaza Singapura is a contemporary shopping mall located along Orchard Road, Singapore. The mall is managed by CapitaLand and owned by CapitaMall Trust. There are retail outlets over seven floors and two basements." },
  {id: 3, name: 'Business C', address: "168 Stamford Rd, Singapore 133271", img: "https://blogofsorts.files.wordpress.com/2008/10/dscf0018.jpg", description: "Steps from the legendary Raffles, this sleek high-rise hotel is 3 minutes' walk from City Hall MRT station and 8 minutes' walk from Parliament House. " },
  {id: 4, name: 'Business D', address: "91 Kallang St, Singapore 154223", img: "https://media-cdn.tripadvisor.com/media/photo-s/08/23/8f/96/the-ritz-carlton-millenia.jpg", description: "Kallang /kɑːlɑːŋ/ is a planning area and residential town located in the Central Region of Singapore. Development of the town is centered around the Kallang River, which is Singapore's longest river." },
];

function BusinessesListController($scope, BusinessService) {
  BusinessService.list().then(function(result) {
    $scope.businesses = result.data;
  })
}

function BusinessesNewController($scope, $state, BusinessService, MallService) {
  $scope.$on('$viewContentLoaded', function() {
    ComponentsSelect2.init();
  });

  Promise.all([
    MallService.list()
  ]).then(function(results) {
    $scope.malls = results[0].data;
    console.log(results);
    $scope.$apply();
  });

  $scope.createBusiness = function(business, status = 'submitted') {
    business = Object.assign({}, business, { publish_status: status, mall_id: $("#mall_id").val() }, $scope.image != undefined && { image: $scope.image });
    BusinessService.create(business).then(function(results) {
      $state.go('businesses');
    })
  }
}

function BusinessesDetailController($scope, $stateParams, BusinessService) {
  BusinessService.get($stateParams.id).then(function(result) {
    console.log(result.data);
  })
}

function BusinessesEditController($scope, $state, $stateParams, BusinessService, BillboardService, MallService) {
  $scope.$on('$viewContentLoaded', function() {
    ComponentsSelect2.init();
  });

  Promise.all([
    BusinessService.get($stateParams.id),
    BillboardService.list({business_id: 1}),
    MallService.list()
  ]).then(function(results) {
    $scope.business = results[0].data;
    $scope.signboards = results[1].data;
    $scope.malls = results[2].data;
    console.log(results);
    $scope.$apply();
  });

  $scope.editBusiness = function(business, status = 'submitted') {
    if (typeof business.image == "object") delete business["image"];
    business = Object.assign({}, business, { publish_status: status, mall_id: $('#mall_id').val() }, $scope.image != undefined && { image: $scope.image });
    BusinessService.update(business.id, business).then(function(result) {
      $state.go('businesses');
    });
  }
}

angular.module('snapadmin')
  .controller('BusinessesListController', ['$scope', 'BusinessService', BusinessesListController])
  .controller('BusinessesNewController', ['$scope', '$state', 'BusinessService', 'MallService', BusinessesNewController])
  .controller('BusinessesDetailController', ['$scope', '$stateParams', 'BusinessService', BusinessesDetailController])
  .controller('BusinessesEditController', ['$scope', '$state', '$stateParams', 'BusinessService', 'BillboardService', 'MallService', BusinessesEditController]);
