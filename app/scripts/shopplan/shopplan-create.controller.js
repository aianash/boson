angular
  .module('boson.shopplan')
  .controller('ShopPlanCreateController', ShopPlanCreateController);

ShopPlanCreateController.$inject = [
  'lodash',
  '$scope',
  '$state',
  'initShopPlanner'
];

function ShopPlanCreateController(_, $scope, $state, ShopPlanner) {

  var vm = this;

  vm.goToPlans      = goToPlans;
  vm.goToMap        = goToMap;
  vm.goToInvites    = goToInvites;
  vm.goToPreview    = goToPreview;

  /////////////////////////////////////////////////////////

  function goToPlans() {
    $state.go('boson.shopplan.create.plans');
  }

  function goToMap() {
    $state.go('boson.shopplan.create.map');
  }

  function goToInvites() {
    $state.go('boson.shopplan.create.friends');
  }

  function goToPreview() {
    $state.go('boson.shopplan.create.preview');
  }

}