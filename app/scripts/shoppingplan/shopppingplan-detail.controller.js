angular
  .module('boson.shoppingplan')
  .controller('ShoppingPlanDetailController', ShoppingPlanDetailController);


ShoppingPlanDetailController.$inject = [
  '$scope',
  '$stateParams',
  '$ionicPopup',
  '$anchorScroll',
  '$location',
  'ShoppingPlanService'
];

function ShoppingPlanDetailController($scope, $stateParams, $ionicPopup, $anchorScroll, $location, ShoppingPlanService) {

  $scope.planId = $stateParams.planId;

  var showingStoreId, currentDestIdx;

  ShoppingPlanService.getPlan($scope.planId).then(function(plan) {
    $scope.plan = plan;
    currentDestIdx = 0;
    showingStoreId = plan.destinations[currentDestIdx].stores[0].id;
  });

  $scope.hasPlan = function() {
    return !!$scope.plan;
  };

  $scope.isCollapsed = function(id) {
    return (showingStoreId && showingStoreId === id);
  };

  $scope.showStore = function(id) {
    showingStoreId = id;
  };

  function moveToDestByIdx(idx) {
    idx = Math.abs(idx) % $scope.plan.destinations.length;
    var newHash = 'dest' + ($scope.plan.destinations[idx].id);

    var target = document.getElementById(newHash);
    target.scrollIntoView(true);
  }

  $scope.prevDestination = function() {
    currentDestIdx -= 1;
    moveToDestByIdx(currentDestIdx);
  };

  $scope.nextDestination = function() {
    currentDestIdx += 1;
    moveToDestByIdx(currentDestIdx);
  };

  $scope.askToMarkShoppingPlan = function($event){
    var confirmPopup = $ionicPopup.confirm({
      title: 'Confirm',
      template: 'Are you sure you want to close the current plan ?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        ShoppingPlanService.closePlan($scope.plan.id).then(function() {
          $scope.plan = void 0;
        });
      }
    });
  };

}