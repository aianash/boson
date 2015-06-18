angular
  .module('boson.search')
  .factory('Searcher', SearcherFactory);

SearcherFactory.$inject = [
  '$q',
  '$timeout',
  '$ionicActionSheet',
  'lodash',
  'Higgs'
];


function SearcherFactory($q, $timeout, $ionicActionSheet, _, Higgs) {

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

    Searcher.prototype._showError = _showError;

    return Searcher;


    ////////////////////
    // Public Methods //
    ////////////////////

    function updateQuery(sruid, query) {
      Higgs.updateQuery(sruid, query);
    }

    function getResults(sruid) {
      var self = this;
      return Higgs.getSearchResults(sruid, 0)
                  .then(function(result) {
                    self.result = result.result;
                    return result;
                  }, _.bind(this._showError("Error getting search results"), this));
    }

    function nextResults(sruid, page) {
      return Higgs.getSearchResults(sruid, page);
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

    function _showError(msg) {
      return function onError(error) {
        console.error("Error in searcher = [" + JSON.stringify(error) + "]");
        var hideError = $ionicActionSheet.show({
          titleText: msg
        });

        $timeout(function() {
          hideError()
        }, 2000);
      }
    }

  })();

  return new _Searcher();
}