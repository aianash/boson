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
//
// Common Object used
// destination
//  {
//    dtuid: <Timestamp/Number>
//    address: {
//      gpsLoc: {
//        lat: <Double>
//        lng: <Double>
//      }
//    }
//  }
//
// store locations (from bucket and plan)
//  {
//    storeId: {
//      stuid: <Number>
//    }
//    address: {
//      gpsLoc: {
//        lat: <Double>
//        lng: <Double>
//      }
//      title: <string>
//      short: <string>
//    }
//    name: {
//      full: <string>
//    }
//    itemTypes: [ <itemType <string>>]
//  }
function ChooseDestinationsController(_, $scope, ShopPlanner) {

  ShopPlanner.ensurePlanSelected();

  var vm = this;

  vm.bucketStoreLocs  = ShopPlanner.bucketStoreLocs;
  vm.currentStoreLocs = [];
  vm.destinations     = [];

  vm.addDestination     = addDestination;
  vm.removeDestionation = removeDestionation;
  vm.updateDestination  = updateDestination;

  _activate();

  /////////////////////////
  // ViewModel functions //
  /////////////////////////

  function addDestination(gpsLocation) {
    ShopPlanner.addDestination(gpsLocation)
      .then(_afterAddition);
  }

  function removeDestionation(dtuid) {
    ShopPlanner.removeDestionation(dtuid)
      .then(_afterRemoval);
  }

  function updateDestination(dtuid, gpsLocation) {
    ShopPlanner.updateDestination(dtuid, gpsLocation)
      .then(_afterUpdate);
  }


  /////////////////////
  // Private Methods //
  /////////////////////

  function _activate() {

    // Lazily get any existing store to fetch
    ShopPlanner.getExistingStoreLocs()
      .then(function(storeLocs) {
        vm.currentStoreLocs = _.map(storeLocs, function(store) {
          store.isExisting = true;
          return store;
        });
      });

    // [NOTE] existing destinations are fetched lazily
    // after stores are are shown on the map
    ShopPlanner.getExistingDestinations()
      .then(function(destinations) {
        vm.destinations = _.map(destinations, function(dest) {
          dest.isExisting = true;  // mark it as isExisting destination
          return dest;
        });
      });
  }

  function _afterAddition(destination) {
    destination.isExisting = false;
    vm.destinations.push(destination);
  }

  function _afterRemoval(dtuid) {
    _.remove(vm.destinations, {dtuid: dtuid});
  }

  function _afterUpdate(destination) {
    var dest = _.remove(vm.destinations, {dtuid: destination.dtuid})[0]; // assuming only one matches
    destination.isExisting = dest.isExisting; // make sure isExisting
    vm.destinations.push(destination);
  }

}