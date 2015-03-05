var _query = angular.module('services.query', ['services.dummy']);


_query.factory('QueryService',
  ['$q',
   'DummyData',
function($q, DummyData) {

  return {
    expand: function(searchId, queryStr) {

      var promise = $q.when(queryStr);

      // Throttling and REST request
      promise = promise.then(function(queryStr) {
        var defer = $q.defer();

        setTimeout(function() {
          defer.resolve(DummyData.query(queryStr, searchId));
        }, 500);

        return defer.promise;
      });

      return promise;
    }
  };
}]);