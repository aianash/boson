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
      // used to perfirm CRUD operation
      // in very create plan step.
      this._planT;

      // These variables are updated
      // before a view is created
      this.shopplans;
      this.stores;
      this.friends;
    }

    // Public
    ShopPlanner.prototype.initShopPlans           = initShopPlans;
    ShopPlanner.prototype.initStoreLocations      = initStoreLocations;
    ShopPlanner.prototype.initDestinations        = initDestinations;
    ShopPlanner.prototype.initFriends             = initFriends;

    ShopPlanner.prototype.ensurePlanSelected      = ensurePlanSelected;
    ShopPlanner.prototype.chooseExistingShopPlan  = chooseExistingShopPlan;
    ShopPlanner.prototype.createNewPlan           = createNewPlan;

    ShopPlanner.prototype.addDestination          = addDestination;
    ShopPlanner.prototype.removeDestionation      = removeDestionation;
    ShopPlanner.prototype.updateDestination       = updateDestination;

    ShopPlanner.prototype.addToInvitation         = addToInvitation;
    ShopPlanner.prototype.removeFromInvitation    = removeFromInvitation;

    ShopPlanner.prototype.savePlan                = savePlan;

    // Private
    ShopPlanner.prototype._setPlanId              = _setPlanId;
    ShopPlanner.prototype._setStoreLocations      = _setStoreLocations;
    ShopPlanner.prototype._setDestinations        = _setDestinations;
    ShopPlanner.prototype._setShopPlans           = _setShopPlans;
    ShopPlanner.prototype._setFriends             = _setFriends;

    return ShopPlanner;

    ///////////////////////////////////////////////////
    /////////////// Public functions //////////////////
    ///////////////////////////////////////////////////

    ///////////////////// INITS ///////////////////////

    function initShopPlans() {
      return $q.when([])
        .then(_.bind(this._setShopPlans, this));
    }

    function initStoreLocations() {
      return $q.when({})
        .then(_.bind(this._setStoreLocations, this));
    }

    function initDestinations() {
      if(!!this._creatingNewPlan) return $q.when(true);
      else return $q.when({}) // get existeing destinations
            .then(_.bind(this._setDestinations, this));
    }

    function initFriends() {
      return $q.when({})
        .then(_.bind(this._setFriends, this));
    }



    /**
     * Function that ensure that plan is
     * selected in boson.shopplan.create.plans ui
     *
     * ifnot goes to that view.
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




    function addDestination(location, order) {
      return $q.when({destId: _.now(), location: location, order: order});
    }

    function removeDestionation(destId) {
      return $q.when(destId);
    }

    function updateDestination(destId, location, order) {
      return $q.when({destId: destId, location: location, order: order});
    }

    function addToInvitation(userId) {}

    function removeFromInvitation(userId) {}


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


    function _setShopPlans(plans) {
      this.shopplans = plans;
      return this;
    }

    function _setStoreLocations(stores) {
      this.stores = stores;
      return this;
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