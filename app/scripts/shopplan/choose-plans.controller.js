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

  vm.choosePlan     = choosePlan;
  vm.createNewPlan  = createNewPlan;
  vm.shopplans      = ShopPlanner.shopplans;

  ///////////////////////
  // ViewModel methods //
  ///////////////////////

  function choosePlan(planId) {
    ShopPlanner.chooseExistingShopPlan(planId)
      .then(_moveToMap);
  }

  function createNewPlan() {
    ShopPlanner.createNewPlan()
      .then(_moveToMap);
  }


  ////////////////////////////
  // Private helper methods //
  ////////////////////////////

  function _moveToMap(success) {
    if(success) $scope.$parent.creator.goToMap();
  }

}