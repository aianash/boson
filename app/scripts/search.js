// /** DEPRECATED */

// var _search = angular.module('_search', []);

// _search.controller('SearchController',
//                   ['$scope',
//                    '$ionicLoading',
//                    '$timeout',
//                    '$ionicModal',
//                    'search',
//                    function($scope, $ionicLoading, $timeout, $ionicModal, search) {

//   $scope.showResults = false;
//   $scope.brandId = 'InstaShopper';

//   console.log($scope);

//   $scope.$on('stickHeader', function(event, brandId) {
//     console.log(brandId);
//     $scope.brandId = brandId;
//     $scope.$digest();
//   });

//   $ionicModal.fromTemplateUrl('query-modal.html', {
//     scope: $scope,
//     animation: 'slide-in-up'
//   }).then(function(modal) {
//     $scope.queryModal = modal;
//   });

//   $scope.brandIdPresent = function() {
//     return $scope.brandId != null && typeof $scope.brandId != 'undefined';
//   }

//   $scope.$on('search', function(event, query) {
//     $ionicLoading.show({template: 'Fetching...'});

//     search(query).then(function(result) {
//       $scope.showResults = true;
//       $scope.$broadcast('showResults', result);
//       $ionicLoading.hide();
//       $scope.queryModal.hide();
//     });

//   });


//   $scope.closeSearch = function() {
//     $scope.queryModal.hide();
//   };

//   $scope.showSearch = function() {
//     $scope.queryModal.show();
//   };

// }]);


// var items = [];
// var i = 0;

// items.push({
//   type: 'listing',
//   id: i,
//   img: 'http://staticaky.yepme.com/newcampaign/3932/39327_YPZM_1.jpg',
//   title: 'Dorita Solid Zipper Dress',
//   brand: 'YepMe',
//   brandIcon: 'http://staticaky.yepme.com/images/yepme-logo.gif',
//   detail: {
//     descr: 'Navy blue, woven, printed top, has a V neckline with rucked detail three quarter puff sleeves with button cuffs',
//     sizes: ['S', 'L', 'XL'],
//     fit: 'slim fit'
//   },
//   adImg: 'http://www.yepme.com/Images/lookbookimages/big-banners/ridersCafe/ridersCafe-2.jpg'
// });

// i += 1;

// angular.forEach([1, 2], function() {

//   items.push({
//     type: 'listing',
//     id: i,
//     img: 'http://staticaky.yepme.com/newcampaign/3932/39327_YPZM_1.jpg',
//     title: 'Dorita Solid Zipper Dress',
//     brand: 'YepMe',
//     brandIcon: 'http://staticaky.yepme.com/images/yepme-logo.gif',
//     detail: {
//       descr: 'Navy blue, woven, printed top, has a V neckline with rucked detail three quarter puff sleeves with button cuffs',
//       sizes: ['S', 'L', 'XL'],
//       fit: 'slim fit'
//     }
//   });

//   i += 1;

//   items.push({
//     type: 'listing',
//     id: i,
//     img: 'http://staticaky.yepme.com/newcampaign/3293/32932_YPXL_1.jpg',
//     title: 'Raphael Check Shirt',
//     brand: 'YepMe',
//     brandIcon: 'http://staticaky.yepme.com/images/yepme-logo.gif',
//     detail: {
//       descr: 'Slim fit check shirt with zig-zag stitch line detail at front shoulder joint, bias check detailing at front placket, contrast detailing at inner collar band & stylized chest pocket',
//       sizes: ['40', '41', '42'],
//       fit: 'slim fit'
//     }
//   });

//   i += 1;
// });


// items.push({
//   type: 'listing',
//   id: i,
//   img: 'http://staticaky.yepme.com/newcampaign/3932/39327_YPZM_1.jpg',
//   title: 'Dorita Solid Zipper Dress',
//   brand: 'Levis',
//   brandIcon: 'http://staticaky.yepme.com/images/yepme-logo.gif',
//   detail: {
//     descr: 'Navy blue, woven, printed top, has a V neckline with rucked detail three quarter puff sleeves with button cuffs',
//     sizes: ['S', 'L', 'XL'],
//     fit: 'slim fit'
//   },
//   adImg: 'http://www.yepme.com/Images/lookbookimages/big-banners/ridersCafe/ridersCafe-3.jpg'
// });

// i += 1;

// angular.forEach([1, 2], function() {
//   items.push({
//     type: 'listing',
//     id: i,
//     img: 'http://staticaky.yepme.com/newcampaign/3932/39327_YPZM_1.jpg',
//     title: 'Dorita Solid Zipper Dress',
//     brand: 'Levis',
//     brandIcon: 'http://staticaky.yepme.com/images/yepme-logo.gif',
//     detail: {
//       descr: 'Navy blue, woven, printed top, has a V neckline with rucked detail three quarter puff sleeves with button cuffs',
//       sizes: ['S', 'L', 'XL'],
//       fit: 'slim fit'
//     }
//   });

//   i += 1;

//   items.push({
//     type: 'listing',
//     id: i,
//     img: 'http://staticaky.yepme.com/newcampaign/3293/32932_YPXL_1.jpg',
//     title: 'Raphael Check Shirt',
//     brand: 'Levis',
//     brandIcon: 'http://staticaky.yepme.com/images/yepme-logo.gif',
//     detail: {
//       descr: 'Slim fit check shirt with zig-zag stitch line detail at front shoulder joint, bias check detailing at front placket, contrast detailing at inner collar band & stylized chest pocket',
//       sizes: ['40', '41', '42'],
//       fit: 'slim fit'
//     }
//   });

//   i += 1;
// });


// _search.factory('search', ['$q', function($q) {

//   return function(query) {
//     var promise = $q.when(query);

//     promise = promise.then(function(query) {
//       var defer = $q.defer();

//       setTimeout(function() {
//         defer.resolve({
//           'searchId': 'asfasdfadsf',
//           'items': items
//         });
//       }, 1000)

//       return defer.promise;
//     });

//     return promise;
//   };

// }]);


// _search.factory('fetchMore', ['$q', function($q) {

//   return function(searchId) {
//     var promise = $q.when(searchId);

//     promise = promise.then(function(searchId) {
//       var defer = $q.defer();

//       if(searchId === '') defer.reject('no search id');

//       setTimeout(function() {
//         defer.resolve(items);
//       }, 500);

//       return defer.promise;
//     });

//     return promise;
//   };
// }]);