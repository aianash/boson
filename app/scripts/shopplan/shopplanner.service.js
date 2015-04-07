angular
  .module('boson.shopplan')
  .factory('ShopPlanner', ShopPlannerFactory);


ShopPlannerFactory.$inject = [
  '$q',
  'lodash',
  '$state',
  'Higgs'
];

function ShopPlannerFactory($q, _, $state, Higgs) {

  var _ShopPlanner;

  _ShopPlanner = (function() {

    function ShopPlanner() {
      this._creatingNewPlan = false;

      // Target plan plan that is
      // chosen to update/create
      //
      // This instance will be directly
      // used to perform CRUD operation
      // in very create plan step.
      this._planT;

      // These variables are updated
      // before a view is created
      this.shopplans;
      this.bucketStores;
      this.friends;
    }

    // Public
    ShopPlanner.prototype.initShopPlans                = initShopPlans;
    ShopPlanner.prototype.initStoreLocationsFromBucket = initStoreLocationsFromBucket;
    ShopPlanner.prototype.initFriends                  = initFriends;

    ShopPlanner.prototype.ensurePlanSelected           = ensurePlanSelected;
    ShopPlanner.prototype.chooseExistingShopPlan       = chooseExistingShopPlan;
    ShopPlanner.prototype.createNewPlan                = createNewPlan;

    ShopPlanner.prototype.getExistingStoreLocs         = getExistingStoreLocs;
    ShopPlanner.prototype.getExistingDestinations      = getExistingDestinations;
    ShopPlanner.prototype.addDestination               = addDestination;
    ShopPlanner.prototype.removeDestination           = removeDestination;
    ShopPlanner.prototype.updateDestination            = updateDestination;

    ShopPlanner.prototype.addToInvitation              = addToInvitation;
    ShopPlanner.prototype.removeFromInvitation         = removeFromInvitation;

    ShopPlanner.prototype.savePlan                     = savePlan;

    return ShopPlanner;

    ///////////////////////////////////////////////////
    /////////////// Public functions //////////////////
    ///////////////////////////////////////////////////


    ///////////////////// INITS ///////////////////////

    // Get list of shop plans (with summary)
    function initShopPlans() {
      var self = this;

      return Higgs.getShopPlans()
        .then(function(plans) { self.shopplans = plans; return self;});
    }

    // Get lcoations for store in bucket to show on map
    //
    // [TO DO] Bucket should be filtered from a
    // particulary city or area as defined from
    // selected shop plan
    function initStoreLocationsFromBucket() {
      var self = this;

      return Higgs.getBucketStoreLocations()
        .then(function(storeLocs) { self.bucketStoreLocs = storeLocs; return self;});
    }

    // Get friends to invite; already invited ones
    // for an existing plan will be fetched later
    //
    // [TO DO] Friends should be filtered based on
    // location
    function initFriends() {
      var self = this;

      return Higgs.getFriendsForInvite()
        .then(function(friends) { self.friends = friends; return self; });
    }


    ///////////////////// CHOOSING PLANS ////////////////////////

    /**
     * Function that ensure that plan is
     * selected in boson.shopplan.create.plans ui
     *
     * if not go to plan selection view.
     */
    function ensurePlanSelected() {
      if(!this._planT) $state.go('boson.shopplan.create.plans');
    }

    /**
     * Choose an existing plan to update with
     * new data
     *
     * @param  {Number} planId Plan id
     * @return {Promise.<bool>} Promize of boolean (success)
     */
    function chooseExistingShopPlan(planId) {
      var self = this;

      return Higgs.getShopPlan(planId)
        .then(function(plan) { self._planT = plan; return true; });
    }

    /**
     * Set a new core.shopplan object to create new plan
     * with new data
     *
     * @return {Promise.<bool>} Promise of boolean (success)
     */
    function createNewPlan() {
      var self = this;

      return Higgs.getNewShopPlan()
        .then(function(plan) { self._planT = plan; return true; });
    }



    ////////////////////////// CHOOSING DESTINATIONS /////////////////////////

    function getExistingStoreLocs() {
      return this._planT.isNewPlan ? $q.when([]) : this._planT.getStoreLocations();
    }

    function getExistingDestinations() {
      return this._planT.isNewPlan ? $q.when([]) : this._planT.getDestinations();
    }

    function addDestination(gpsLocation) {
      return this._planT.addDestination(gpsLocation);
    }

    function removeDestination(dtuid) {
      return this._planT.removeDestionation(dtuid);
    }

    function updateDestination(dtuid, gpsLocation) {
      return this._planT.updateDestination(dtuid, gpsLocation);
    }


    //////////////////////////// INVITING FRIENDS //////////////////////////////

    function addToInvitation(uuid) {
      return this._planT.addToInvitation(uuid);
    }

    function removeFromInvitation(uuid) {
      return this._planT.removeFromInvitation(uuid);
    }


    //////////////////////////// SAVING PLAN //////////////////////////////

    // Save the the target plan
    // and remove the target plan selection
    function savePlan() {
      return Higgs.savePlan(this._planT)
        .then(function(success) {
          if(success) self._planT = void 0;
          return success;
        });
    }


    ///////////////////////////////////////////////////
    /////////////// Private functions /////////////////
    ///////////////////////////////////////////////////

    function _setPlanId(planId) {
      this._planId = planId;
    }

    function _setDestinations(destinations) {
      this.destinations = destinations;
      return this;
    }

    function _setFriends(friends) {
      this.friends = friends;
      return this;
    }

  })();

  return new _ShopPlanner();
}