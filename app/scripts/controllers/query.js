var _query =
  angular.module('controllers.query',
    ['services.query']
  );


_query.controller('QueryController',
  ['$scope',
   '$q',
   '$timeout',
   '$state',
   'QueryService',
function($scope, $q, $timeout, $state, QueryService) {

  $scope.queryStr = '';
  $scope.query = {};

  // Update searchId if query has a different searchId
  // Different searchId is possible if server already has
  // the searchId
  $scope.$watch('query', function(nVal, oVal) {
    $scope.searchId = nVal.searchId || Math.random().toString(36).substr(2);
  });

  $scope.search = function() {
    // just need to pass the searchId, the server persist the whole query
    // structure
    var promise;

    // if somehow the latest queryStr was not updated at
    // the server.
    if($scope.query.str != $scope.queryStr)
      promise = QueryService.expand($scope.searchId, $scope.queryStr);
    else
      promise = $q.when({searchId: $scope.searchId});

    promise.then(function(data) {
      $state.go('boson.listing.search', {searchId: data.searchId}, {reload: true, notify: true});
    });
  }

  $scope.expand = function() {
    QueryService
      .expand($scope.searchId, $scope.queryStr)
      .then(function(query) {
        $scope.query = query;
      });
  }

  $scope.reset = function() {
    $scope.query = {};
    $scope.queryStr = '';
  }

}]);