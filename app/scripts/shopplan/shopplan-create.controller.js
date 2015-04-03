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

  vm.isState        = isState;
  vm.goToPlans      = goToPlans;
  vm.goToMap        = goToMap;
  vm.goToInvites    = goToInvites;
  vm.goToPreview    = goToPreview;


  /////////////////////////////////////////////////////////

  function isState(state) {
    return $state.$current.name === ('boson.shopplan.create.' + state);
  }

  function goToPlans() {
    $state.go('boson.shopplan.create.plans');
  }

  function goToMap() {
    $state.go('boson.shopplan.create.map');
  }

  function goToInvites() {
    $state.go('boson.shopplan.create.invite');
  }

  function goToPreview() {
    $state.go('boson.shopplan.create.preview');
  }

}