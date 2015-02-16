var _listings =
	angular.module('controllers.listings',
		['services.listings',
     'services.query'
    ]
	);



_listings.controller('ListingsController',
	['$scope',
   'QueryView',
	 'ListingsService',
function($scope, QueryView, ListingsService) {

  $scope.items = [];

  // Fetch default listing
  ListingsService.fetchListings().then(function(items) {
    $scope.items = items;
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
  $scope.moreContent = ListingsService.hasMoreContent

  $scope.loadMoreData = function() {
    ListingsService.fetchMore($scope.searchId).then(function(items) {
      $scope.items = $scope.items.concat(items);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  }

}]);