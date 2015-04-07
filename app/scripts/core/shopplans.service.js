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
   * A helper object of Higgs.service to manage
   * user ShopPlans
   *
   * @param {PiggyBack} piggyback     A piggyback instance
   */
  function ShopPlans(piggyback) {

    this._Piggyback = piggyback;
    this._stale     = true; // marker to refresh shopplans of user

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
  ShopPlans.prototype.create                     = create;
  ShopPlans.prototype.save                       = save;
  ShopPlans.prototype.all                        = all;
  ShopPlans.prototype.list                       = all; // alias
  ShopPlans.prototype.get                        = get;

  // Private
  ShopPlans.prototype._createShopPlanWithSummary = _createShopPlanWithSummary;

  return ShopPlans;


  //////////////////////////////////////////////////////
  ////////////////// Public Functions //////////////////
  //////////////////////////////////////////////////////


  /**
   * Get/Create a new ShopPlan object
   *
   * @return {ShopPlan} ShopPlan object
   */
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
    else
      return this._newPlan.save()
        .then(function(success){
          if(success) {
            self._shopplans[self._newPlan.suid] = self._newPlan; // now its a complete plan
                                                                 // so cache it

            self._newPlan = ShopPlanFactory.createNew(); // after updating create
                                                         // a fresh new emtpy plan
                                                         // instance
          }

          return success;
        });
  }


  /**
   * Get array of shopplans, with summary data for each shopplan
   *
   * @return {Promise.<Array.<ShopPlan>>}    Promise of array of ShopPlan instances
   */
  function all() {
    var self = this;

    if(!this._stale && !_.isEmtpy(this._shopplans)) return $q.when(_.values(this._shopplans));
    else
      return this._Piggyback.GET(this._apis.plan.all)
          .then(function(resp) {
            if(resp.status === 200 && _.isArray(resp.data)) {
              // response's data is an array of summaries of shopplans
              var shopplans =
                _.map(resp.data, self._createShopPlanWithSummary, self);

              // cache the plan objects
              _.forEach(shopplans, function(shopplan) {
                  this._shopplans[shopplan.suid] = shopplan;
                }, self);

              self._stale = false;

              return shopplans;
            } else return $q.reject(new Error(resp.statusText));
          });

  }


  /**
   * Get ShopPlan object for the planId
   * Either from cache or get from server one
   *
   * @param  {Number} suid ShopPlan unique id
   * @return {ShopPlan}        ShopPlan object
   */
  function get(suid) {
    var self = this;

    if(suid in this._shopplans) return $q.when(this._shopplans[suid]);
    else
      return this._Piggyback.GET(this._apis.plan.get)
        .then(function(resp) {
          if(resp.status === 200 && _.isObject(resp.data)) {
            var shopplan = self._createShopPlanWithSummary(resp.data);

            self._shopplans[shopplan.suid] = shopplan; // cache

            return shopplan;
          } else return $q.reject(new Error(resp.statusText));
        });
  }


  /////////////////////////////////////////////////////////////////
  /////////////////// Private Functions ///////////////////////////
  /////////////////////////////////////////////////////////////////


  // Create new ShopPlan object and init with summary
  //
  // @param {Object.<ShopPlan>} plan Plan with following summary (refer thrift apis)
  //  {
  //    shopplanId: {
  //      userId: {uuid: <Number>}
  //      suid: <Number>
  //    }
  //    title: <string>
  //    destinations: [
  //      {
  //        dtuid: <Number>
  //        address: {
  //          gpsLoc: {lat: <Double>, lng: <Double}
  //          title: <string>
  //          short: <string>
  //        }
  //        numShops: <Number>
  //      },
  //      ...
  //    ]
  //    isInvitation: <Bool>
  //  }
  // @return  {Object.<ShopPlan>} ShopPlan object
  function _createShopPlanWithSummary(plan) {
    return ShopPlanFactory.create(plan.shopplanId, this._Piggyback, plan);
  }

}