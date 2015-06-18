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
      // This variable is updated
      // before a view is created
      this.bucketStores;
    }

    // Public
    ShopPlanner.prototype.getBucketStores = getBucketStores;
    ShopPlanner.prototype.createNewPlan   = createNewPlan;

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

    /**
     * Create new plan with CUD object
     *
     * @return {Promise.<bool>} Promise with shopplanid
     */
    function createNewPlan(cud) {
      return Higgs.createNewPlan(cud)
    }

  })();

  return new _ShopPlanner();
}