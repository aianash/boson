var _plan = angular.module('controllers.plan',
  ['services.higgs',
   'services.plan',
   'directives.imageLazyLoad']); // temp loader will be optimized

_plan.controller('PlanController',
  ['$scope',
   'PlanService',
function($scope, PlanService) {

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

}]);