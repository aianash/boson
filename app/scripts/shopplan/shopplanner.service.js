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

      // These variables are updated
      // before a view is created
      this._planId;
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

    ShopPlanner.prototype.updatePlan              = updatePlan;

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

    function ensurePlanSelected() {
      if(!this._creatingNewPlan && !this._planId)
        $state.go('boson.shopplan.create.plans');
    }

    function chooseExistingShopPlan(planId) {
      var self = this;

      return $q.when(true) // [TO DO] higgs api call
        .then(function(success){ self._setPlanId(planId); return success; });
    }

    function createNewPlan() {
      var self = this;

      return $q.when(_.now()) // [TO DO] Open a create plan ui
        .then(function(){ self._creatingNewPlan = true; return true; });
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


    function updatePlan() {
      // create a new plan with the data
      // or update the existing plan
      return $q.when(true);
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