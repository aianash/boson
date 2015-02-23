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

		return PlanService;
	})();

	return new _PlanService();
}]);