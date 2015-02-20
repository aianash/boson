var _search = angular.module('services.search',
  ['services.dummy',
   'services.pion',
   'services.higgs']);

_search.factory('SearchService',
  ['$q',
   'higgs',
   'pion',
function($q, higgs, pion) {

  var _SearchService;

  _SearchService = (function() {
    function SearchService() {/** constructor */}

    SearchService.prototype.search = function(searchId) {
      return pion.search(searchId);
    };

    SearchService.prototype.hasMoreResults = function(searchId) {
      return pion.hasMoreResults;
    };

    SearchService.prototype.nextResults = function(searchId) {
      return pion.nextResults(searchId);
    };

    SearchService.prototype.selectStore = function(storeId) {
      higgs.selectStore(storeId);
    };

    SearchService.prototype.deselectStore = function(storeId) {
      higgs.deselectStore(storeId);
    };

    SearchService.prototype.selectItem = function(itemId, storeId) {
      higgs.selectItem(itemId, storeId);
    };

    SearchService.prototype.deselectItem = function(itemId, storeId) {
      higgs.deselectItem(itemId, storeId);
    };

    return SearchService;
  })();

  return new _SearchService();

}]);