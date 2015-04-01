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
      return $q.when(true); // to do
    }

    function getResults(searchId) {
      return $q.when({}); // to do
    }

    function nextResults(searchId, page) {
      return $q.when({}); // to do
    }

    function addItemToBucket(itemId, storeId) {

    }

    function addStoreToBucket(storeId) {

    }

    function removeItemFromBucket(itemId, storeId) {

    }

    function removeStoreFromBucket(storeId) {

    }

  })();


  return new _Searcher();
}