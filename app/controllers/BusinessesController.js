'use strict';

var businesses = [
  {id: 1, name: 'Business A', address: "68 Orchard Rd, Singapore 238839", img: "http://www.cmt.com.sg/images/banner-bugis-junction.jpg", description: "Bugis Junction is an integrated development located at Victoria Street, Middle Road and North Bridge Road in Bugis, Downtown Core in Singapore. The development consists of a shopping mall, an office tower and the InterContinental Singapore Hotel." },
  {id: 2, name: 'Business B', address: "200 Victoria St, Singapore 188021", img: "http://www.malls.com/upload/resize_cache/iblock/b63/700_448_18770f3828b088159f747f14acd6eb0b3/b63bc03bc767281dc43643038cf4e3a5.jpg", description: "Plaza Singapura is a contemporary shopping mall located along Orchard Road, Singapore. The mall is managed by CapitaLand and owned by CapitaMall Trust. There are retail outlets over seven floors and two basements." },
  {id: 3, name: 'Business C', address: "168 Stamford Rd, Singapore 133271", img: "https://blogofsorts.files.wordpress.com/2008/10/dscf0018.jpg", description: "Steps from the legendary Raffles, this sleek high-rise hotel is 3 minutes' walk from City Hall MRT station and 8 minutes' walk from Parliament House. " },
  {id: 4, name: 'Business D', address: "91 Kallang St, Singapore 154223", img: "https://media-cdn.tripadvisor.com/media/photo-s/08/23/8f/96/the-ritz-carlton-millenia.jpg", description: "Kallang /kɑːlɑːŋ/ is a planning area and residential town located in the Central Region of Singapore. Development of the town is centered around the Kallang River, which is Singapore's longest river." },
];

function BusinessesListController($scope) {
  $scope.businesses = businesses;
}

function BusinessesNewController($scope) {

}

angular.module('snapadmin')
  .controller('BusinessesListController',      ['$scope', BusinessesListController])
  .controller('BusinessesNewController', ['$scope', BusinessesNewController])
