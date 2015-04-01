angular
  .module('boson.shopplan')
  .controller('ShopPlanDetailController', ShopPlanDetailController);


ShopPlanDetailController.$inject = [
  '$scope',
  '$state',
  '$ionicPopup',
  '$anchorScroll',
  '$location',
  'initShopPlan'
];

function ShopPlanDetailController($scope, $state, $ionicPopup, $anchorScroll, $location, ShopPlan) {

  var vm = this;

  // This is the ShopPlan object defined
  // in boson.core modules's shopplan.service
  vm.plan   = ShopPlan.plan;


  // ViewModel functions
  vm.hasPlan          = hasPlan;
  vm.isStoreCollapsed = isStoreCollapsed;
  vm.expandStore      = expandStore;
  vm.prevDestination  = prevDestination;
  vm.nextDestination  = nextDestination;
  vm.endPlan          = endPlan;

  var currentDestIdx = 0;
  var showingStoreId = plan.destinations[currentDestIdx].stores[0].stuid;


  ///////////////////////////////////////////////////////

  function hasPlan() {
    return !!$scope.plan;
  }

  function isStoreCollapsed(id) {
    return (showingStoreId && showingStoreId === id);
  }

  function expandStore(id) {
    showingStoreId = id;
  }

  function prevDestination() {
    currentDestIdx -= 1;
    _moveToDestByIdx(currentDestIdx);
  }

  function nextDestination() {
    currentDestIdx += 1;
    _moveToDestByIdx(currentDestIdx);
  }

  function endPlan($event){
    var confirmPopup = $ionicPopup.confirm({
      title: 'Confirm',
      template: 'Are you sure you want to end this plan ?'
    });

    confirmPopup.then(function(res) {
      if(res) vm.plan.end().then(_goToShopPlanList)
    });
  }


  /////////////////////
  // Private methods //
  /////////////////////

  function _moveToDestByIdx(idx) {
    idx = Math.abs(idx) % vm.plan.destinations.length;
    var newHash = 'dest' + (vm.plan.destinations[idx].id);

    var target = document.getElementById(newHash);
    target.scrollIntoView(true);
  }

  function _goToShopPlanList() {
    $state.go('boson.shopplan.index');
  }

}