angular
  .module('boson.shopplan')
  .controller('PreviewPlanController', PreviewPlanController);

PreviewPlanController.$inject = [
  'lodash',
  '$scope',
  '$state',
  '$ionicLoading',
  'initShopPlanner'
];

function PreviewPlanController(_, $scope, $state, $ionicLoading, ShopPlanner) {

  ShopPlanner.ensurePlanSelected();

  var vm = this;

  vm.save = save;

  function save() {
    $ionicLoading.show({template: 'Saving plan...'});
    ShopPlanner.savePlan().then(_goToPlans);
  }

  function _goToPlans(success) {
    $ionicLoading.hide();
    if(success) $state.go('boson.shopplan.index');
  }

}