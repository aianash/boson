var _plan = angular.module('services.plan', []);


_plan.factory('PlanService',
  ['$q',
   'higgs',
function($q, higgs){

	var _PlanService;

	_PlanService = (function(){
		function PlanService(){ /** constructor */ }

		PlanService.prototype.getPlan = function() {
			return higgs.getPlan();
		};

		PlanService.prototype.closePlan = function(planId) {
			return higgs.closePlan(planId);
		};

		return PlanService;
	})();

	return new _PlanService();
}]);