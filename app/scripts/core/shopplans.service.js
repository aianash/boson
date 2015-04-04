angular
  .module('boson.core')
  .service('ShopPlansFactory', ShopPlansFactory);


ShopPlansFactory.$inject = ['lodash', '$q', 'ShopPlanFactory'];

function ShopPlansFactory(_, $q, ShopPlanFactory) {

  var ShopPlans = _ShopPlans(_, $q, ShopPlanFactory);

  this.create = function(piggyback) {
    return new ShopPlans(piggyback);
  }
}


/** Closure over dependencies */
function _ShopPlans(_, $q, ShopPlanFactory) {

  /**
   * Contains ShopPlans for a user
   *
   * @param {PiggyBack} piggyback     A piggyback instance
   */
  function ShopPlans(piggyback) {

    this._Piggyback = piggyback;

    // cache of the ShopPlan instance
    // {suid: <ShopPlan>}
    this._shopplans = {};

    // A ShopPlan instance to be used while creating
    // a new plan.
    // After this plan is saved, it will be replaced
    // with a new instance.
    this._newPlan   = ShopPlanFactory.createNew();

    this._api = {
      plan: {
        all: 'shopplan/all'
      }
    };
  }

  // Public
  ShopPlans.prototype.create = create;
  ShopPlans.prototype.save   = save;
  ShopPlans.prototype.all    = all;
  ShopPlans.prototype.list   = all; // alias
  ShopPlans.prototype.get    = get;

  // Private
  ShopPlans.prototype._createShopPlan = _createShopPlan;

  return ShopPlans;


  //////////////////////////////////////////////////////
  ////////////////// Public Functions //////////////////
  //////////////////////////////////////////////////////


  function create() { return this._newPlan; }


  /**
   * Save the given plan or save/create the new plan
   *
   * @param  {Number} suid 64 bit Long unique shop plan id
   * @return {Promise.<bool>}        promise of successs (boolean)
   */
  function save(suid) {
    var self = this;

    if(suid) return this.get(suid).save();
    else return this._newPlan.save()
        .then(function(success){
          if(success)
            self._newPlan = ShopPlanFactory.createNew(); // after updating create
                                                         // a fresh new emtpy plan
                                                         // instance
          return success;
        });
  }


  /**
   * Get array of shopplans
   *
   * @return {Arrsay.<ShopPlan>}    Array of ShopPlan instances
   */
  function all() {
    var self = this;

    if(!_.isEmtpy(this._shopplans))
      return _.values(this._shopplans);
    else
      return this._Piggyback.GET(this._apis.plan.all)
          .then(function(resp) { // to verify
            if(resp.status === 200 && _.isArray(resp.data)) {
              // response's data is an array of summaries of
              // shopplan
              var shopplans =
                _.map(resp.data, _createShopPlanWithSummary, self);

              return shopplans;
            } else throw new Error(resp.statusText);
          });

    function _createShopPlanWithSummary(plan) {
      var shopplan = this._createShopPlan(plan.shopplanId, plan);
      this._shopplans[shopplan.suid] = shopplan; // caching the plan
      return shopplan;
    }

  }


  /**
   * Get ShopPlan object for the planId
   * Either from cache or create one
   *
   * @param  {String} planId ShopPlan id
   * @return {ShopPlan}        ShopPlan object
   */
  function get(suid) {
    if(suid in this._shopplans) return this._shopplans[suid];

    var shopplan = ShopPlanFactory.create(suid, this._Piggyback)
    this._shopplans[planId] = shopPlan;
    return shopPlan;
  }


  /////////////////////////////////////////////////////////////////
  /////////////////// Private Functions ///////////////////////////
  /////////////////////////////////////////////////////////////////

  /**
   * Create ShopPlan instance
   *
   * @param  {string} shopplanId Shopping plan id i.e. with userId.uuid and suid
   * @param  {Object} data   Shopping plan data
   * @return {ShopPlan}      ShopPlan instance
   */
  function _createShopPlan(shopplanId, data) {
    return ShopPlanFactory.create(planId, this._Piggyback, data);
  }

}