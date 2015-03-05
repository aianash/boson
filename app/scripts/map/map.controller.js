angular
  .module('boson.map')
  .controller('MapController', MapController);


MapController.$inject = ['$scope', 'MapService'];

function MapController($scope, MapService) {

  MapService.getLocations().then(function(latLngs) {
    $scope.latLngs = latLngs;
  });


  MapService.setDestination(1, [-34.397, 150.644]);
}