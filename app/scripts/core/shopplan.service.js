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
    var keep = KeepFactory.create(shopplanId.suid);
    return new ShopPlan(shopplanId, piggyback, keep, data);
  }

  this.createNew = function() {
    var keep = KeepFactory.create('new-plan');
    return new ShopPlan();
  }
}


/** Closure over dependencies */
function _ShopPlan(_, $q) {

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
   * @param {Number} shopplanId {suid: <Number>, createdBy: {uuid}}
   * @param {Object} piggyback Piggyback instance
   * @param {Object} keep      Keep instance
   */
  function ShopPlan(shopplanId, piggyback, keep, data) {

    this.shopplanId   = shopplanId;
    this.suid         = shopplanId.suid;

    this._Piggyback   = piggyback;

    // Keep is used to store add, update and delete for
    // destinations and invites
    // where
    // - destinations - Array.<Destination>
    // - invites      - Array.<Friend>
    this._Keep        = keep;

    this.isNewPlan    = !shopplanId ? true : false;
    this.isInvitation = false;


    if(!this.isNewPlan && data) this.init(data);

    // [IMP] [NOTE] To revise after higgs api finalization
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

  ShopPlan.prototype.addDestination       = addDestination;
  ShopPlan.prototype.removeDestionation   = removeDestionation;
  ShopPlan.prototype.updateDestination    = updateDestination;
  ShopPlan.prototype.getStoreLocations    = getStoreLocations;
  ShopPlan.prototype.getDestinations      = getDestinations;

  ShopPlan.prototype.getInvites           = getInvites;
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
    if('dstores' in data) this.dstores           = data.dstores;
    if('invites' in data) this.invites           = data.invites;
    if('destinations' in data) this.destinations = data.destinations;
    if('isInvitation' in data) this.isInvitation = data.isInvitation;
  }


  /////////////////////// MAP RELATED /////////////////////////

  /**
   * Select a destination in the plan
   *
   * @param  {Object} gpsLocation {lat: <Double>, lng: <Double> }
   * @return {Promise.<Destionation>} Destination object thus created
   */
  function addDestination(gpsLocation) {
    var destination = {
      dtuid: _.now(),
      address: {
        gpsLoc: {
          lat: gpsLocation.lat,
          lng: gpsLocation.lng
        }
      }
    };

    return this._Keep.push().thiz(destination).to('destinations');
  }


  /**
   * Remove destination location from the plan
   *
   * @param  {Object} dest  Destincation object with LatLng and order
   * @return {Promise.<Number>} Promise of destination unique id
   */
  function removeDestionation(dtuid) {
    return $q.when(this._Keep.remove().thiz('dtuid', dtuid}).from('destinations').dtuid);
  }


  /**
   * Update gps location of the destination
   *
   * @param {Number} dtuid Destination unique id
   * @param {Object} gpsLocation {lat: <Double>, lng: <Double> }
   * @return {Promise.<Destination>} Promise of new Destination
   */
  function updateDestination(dtuid, gpsLocation) {
    var destination = {
      dtuid: dtuid,
      address: {
        gpsLoc: {
          lat: gpsLocation.lat,
          lng: gpsLocation.lng
        }
      }
    };

    return $q.when(this._Keep.update().thiz(destination).where('dtuid', dtuid).to('destinations'));
  }


  /**
   * Get locations of stores in the plan
   *
   * @return {Promise.<Array.<DStore>>} [description]
   */
  function getStoreLocations() {
    var self = this;

    return this._Piggyback.GET(this._apis.plan.detail, {fields: ['dstores']})
      .then(function(resp) {
        if(resp.status === 200) self.init(resp.data);
        return self.dstores;
      });
  }


  /**
   * Get destinations of a shopplan
   *
   * [IMP][TO DO] Update what's fetched from server using the local
   * additions or updates
   *
   * @return {Promise.<Array} [description]
   */
  function getDestinations() {
    var self = this;

    return this._Piggyback.GET(this._apis.plan.detail, {fields: ['destinations']})
      .then(function(resp) {
        if(resp.status === 200) self.init(resp.data);
        return self.destinations;
      });
  }


  //////////////////// INVITES RELATED /////////////////////////

  function getInvites() {
    var self = this;

    return this._Piggyback.GET(this._apis.plan.invites)
      .then(function(resp) {
        if(resp.status === 200) self.init(resp.data);
        return self.invites;
      });
  }

  /**
   * Add user to invite list
   *
   * @param {Number} uuid User unique id
   */
  function addToInvitation(uuid) {
    var friend = {uuid: uuid}

    return $q.when(this._Keep.push().thiz(friend).to('invites'));
  }

  /**
   * Remove user from invitation
   *
   * @param {Number} uuid user unique id
   * @return {Promise.<bool>} Promise of success
   */
  function removeFromInvitation(uuid) {
    return $q.when(this._Keep.remove().thiz('uuid', uuid).from('invites'));
  }


  ////////////////////// OTHERS /////////////////////////////

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
   * [TO DO]
   */
  function end() {
    // this._Piggyback.POST('POST', this._apis.plan.end);
  }



  ///////////////////////////////////////////////////////////////////
  //////////////////////// Private Functions ////////////////////////
  ///////////////////////////////////////////////////////////////////


  function _create() {
    var self = this;
    var data = this._Keep.withinTxn().getCRUDS();

    return this.Piggyback.POST(this._apis.plan.create, null, data)
      .then(function(resp) {
        if(resp.status === 200 && resp.data) {
          // resp.data is ShopPlan (thrift)
          self.isNewPlan  = false;
          self.shopplanId = resp.data.shopplanId;
          self.suid       = shopplanId.suid;

          self.init(resp.data);
          return true;
        } else return false;
      });
  }


  function _save() {
    var self = this;
    var data = this._Keep.withinTxn().getCRUDS();

    return this._Piggyback.POST(this._apis.plan.crud, null, data)
      .then(function(resp) {
        if(resp.status === 200 && resp.data) {
          self.init(resp.data); // return summary atleast

          return true;
        } else return false;
      });
  }

}