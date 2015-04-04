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

    this._Piggyback   = piggyback;
    this._Keep        = keep;

    this.isNewPlan    = !shopplanId ? true : false;
    this.isInvitation = false;


    if(!this.isNewPlan && data) this.init(data);

    this.suid = shopplanId.suid;

    // Setup Higgs apis used here
    // there should be some config of higgs
    // for this
    this._apis = {
      plan: {
        update:   'shopplan/' + this._plan.id + '/update',
        end:      'shopplan/' + this._plan.id + '/end',
        detail:   'shppplan/' + this._plan.id + '/detail',
        remove:   'shopplan/' + this._plan.id + '/remove',
        map: {
          locations: 'shopplan/' + this._plan.id + '/map/locations'
        }
      }
    };

  }

  // Public
  ShopPlan.prototype.init                 = init;

  // [TO DO] revisiting apis
  ShopPlan.prototype.getMapLocations      = getMapLocations;
  ShopPlan.prototype.selectDestinationLoc = selectDestinationLoc;
  ShopPlan.prototype.removeDestinationLoc = removeDestinationLoc;
  ShopPlan.prototype.getDestinationLocs   = getDestinationLocs;

  ShopPlan.prototype.addUserForInvite     = addUserForInvite;
  ShopPlan.prototype.getScheduledInvites  = getScheduledInvites;

  ShopPlan.prototype.getDetail            = getDetail;

  ShopPlan.prototype.save                 = save;

  ShopPlan.prototype.end                  = end;


  // Private
  ShopPlan.prototype._planRemovals = _planRemovals;
  ShopPlan.prototype._planUpdates  = _planUpdates;
  ShopPlan.prototype._onPlanUpdate = _onPlanUpdate;
  ShopPlan.prototype._create       = _create;
  ShopPlan.prototype._save         = _save;
  ShopPlan.prototype._setSummary   = _setSummary;
  ShopPlan.prototype._setDetails   = _setDetails;

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


  /**
   * Get map locations of stores in the
   * current plan.
   *
   * [IMP][TO DO] Important change coming up
   *
   * @return {Array.<Object>} Array of locations{lat: number, lng: number, score: number}
   */
  function getMapLocations() {
    var self = this;

    // If there has been recent addition in stores
    // then use api reqest
    // else fetch from _plan.locations
    if(this._Keep.has().any('stores'))
      return this._Piggyback.GET(this._apis.plan.map.locations)
                 .then(function(resp){
                    if(resp.status ===  200 && (typeof resp.data === 'array')) {
                      self._plan.locations = resp.data;
                      return self._plan.locations;
                    } else throw new Error('Some internal error');
                 });
    else $q.when(this._plan.locations);
  }


  /**
   * Select a destination in the plan
   *
   * @param  {Object} dest Destination object containing LatLng and order
   */
  function selectDestinationLoc(dest) {
    this._Keep.push().thiz(dest).to('destinationLocs');
  }


  /**
   * Remove destination location from the plan
   *
   * @param  {Object} dest  Destincation object with LatLng and order
   */
  function removeDestinationLoc(dest) {
    this._Keep.remove().thiz(dest).from('destinationLocs');
  }


  /**
   * Get only latLng of the destinations
   * from both persisted and not yet persisted destinations.
   *
   * @return {[type]} [description]
   */
  function getDestinationLocs() {
    var destinations = [];
    destinations.concat(this._plan.destinationLocs);
    this._Keep.update().thiz(destinations).from('destinationLocs');
    return _.uniq(destinations);
  }


  /**
   * Add user to invite list
   *
   * @param {string} userId User Id
   */
  function addUserForInvite(userId) {
    this._Keep.push().thiz(userId).to('invites');
  }


  /**
   * Remove user from invite list;
   *
   * @param  {string} userId User's id
   */
  function removeUserFromInvites(userId) {
    this._Keep.remove().thiz(userId).from('invites');
  }


  /**
   * Get scheduled invites
   * @return {[type]} [description]
   */
  function getScheduledInvites() {
    var invites = [];
    this._Keep.update().thiz(invites).from('invites');
    invites.concat(this._plan.invites);
    return invites;
  }


  /**
   * Get full plan detail
   *
   * @return {Object} Plan detail object
   */
  function getDetail() {
    var self = this;
    if(this._Keep.has().any() || this._plan.higgsVersion !== this._plan.version) {
      return this._Piggyback.GET(this._apis.plan.detail)
                 .then(function(resp) {
                    if(resp.status === 200) {
                      if(typeof resp.data.destinations !== 'undefined')
                        resp.data.destinations
                    }
                 })
    } else return this._plan;
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


  /**
   * Source of removal related updates to the plan
   *
   * @return {Object} Piggyback object
   */
  function _planRemovals() {
    var deferred = $q.defer();
    deferred.promise.then(this._onPlanUpdate);

    return {
      method: 'POST',
      api: this._apis.plan.remove,
      data: this._Keep.withinTxn().getRemovals(),
      deferred: deferred
    };
  }


  /**
   * Source for lazy plan update requests
   *
   * This mainly contains following data stores in Keep
   * - **destinations** - Array.<Object> - Array of destinations
   * - **invites** - Array.<string> - userId for invites
   *
   * @return {Object} Piggyback object
   */
  function _planUpdates() {
    var deferred = $q.defer();
    deferred.promise.then(this._onPlanUpdate);

    return {
      method: 'POST',
      api: this._apis.plan.update,
      data: this._Keep.withinTxn().getUpdates(),
      deferred: deferred
    };
  }


  /**
   * Response returned by the last update.
   * The server should return back the _keep_txn_id
   * that was passed in the request
   *
   * @param  {Object} res Plan update response
   */
  function _onPlanUpdate(res) {
    if(resp.status === 200) {
      var keepTxnId = resp.data._keep_txn_id;
      this._plan.higgsVersion = resp.data.plan_version;

      // Update transation data to this._plan data
      this._Keep.txn(keepTxnId).update().thiz(this._plan.invites).from('invites');
      this._Keep.txn(keepTxnId).update().thiz(this._plan.destinationLocs).from('destinationLocs');
      this._Keep.txn(keepTxnId).done(); // mark transaction as done
    }
  }


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