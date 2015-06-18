angular
  .module('boson.core')
  .service('ShopPlanFactory', ShopPlanFactory);

ShopPlanFactory.$inject  = ['lodash', '$q', 'KeepFactory'];

function ShopPlanFactory(_, $q, KeepFactory) {

  var ShopPlan = _ShopPlan(_, $q);

  /**
   * Create shopplan
   *
   * @param  {Object} shopplanId {createdBy: {uuid}, suid}
   * @param  {Object} piggyback  Piggyback isntance
   * @param  {Object} planData   (refer to thrift api ShopPlan)
   *
   * @return {Object}            ShopPlan instance
   */
  this.create = function(shopplanId, piggyback, data) {
    return new ShopPlan(piggyback, shopplanId, data);
  }

}

/** Closure over dependencies */
function _ShopPlan(_, $q) {

  /**
   * It represents a new empty plan (when only keep is passed)
   * Where it holds plan data locally and create the plan on save
   *
   * Otherwise when its an existing plan, then it fetches
   * the data and also holds updates.
   *
   * [NOTE]
   * 1. Revisit Piggy sourcing
   *
   * @param {Number} shopplanId {suid: <Number>, createdBy: {uuid}}
   * @param {Object} piggyback Piggyback instance
   */
  function ShopPlan(piggyback, shopplanId, data) {
    this._Piggyback = piggyback;
    if(shopplanId) {
      this.shopplanId = shopplanId;
      this.suid       = shopplanId.suid;
    }

    this.init(data);
  }

  // Public
  ShopPlan.prototype.init = init;

  return ShopPlan;

  //////////////////////////////////////////////////////
  ///////////////// Public Functions ///////////////////
  //////////////////////////////////////////////////////

  /**
   * This updates shop plan fields from the
   * provided data to this instance
   *
   * @param  {Object} data ShopPlan data object (as returned from server
   *                       refer thrift api)
   */
  function init(data) {
    if('title' in data)   this.title             = data.title;
    if('isInvitation' in data) this.isInvitation = data.isInvitation;
    if('dstores' in data) this.dstores           = data.dstores;
    if('invites' in data) this.invites           = data.invites;
    if('destinations' in data) this.destinations = data.destinations;
  }

}