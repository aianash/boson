var _higgs = angular.module('services.higgs',
  ['utils',
   'services.dummy']);



function StoreCartProvider() {

  var storeCartId = void 0;

  this.setStoreCartId = function(id) {
    storeCartId = id;
  }

  this.$get = ['randomId64',
    function(randomId64) {
      var _StoreCart;

      /**
       * StoreCart stores data for selected
       * stores and their collection.
       *
       * It maintains a Diff table for persisting
       * only diff to Higgs service
       */
      _StoreCart = (function() {

        function StoreCart(id) { /** constructor */
          this.cartId = id || randomId64();
          this.operations = [];
        }


        StoreCart.prototype.selectStore = function(storeId) {
          this.operations.push('A:' + storeId);
        };

        StoreCart.prototype.deselectStore = function(storeId) {
          this.operations.push('D:' + storeId);
        };

        StoreCart.prototype.selectItem = function(itemId, storeId) {
          this.operations.push('A:' + (storeId || '') + '.' + itemId);
        };

        StoreCart.prototype.deselectItem = function(itemId, storeId) {
          this.operations.push('D:' + (storeId || '') + '.' + itemId);
        };


        /**
         * returns diff data structure
         * for lazy persistence
         */
        StoreCart.prototype.getDiff = function() {
          return this.operations;
        };

        StoreCart.prototype.diffPersisted = function() {

        };

        return StoreCart;
      })();

      return new _StoreCart(storeCartId);
    }];
};





function HiggsProvider() {

  var apiVersion = '0.0.1';

  this.apiVersion = function(version) {
    apiVersion = version;
  };


  this.$get = ['$q', 'storeCart', 'DummyData',
    function($q, storeCart, DummyData) {
      var _Higgs;

      /**
       * Client for Higgs (backend) APIs
       * Built-in lazy persistence of store cart
       */
      _Higgs = (function() {

        function Higgs(apiVersion) { /** constructor */
          this.apiVersion = apiVersion;
        };


        /** === Higgs APIs [On-going development] === */


        /** == Listing APIs */
        Higgs.prototype.getListings = function() {
          return $q.when(DummyData.listings);
        };

        Higgs.prototype.fetchMore = function() {
          return $q.when(DummyData.listings);
        };

        Higgs.prototype.hasMoreListings = function () {
          return false;
        };

        Higgs.prototype.selectStore = function(storeId) {
          storeCart.selectStore(storeId);
        };

        Higgs.prototype.deselectStore = function(storeId) {
          storeCart.deselectStore(storeId);
        };

        Higgs.prototype.selectItem = function(itemId, storeId) {
          storeCart.selectItem(itemId, storeId);
        };

        Higgs.prototype.deselectItem = function(itemId, storeId) {
          storeCart.deselectItem(itemId, storeId);
        };


        /** == Store Cart APIs == */

        Higgs.prototype.addStore = function(store) {

        };

        Higgs.prototype.addCollectionToStore = function(collection, storeId) {

        };


        /** == Map APIs == */
        Higgs.prototype.getStoreLocations = function() {
          return $q.when(DummyData.storeLocations);
        };

        Higgs.prototype.setDestination = function(index, dest) {
          // To implement
        };


        /** == Friends API */
        Higgs.prototype.getNearbyFriends = function() {
          return $q.when(DummyData.nearbyFriends);
        };

        Higgs.prototype.addUserToInviteList = function(userId) {
          // To implement
        };

        Higgs.prototype.removeUserFromInviteList = function(userId) {
          // To implement
        };

        return Higgs;

      })();

      return new _Higgs(apiVersion);
    }];
}




_higgs.provider('storeCart', StoreCartProvider);
_higgs.provider('higgs', HiggsProvider);