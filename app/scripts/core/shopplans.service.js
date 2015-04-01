angular
  .module('boson.core')
  .service('ShopPlansFactory', ShopPlansFactory);


ShopPlansFactory.$inject = ['$q', 'ShopPlanFactory'];

function ShopPlansFactory($q, ShopPlanFactory) {

  var ShopPlans = _ShopPlans($q, ShopPlanFactory);

  this.create = function(piggyback) {
    return new ShopPlans(piggyback);
  }
}


/** Closure over dependencies */
function _ShopPlans($q, ShopPlanFactory) {

  /**
   * Contains ShopPlans for a user
   *
   * @param {PiggyBack} piggyback     A piggyback instance
   */
  function ShopPlans(piggyback) {
    this._Piggyback = piggyback;
    this._shopplans = {};

    this._api = {
      plan: {
        all: 'shopplan/all'
      }
    };
  }

  // Public
  ShopPlans.prototype.all   = all;
  ShopPlans.prototype.list  = all; // alias
  ShopPlans.prototype.get   = get;

  // Private
  ShopPlans.prototype._createShopPlan = _createShopPlan;

  return ShopPlans;


  //////////////////////////////////////////////////////
  ////////////////// Public Functions //////////////////
  //////////////////////////////////////////////////////

  /**
   * Get array of shopplans
   *
   * @return {Array.<ShopPlan>}    Array of ShopPlan instances
   */
  function all() {
    var self = this;

    return
      this._Piggyback
        .GET(this._apis.plan.all)
        .then(function(resp) {
          if(resp.status === 200 && Array.isArray(resp.data)) {
            var shopplans = [];

            angular.forEach(resp.data, function(planData) {
              shopplan = this._createShopPlan(planData.id, planData);
              this._shopplans[shopplan.id] = shopplan; // cache the plan too
              shopplans.push(shopplan);
            }, self);

            return shopplans;

          } else throw new Error(resp.statusText);
        });
  }


  /**
   * Get ShopPlan object for the planId
   * Either from cache or create one
   *
   * @param  {String} planId ShopPlan id
   * @return {ShopPlan}        ShopPlan object
   */
  function get(planId) {
    if(planId in this._shopplans) return this._shopplans[planId];

    var shopPlan = ShopPlanFactory.create(planId, this._Piggyback)
    this._shopplans[planId] = shopPlan;
    return shopPlan;
  }


  /////////////////////////////////////////////////////////////////
  /////////////////// Private Functions ///////////////////////////
  /////////////////////////////////////////////////////////////////

  /**
   * Create ShopPlan instance
   *
   * @param  {string} planId Shopping plan id
   * @param  {Object} data   Shopping plan data
   * @return {ShopPlan}      ShopPlan instance
   */
  function _createShopPlan(planId, data) {
    return ShopPlanFactory.create(planId, this._Piggyback, data);
  }

}