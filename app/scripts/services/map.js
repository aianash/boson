var _map = angular.module('services.map',
	['services.higgs']);

_map.factory('MapService',
	['$q',
	 'higgs',
function($q, higgs) {

	var _MapService;

	_MapService = (function() {
		function MapService() { /** constructor */ }

		MapService.prototype.getLocations = function() {
			return higgs.getStoreLocations();
		};

		MapService.prototype.setDestination = function(index, dest) {
			higgs.setDestination(index, dest);
		};

		return MapService;
	})();

	return new _MapService();

}]);