var _pion = angular.module('services.pion', []);


function PionProvider() {
  var apiVersion = '0.0.1';

  this.apiVersion = function(version) {
    apiVersion = version;
  };

  this.$get = ['$q', 'randomId64', 'DummyData',
    function($q, randomId64, DummyData) {
      var _Pion;

      _Pion = (function() {

        /**
         * Client for Pion (backend) service
         */
        function Pion(apiVersion) { /** constructor */
          this.apiVersion = apiVersion;
          this.hasMoreResults = false;
        };


        Pion.prototype.newSearch = function() {
          return randomId64();
        };

        Pion.prototype.search = function(searchId) {
          var promise = $q.when(searchId);
          var self = this;

          // Replace by http request
          promise = promise.then(function(searchId) {
            var defer = $q.defer();
            setTimeout(function() {
              defer.resolve(DummyData.results(searchId));
            }, 1000);
            return defer.promise;
          });

          promise = promise.then(function(results) {
            self.hasMoreResults = results.hasMoreResults;
            // reset searchId if server returns different;
            return results.items;
          });

          return promise;
        };


        Pion.prototype.nextResults = function(searchId) {
          var promise = $q.when(searchId);
          var self = this;

          promise = promise.then(function(searchId) {
            var defer = $q.defer();
            setTimeout(function() {
              defer.resolve(DummyData.results(searchId));
            }, 1000);
            return defer.promise;
          });

          promise = promise.then(function(results) {
            self.hasMoreResults = results.hasMoreResults;
            // [TO DO] reset searchId if server returns different;
            return results.items;
          });

          return promise;
        };

        return Pion;
      })();

      return new _Pion(apiVersion);
    }];
}

_pion.provider('pion', PionProvider);