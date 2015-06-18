angular
  .module('boson.shopplan')
  .controller('ChoosePlansController', ChoosePlansController);

ChoosePlansController.$inject = [
  'lodash',
  '$scope',
  'initShopPlanner'
];

function ChoosePlansController(_, $scope, ShopPlanner) {

  var vm = this;

  // list of plans with summary data
  vm.shopplans      = ShopPlanner.shopplans

  vm.choosePlan     = choosePlan;
  vm.createNewPlan  = createNewPlan;


  ///////////////////////
  // ViewModel methods //
  ///////////////////////

  function choosePlan(planId) {
    ShopPlanner.chooseExistingShopPlan(planId).then(_moveToMap);
  }

  function createNewPlan() {
    ShopPlanner.createNewPlan().then(_moveToMap);
  }


  ////////////////////////////
  // Private helper methods //
  ////////////////////////////

  function _moveToMap(success) {
    if(success) $scope.$parent.creator.goToMap();
  }

}