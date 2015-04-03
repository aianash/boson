angular
  .module('boson.shopplan')
  .controller('ChooseDestinationsController', ChooseDestinationsController);

ChooseDestinationsController.$inject = [
  'lodash',
  '$scope',
  'initShopPlanner'
];


// Controller for Map view in Create ShopPlan
// [WIP]
function ChooseDestinationsController(_, $scope, ShopPlanner) {

  ShopPlanner.ensurePlanSelected();

  var vm = this;

  vm.stores       = ShopPlanner.stores;
  vm.destinations = ShopPlanner.destinations;

  vm.addDestination     = addDestination;
  vm.removeDestionation = removeDestionation;
  vm.updateDestination  = removeDestionation;

  /////////////////////////
  // ViewModel functions //
  /////////////////////////

  function addDestination(location, order) {
    ShopPlanner.addDestination(location, order)
      .then(_afterAddition);
  }

  function removeDestionation(destId) {
    ShopPlanner.removeDestionation(destId)
      .then(_afterRemoval);
  }

  function updateDestination(destId, location, order) {
    ShopPlanner.updateDestination(destId, location, order)
      .then(_afterUpdate);
  }

  /////////////////////
  // Private Methods //
  /////////////////////


  function _afterAddition(destination) {
    vm.destinations.push(destination);
  }

  function _afterRemoval(destId) {
    _.remove(vm.destinations, {duid: destId});
  }

  function _afterUpdate(destination) {
    _.remove(vm.destinations, {duid: destination.duid});
    vm.destinations.push(destination);
  }

}