var _listings = angular.module('services.listings', ['services.higgs']);


_listings.factory('ListingsService',
  ['$q',
   'higgs',
function($q, higgs) {

  var ListingsService;

  ListingsService = (function() {

    function ListingsService() {/** constructor */}

    ListingsService.prototype.fetchListings = function() {
      return higgs.getListings();
    };

    ListingsService.prototype.fetchMore = function() {
      return higgs.moreListings();
    };

    ListingsService.prototype.hasMoreListings = function () {
      return higgs.hasMoreListings();
    };

    ListingsService.prototype.selectStore = function(storeId) {
      higgs.selectStore(storeId);
    };

    ListingsService.prototype.deselectStore = function(storeId) {
      higgs.deselectStore(storeId);
    };


    return ListingsService;
  })();

  return new ListingsService();

}]);