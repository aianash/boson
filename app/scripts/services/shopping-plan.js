var _plan = angular.module('services.shoppingplan', []);


_plan.factory('ShoppingPlanService',
  ['$q',
   'higgs',
function($q, higgs){

  var _ShoppingPlanService;

  _ShoppingPlanService = (function(){
    function ShoppingPlanService(){ /** constructor */ }

    ShoppingPlanService.prototype.getPlan = function(planId) {
      return higgs.getPlan(planId);
    };

    ShoppingPlanService.prototype.closePlan = function(planId) {
      return higgs.closePlan(planId);
    };

    ShoppingPlanService.prototype.getPlans = function() {
      return higgs.getShoppingPlans();
    };

    ShoppingPlanService.prototype.changePlanDate = function(planId, timestamp) {
      // To implement
    };

    ShoppingPlanService.prototype.changePlanTitle = function(planId, title) {
      // To implement
    };

    return ShoppingPlanService;
  })();

  return new _ShoppingPlanService();
}]);