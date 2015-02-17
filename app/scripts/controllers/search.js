var _search =
  angular.module('controllers.search',
    ['services.search',
     'services.query']
  );

_search.controller('SearchController',
	['$scope',
   '$state',
   '$stateParams',
   'QueryView',
   '$ionicLoading',
   '$timeout',
   '$ionicModal',
   'SearchService',
function($scope, $state, $stateParams, QueryView, $ionicLoading, $timeout, $ionicModal, SearchService) {

  $scope.searchId = $stateParams.searchId;
  $scope.items = [];

  function processResult(results) {
    $scope.items = $scope.items.concat(results.items);
    $scope.hasMoreContent = results.hasMoreContent;
    // $scope.$digest();
  }

  // Fetch results for the view
  QueryView.hide();
  $ionicLoading.show({template: 'Fetching results...'});

  SearchService.search($scope.searchId).then(function(results) {
    processResult(results);
    $ionicLoading.hide();
  });


  $scope.$on('refreshSearch', function(event) {
    console.log("refreshing search");
    console.log(event);
  });

  $scope.$on('stickHeader', function(event, brandId) {
    console.log(brandId);
    $scope.brandId = brandId;
    $scope.$digest();
  });


  $scope.selectedItems = {};

  function selectItem(id) {
    $scope.selectedItems[id] = true;
  }

  function deselectItem(id) {
    $scope.selectedItems[id] = false;
  }

  $scope.isItemSelected = function(id) {
    return $scope.selectedItems[id] == true;
  }

  $scope.itemSelected = function(id) {
    if($scope.isItemSelected(id)) deselectItem(id)
    else selectItem(id);
  }

  $scope.openSearch = QueryView.show;

  // Infinite scroll related functions

  $scope.loadMoreData = function() {
    SearchService.fetchMore($scope.searchId).then(function(results) {
      processResult(results);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  }

  $scope.brandIdPresent = function() {
    return $scope.brandId != null && typeof $scope.brandId != 'undefined';
  }

}]);