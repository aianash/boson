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

  $scope.offers = [];

  // Fetch default listing
  ListingsService.fetchListings().then(function(listings) {
    $scope.ads = listings.ads;
    $scope.offers = listings.offers;
  });


  $scope.offerIcon = function(type) {
    switch(type) {
      case 'apparels':
        return 'ion-tshirt-outline'
      case 'store':
        return 'ion-bag'
    };
  }

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
    ListingsService.fetchMore().then(function(offers) {
      $scope.offers = $scope.offers.concat(offers);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  }

}]);