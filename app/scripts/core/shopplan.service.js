angular
  .module('boson.core')
  .service('ShopPlanFactory', ShopPlanFactory);

ShopPlanFactory.$inject  = ['$q', 'KeepFactory'];

function ShopPlanFactory($q, KeepFactory) {

  var ShopPlan = _ShopPlan($q);

  /**
   * Create shopplan
   *
   * @param  {Object} shopplanId {userId: {uuid}, suid}
   * @param  {Object} piggyback  Piggyback isntance
   * @param  {Object} planData   {summary: <Object>, detail: <Object>}
   *
   * @return {Object}            ShopPlan instance
   */
  this.create = function(shopplanId, piggyback, data) {
    var keep = KeepFactory.create(shopplanId.suid);
    return new ShopPlan(shopplanId, piggyback, keep, data);
  }

  this.createNew = function() {
    var keep = KeepFactory.create('new-plan');
    return new ShopPlan();
  }
}


/** Closure over dependencies */
function _ShopPlan($q) {

  /**
   * It represents a new empty plan (when no parameter is passed)
   * Where it holds plan data locally and create the plan on save
   *
   * Otherwise when its an existing plan, then it fetches
   * the data and also holds updates.
   *
   * [NOTE]
   * 1. Revisit Piggy sourcing
   *
   * @param {Number} shopplanId {suid: <Number>, userId: {uuid}}
   * @param {Object} piggyback Piggyback instance
   * @param {Object} keep      Keep instance
   */
  function ShopPlan(shopplanId, piggyback, keep, data) {

    this.shopplanId   = shopplanId;
    this.suid         = shopplanId.suid;

    this._Piggyback   = piggyback;
    this._Keep        = keep;

    this.isNewPlan    = !shopplanId ? true : false;
    this.isInvitation = false;


    if(!this.isNewPlan && data) this.init(data);

    this._apis = {
      plan: {
        update:   'shopplan/' + this.suid + '/update',
        end:      'shopplan/' + this.suid + '/end',
        detail:   'shppplan/' + this.suid + '/detail',
        remove:   'shopplan/' + this.suid + '/remove',
        map: {
          locations: 'shopplan/' + this.suid + '/map/locations'
        }
      }
    };

  }


  // Public
  ShopPlan.prototype.init                 = init;
  ShopPlan.prototype.getDetailed          = getDetailed;

  // [TO DO] revisiting apis
  ShopPlan.prototype.addDestination       = addDestination;
  ShopPlan.prototype.removeDestionation   = removeDestionation;
  ShopPlan.prototype.updateDestination    = updateDestination;
  ShopPlan.prototype.getStoreLocations    = getStoreLocations;
  ShopPlan.prototype.getDestinations      = getDestinations;

  ShopPlan.prototype.addToInvitation      = addToInvitation;
  ShopPlan.prototype.removeFromInvitation = removeFromInvitation;

  ShopPlan.prototype.save                 = save;
  ShopPlan.prototype.end                  = end;

  // Private
  ShopPlan.prototype._create              = _create;
  ShopPlan.prototype._save                = _save;

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
    if('summary' in data) this.summary           = data.summary;
    if('friends' in data) this.friends           = data.friends;
    if('destinations' in data) this.destinations = data.destinations;
    if('isInvitation' in data) this.isInvitation = data.isInvitation;
  }


  /////////////////////// MAP RELATED /////////////////////////

  /**
   * Select a destination in the plan
   *
   * @param  {Object} dest Destination object containing LatLng and order
   */
  function addDestination(gpsLocation) {
    destination = {
      dtuid: _.now(),
      address: {
        gpsLoc: {
          lat: gpsLocation.lat,
          lng: gpsLocation.lng
        }
      }
    };

    this._Keep.push().thiz(destination).to('destinations');
  }


  /**
   * Remove destination location from the plan
   *
   * @param  {Object} dest  Destincation object with LatLng and order
   */
  function removeDestionation(duid) {
    this._Keep.remove().thiz(dest).from('destinationLocs');
  }


  /**
   * Get only latLng of the destinations
   * from both persisted and not yet persisted destinations.
   *
   * [TO DO] Include updating order
   *
   * @return {[type]} [description]
   */
  function updateDestination(duid, gpsLocation) {
    var destinations = [];
    destinations.concat(this._plan.destinationLocs);
    this._Keep.update().thiz(destinations).from('destinationLocs');
    return _.uniq(destinations);
  }


  /**
   * Get destinations with only their location
   * and order
   */
  function getDestinations() {
    var self = this;

    return this._Piggyback.GET(this._apis.plan.detail, {fields: ['destinations']})
      .then(function(resp) {
        if(resp.status === 200) self.destinationLocs = resp.data;
        return self;
      });
  }


  //////////////////// INVITES RELATED /////////////////////////

  /**
   * Add user to invite list
   *
   * @param {string} userId User Id
   */
  function addToInvitation(userId) {
    this._Keep.push().thiz(userId).to('invites');
  }

  /**
   * Remove user from invitation
   *
   * @return {Promise.<bool>} Promise of success
   */
  function removeFromInvitation(uuid) {
    var invites = [];
    this._Keep.update().thiz(invites).from('invites');
    invites.concat(this._plan.invites);
    return invites;
  }


  /**
   * Get the detailed version of this plan
   *
   * @return {Object} This ShopPlan instance with details
   */
  function getDetailed() {
    var self = this;

    return this.Piggyback.GET(this._apis.plan.detail)
      .then(function(resp) {
        if(resp.status === 200) {
          self.init(resp.data);
        }

        return self;
      });
  }


  /**
   * Save plan
   */
  function save() {
    if(this.isNewPlan) return this._create();
    else return this._save();
  }


  /**
   * End plan
   */
  function end() {
    this._Piggyback.queue('POST', this._apis.plan.end);
  }



  ///////////////////////////////////////////////////////////////////
  //////////////////////// Private Functions ////////////////////////
  ///////////////////////////////////////////////////////////////////


  function _create() {
    var self = this;
    var data = this._Keep.withinTxn().getUpdates();

    return this.Piggyback.POST(this._apis.plan.create, null, data)
      .then(function(resp) {
        if(resp.status === 200 && resp.data) {
          // resp.data is ShopPlan (thrift)
          self.isNewPlan  = false;
          self.shopplanId = resp.data;
          self.suid       = shopplanId.suid;

          self.init(resp.data);
          return true;
        } else return false;
      });
  }


  function _save() {

  }

}