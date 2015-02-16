var _listings = angular.module('services.listings', ['services.dummy']);


_listings.factory('ListingsService',
	['$q',
	 'DummyData',
function($q, DummyData) {

	function fetchListings() {
		return $q.when(DummyData.listings);
	}

	function fetchMore() {
		/** TO IMPLEMENT */
	}

	function hasMoreContent() {
		return false;
	}

	return {
		fetchMore: fetchMore,
		fetchListings: fetchListings,
		hasMoreContent: hasMoreContent
	};

}]);