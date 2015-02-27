var _plan = angular.module('controllers.plan',
  ['services.higgs',
   'services.plan',
   'directives.imageLazyLoad']); // temp loader will be optimized

_plan.controller('PlanController',
  ['$scope',
   '$ionicPopup',
   '$anchorScroll',
   '$location',
   'PlanService',
function($scope, $ionicPopup, $anchorScroll, $location, PlanService) {

	var showingStoreId;

  PlanService.getPlan().then(function(plan) {
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
  			PlanService.closePlan($scope.plan.id).then(function() {
  				$scope.plan = void 0;
  			});
  		}
  	});
  };

}]);