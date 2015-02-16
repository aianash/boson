_search = angular.module('service.search', []);

_search.factory('SearchService',
	['$q',
function($q) {

	function search(query) {
		var promise = $q.when(query);

    promise = promise.then(function(query) {
      var defer = $q.defer();

      setTimeout(function() {
        defer.resolve({
          'searchId': 'asfasdfadsf',
          'items': items
        });
      }, 1000)

      return defer.promise;
    });

    return promise;
	}

	return {
		search: search
	};

}]);