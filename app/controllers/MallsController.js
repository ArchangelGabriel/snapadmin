'use strict';

var malls = [
  {id: 1, name: 'Bugis Junction', address: "68 Orchard Rd, Singapore 238839", img: "http://www.cmt.com.sg/images/banner-bugis-junction.jpg", description: "Bugis Junction is an integrated development located at Victoria Street, Middle Road and North Bridge Road in Bugis, Downtown Core in Singapore. The development consists of a shopping mall, an office tower and the InterContinental Singapore Hotel." },
  {id: 2, name: 'Plaza Singapura',address: "200 Victoria St, Singapore 188021", img: "http://www.malls.com/upload/resize_cache/iblock/b63/700_448_18770f3828b088159f747f14acd6eb0b3/b63bc03bc767281dc43643038cf4e3a5.jpg", description: "Plaza Singapura is a contemporary shopping mall located along Orchard Road, Singapore. The mall is managed by CapitaLand and owned by CapitaMall Trust. There are retail outlets over seven floors and two basements." },
];

var stores = [
  {id: 1, name: 'McDonald\'s', description: 'Fastfood Restaurant', level: '01', unit: '02', linked: true, edit: false},
  {id: 2, name: 'Adidas', description: 'Sports Apparel', level: 'B1', unit: '73', linked: false, edit: false},
  {id: 3, name: 'H&M', description: 'Fashion Apparel', level: '03', unit: '441', linked: false, edit: true},
  {id: 4, name: 'Wallet', description: 'Fashion Accessories', level: '02', unit: '23', linked: true, edit: true}
];

var billboards = [
  {id: 1, name: 'Atrium', description: 'On Atrium', level: 'B1', unit: '73',},
  {id: 2, name: 'Mall 1', description: 'On Mall 1', level: '03', unit: '441',},
  {id: 3, name: 'Fountain', description: 'On Fountain', level: '02', unit: '23',}
];

function MallsDetailController($scope, $stateParams, MallService, StoreService) {
  Promise.all([
    MallService.get($stateParams.id),
    StoreService.list({ mall_id: $stateParams.id })
  ]).then(function(results) {
    $scope.mall = results[0].data;
    $scope.stores = results[1].data;
    $scope.previewImage = 'https://snaplar.blob.core.windows.net/image/Users/juangabriel/Desktop/temp/pixeloak/snapadmin_backend/public'.concat($scope.mall.image.medium);
    $scope.status = function() {
      switch($scope.mall.publish_status) {
        case "draft":     return "label-info";
        case "submitted": return "label-success";
      };
    }
    $scope.$apply();
  });
}

function MallsListController($scope, $stateParams, MallService) {
  MallService.list().then(function(result) {
    $scope.malls = result.data;
    console.log($scope.malls);
    var cityHash = result.data.reduce(function(hash, curr) {
      var key = curr.city;
      if (hash[key]) hash[key]++;
      else hash[key] = 1;
      return hash;
    }, {});
    $scope.cities = Object.keys(cityHash).map(function(key) {
      return { key: key == 'null' ? 'Others' : key, value: cityHash[key] };
    });
  });

  $scope.textFilter = $stateParams.city == 'others' ? '' : $stateParams.city;

  $scope.$on('$locationChangeSuccess', function(event) {
    $scope.textFilter = $stateParams.city == 'others' ? '' : $stateParams.city;
  });
}

function MallsNewController($scope, $state, MallService, Upload) {
  $scope.createMall = function(mall, status = 'publish') {
    mall = Object.assign({}, mall, { publish_status: status }, $scope.image != undefined && { image: $scope.image });
    MallService.create(mall).then(function(result) {
      $state.go('malls');
    });
  };
}

function MallsEditController($scope, $state, $stateParams, MallService, Upload) {
  MallService.get($stateParams.id).then(function(result) {
    $scope.mall = result.data;
    console.log($scope.mall);
  });
  $scope.editMall = function(mall, status = 'submitted') {
    if (typeof mall.image == "object") delete mall["image"];
    mall = Object.assign({}, mall, { publish_status: status }, $scope.image != undefined && { image: $scope.image });
    MallService.update(mall.id, mall).then(function(result) {
      console.log('res', result);
      $state.go('mallsDetail', { id: result.id });
    })
  };
}

angular.module('snapadmin')
  .controller('MallsDetailController', ['$scope', '$stateParams', 'MallService', 'StoreService', MallsDetailController])
  .controller('MallsListController',   ['$scope', '$stateParams', 'MallService', MallsListController])
  .controller('MallsNewController',    ['$scope', '$state', 'MallService', 'Upload', MallsNewController])
  .controller('MallsEditController',   ['$scope', '$state','$stateParams', 'MallService', 'Upload', MallsEditController])
