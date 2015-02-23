var _plan = angular.module('controllers.plan',
  ['services.higgs',
   'services.plan']);

_plan.controller('PlanController',
  ['$scope',
   'PlanService',
function($scope, PlanService) {

  PlanService.getPlan().then(function(plan) {
    $scope.plan = plan;
  });

}]);