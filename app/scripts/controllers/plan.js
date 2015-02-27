var _plan = angular.module('controllers.plan',
  ['services.higgs',
   'services.plan',
   'directives.imageLazyLoad']); // temp loader will be optimized

_plan.controller('PlanController',
  ['$scope',
   '$ionicPopup',
   'PlanService',
function($scope, $ionicPopup, PlanService) {

	var showingStoreId;

  PlanService.getPlan().then(function(plan) {
    $scope.plan = plan;
    showingStoreId = plan.destinations[0].stores[0].id;
  });


  $scope.isCollapsed = function(id) {
  	return (showingStoreId && showingStoreId === id);
  };

  $scope.showStore = function(id) {
  	showingStoreId = id;
  };

  $scope.askToMarkShoppingPlan = function($event){
  	var confirmPopup = $ionicPopup.confirm({
  		title: 'Confirm',
  		template: 'Are you sure you want to close the current plan ?'
  	});

  	confirmPopup.then(function(res) {
  		if(res) {
  			PlanService.closePlan($scope.plan.id);
  		}
  	});
  };

}]);