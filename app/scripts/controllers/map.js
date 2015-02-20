var _map = angular.module('controllers.map',
	['services.map']);

_map.controller('MapController',
  ['$scope',
   'MapService',
function($scope, MapService) {

	MapService.getLocations().then(function(latLngs) {
		$scope.latLngs = latLngs;
	});


	MapService.setDestination(1, [-34.397, 150.644]);

}]);