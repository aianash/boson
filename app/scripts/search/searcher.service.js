angular
  .module('boson.search')
  .factory('Searcher', SearcherFactory);

SearcherFactory.$inject = [
  '$q',
  'lodash',
  'Higgs'
];


function SearcherFactory($q, _, Higgs) {

  var _Searcher;

  _Searcher = (function() {

    function Searcher() {
      this.page = 0;
      this.result = [];
      this.sruid;
    }

    // Public
    Searcher.prototype.updateQuery            = updateQuery;
    Searcher.prototype.getResults             = getResults;
    Searcher.prototype.nextResults            = nextResults;
    Searcher.prototype.addItemToBucket        = addItemToBucket;
    Searcher.prototype.addStoreToBucket       = addStoreToBucket;
    Searcher.prototype.removeItemFromBucket   = removeItemFromBucket;
    Searcher.prototype.removeStoreFromBucket  = removeStoreFromBucket;

    return Searcher;


    ////////////////////
    // Public Methods //
    ////////////////////

    function updateQuery(searchId, query) {
      return Higgs.updateQuery(searchId, query);
    }

    function getResults(searchId) {
      return Higgs.getSearchResults(searchId, 0);
    }

    function nextResults(searchId, page) {
      return Higgs.getSearchResults(searchId, page);
    }

    function addItemToBucket(itemId, storeId) {
      Higgs.addItemToBucket(itemId, storeId);
    }

    function addStoreToBucket(storeId) {
      Higgs.addStoreToBucket(storeId);
    }

    function removeItemFromBucket(itemId, storeId) {
      Higgs.removeItemFromBucket(itemId, storeId);
    }

    function removeStoreFromBucket(storeId) {
      Higgs.removeStoreFromBucket(storeId);
    }

  })();

  return new _Searcher();
}