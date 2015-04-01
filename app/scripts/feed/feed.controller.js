angular
  .module('boson.feed')
  .controller('FeedController', FeedController);


FeedController.$inject = [
  '$scope',
  '$cordovaSplashscreen',
  '$ionicSideMenuDelegate',
  'storeTypeIcon',
  'Higgs',
  'initFeed'
];



/**
 * Controller for Feed's view
 *
 * [NOTE] Its still work in progress
 */
function FeedController(
  $scope,
  $cordovaSplashscreen,
  $ionicSideMenuDelegate,
  storeTypeIcon,
  Higgs,
  Feed) {

  var vm = this;

  vm.user = Higgs.getUserInfo();
  vm.selectedStores = {};

  // [NOTE] Currently showing posterAds and offers
  // as separate components
  vm.ads    = Feed.posterAds;
  vm.offers = Feed.offers;


  // Move this logic
  setTimeout(function() {
    $cordovaSplashscreen.hide();
  }, 5000);


  setTimeout(function(){
    $ionicSideMenuDelegate.$getByHandle('user').canDragContent(false);
  }, 500);



  //////////////////////////////////////
  // ViewModel functions used in view //
  //////////////////////////////////////

  vm.toggleSideMenu   = toggleSideMenu;
  vm.login            = login;

  vm.isStoreSelected  = isStoreSelected;
  vm.toggleStore      = toggleStore;
  vm.offerIcon        = storeTypeIcon;

  vm.moreContent      = moreContent;
  vm.loadMoreData     = loadMoreData

  vm.openSearch       = openSearch;



  function toggleSideMenu() {
    $ionicSideMenuDelegate.$getByHandle('user').toggleRight();
  }

  function login() {
    // [TO DO] After a separate login view is implemented
  }

  function isStoreSelected(storeId) {
    return vm.selectedStores[storeId] == true;
  }

  function toggleStore(storeId) {
    if(vm.isStoreSelected(storeId)) _deselectStore(storeId)
    else _selectStore(storeId);
  }


  // Infinite scroll related functions
  function moreContent() {
    return true;
  };


  function loadMoreData() {
    Feed.next().then(function(feed) {
      updateFeed();
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  }


  function openSearch() {
    // to do
  }


  ////////////////////////////////////////////
  //////////// Helper methods ////////////////
  ////////////////////////////////////////////


  function _selectStore(storeId) {
    Higgs.addStoreToBucketList(storeId);
    $scope.selectedStores[storeId] = true;
  }

  function _deselectStore(storeId) {
    Higgs.removeStoreFromBucketList(storeId);
    $scope.selectedStores[storeId] = false;
  }

}