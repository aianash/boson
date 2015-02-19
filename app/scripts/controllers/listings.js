var _listings =
	angular.module('controllers.listings',
		['services.listings',
     'services.query',
     'utils'
    ]
	);



_listings.controller('ListingsController',
	['$scope',
   'storeTypeIcon',
   'QueryView',
	 'ListingsService',
function($scope, storeTypeIcon, QueryView, ListingsService) {

  $scope.offers = [];

  // Fetch default listing
  ListingsService.fetchListings().then(function(listings) {
    $scope.ads = listings.ads;
    $scope.offers = listings.offers;
  });



  $scope.selectedStores = {};

  function selectStore(storeId) {
    ListingsService.selectStore(storeId);
    $scope.selectedStores[storeId] = true;
  }

  function deselectStore(storeId) {
    ListingsService.deselectStore(storeId);
    $scope.selectedStores[storeId] = false;
  }



  $scope.isStoreSelected = function(storeId) {
    return $scope.selectedStores[storeId] == true;
  }

  $scope.toggleStore = function(storeId) {
    if($scope.isStoreSelected(storeId)) deselectStore(storeId)
    else selectStore(storeId);
  }

  $scope.openSearch = QueryView.show;

  $scope.offerIcon = function(type) {
    return storeTypeIcon(type);
  };

  // Infinite scroll related functions
  $scope.moreContent = function() {
    return ListingsService.hasMoreListings()
  };


  $scope.loadMoreData = function() {
    ListingsService.fetchMore().then(function(offers) {
      $scope.offers = $scope.offers.concat(offers);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  }

}]);