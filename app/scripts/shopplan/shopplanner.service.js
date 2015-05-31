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
    ShopPlanner.prototype.getBucketStores         = getBucketStores;
    ShopPlanner.prototype.createNewPlan           = createNewPlan;

    ShopPlanner.prototype.getExistingStoreLocs    = getExistingStoreLocs;
    ShopPlanner.prototype.getExistingDestinations = getExistingDestinations;
    ShopPlanner.prototype.addDestination          = addDestination;
    ShopPlanner.prototype.removeDestination       = removeDestination;
    ShopPlanner.prototype.updateDestination       = updateDestination;

    ShopPlanner.prototype.getExistingInvites      = getExistingInvites;
    ShopPlanner.prototype.addToInvitation         = addToInvitation;
    ShopPlanner.prototype.removeFromInvitation    = removeFromInvitation;

    ShopPlanner.prototype.savePlan                = savePlan;

    return ShopPlanner;

    ///////////////////////////////////////////////////
    /////////////// Public functions //////////////////
    ///////////////////////////////////////////////////


    /**
     * Get bucket stores to show on map
     *
     * @return {Promise.<Object>}   Bucket stores
     */
    function getBucketStores() {
      var self = this;

      return Higgs.getBucketStores()
        .then(function(stores) { self.bucketStores = stores; return stores; });
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
     * @param  {Number} suid ShopPlan unique id
     * @return {Promise.<bool>} Promize of boolean (success)
     */
    function chooseExistingShopPlan(suid) {
      var self = this;

      return Higgs.getShopPlan(suid)
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

    function getExistingInvites() {
      return this._planT.getInvites();
    }

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
      var self = this;

      return Higgs.savePlan(this._planT)
        .then(function(success) {
          if(success) self._planT = void 0;
          return success;
        });
    }

  })();

  return new _ShopPlanner();
}