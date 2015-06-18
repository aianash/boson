angular
  .module('boson.core')
  .provider('cache', CacheProvider);


function CacheProvider() {

  var entryLimit = 100;

  this.setEntryLimit = setEntryLimit;
  this.$get = ['$q', CacheFactory];


  ///////////////////////////////

  function setEntryLimit(limit) {
    entryLimit = limit;
  }

  function CacheFactory($q) {
    var _Cache;

    _Cache = (function() {
      function Cache(entryLimit) {
        this.entryLimit = entryLimit; // [NOTE] Currently infinite cache
        this._cache = {};
      }

      // Public
      Cache.prototype.get = get
      Cache.prototype.put = put

      Cache.prototype.empty = empty
      return Cache;

      /////////////// Public functions ////////////

      function get(key) {
        return this._cache[key];
      }

      function put(key, value) {
        this._cache[key] = value;
      }

      function empty() {
        this._cache = {};
      }

    })();

    return new _Cache(entryLimit);
  }

}