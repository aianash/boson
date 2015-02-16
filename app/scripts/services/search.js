var _search = angular.module('services.search', ['services.dummy']);

_search.factory('SearchService',
	['$q',
   'DummyData',
function($q, DummyData) {

	function search(searchId) {
		var promise = $q.when(searchId);

    promise = promise.then(function(searchId) {
      var defer = $q.defer();

      setTimeout(function() {
        defer.resolve(DummyData.results(searchId));
      }, 1000)

      return defer.promise;
    });

    return promise;
	}

	return {
		search: search
	};

}]);