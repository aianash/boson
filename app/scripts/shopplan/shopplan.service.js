'use strict'

angular
  .module('boson.shopplan')
  .factory('ShopPlan', ShopPlanFactory);

ShopPlanFactory.$inject = [
  '$q',
  'lodash',
  'Higgs'
];


function ShopPlanFactory($q, _, Higgs) {

  var _ShopPlan;

  _ShopPlan = (function() {

    function ShopPlan() {
      this.plans = [];
      // [NOTE] plan is intentionally left null
    }

    // Public
    ShopPlan.prototype.all   = all;
    ShopPlan.prototype.get   = get;

    // Private
    ShopPlan.prototype._initPlans  = _initPlans;
    ShopPlan.prototype._initPlan   = _initPlan;

    return ShopPlan;


    ///////////////////////////////////////////////////
    /////////////// Public functions //////////////////
    ///////////////////////////////////////////////////

    function all() {
      return Higgs.getShopPlans()
        .then(this._initPlans);
    }

    function get(planId) {
      return Higgs.getShopPlan(planId)
        .then(this._initPlan);
    }

    ///////////////////////////////////////////////////
    /////////////// Private functions /////////////////
    ///////////////////////////////////////////////////

    function _initPlans(plans) {
      this.plans = plans;
      return plans;
    }

    function _initPlan(plan) {
      this.plan = plan;
      return plan;
    }

  })();

  return new _ShopPlan();
}