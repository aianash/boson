angular
  .module('boson.search')
  .controller('SearchResultController', SearchResultController);

SearchResultController.$inject = [
  'lodash',
  '$scope',
  '$state',
  '$compile',
  '$sce',
  '$ionicHistory',
  '$ionicLoading',
  '$ionicModal',
  'storeTypeIcon',
  'ionicMaterialInk',
  'initSearcher'
];

function SearchResultController(
  _,
  $scope,
  $state,
  $compile,
  $sce,
  $ionicHistory,
  $ionicLoading,
  $ionicModal,
  storeTypeIcon,
  ionicMaterialInk,
  Searcher) {

  $ionicModal.fromTemplateUrl('search/search-query.modal.html', {
    scope: $scope,
    animation: 'appear',
    focusFirstInput: true,
    hardwareBackButtonClose: false
  }).then(function(modal) {
    $scope.searchModal = modal;
  });

  $scope.$on('$destroy', function() {
    $scope.searchModal.remove();
  });

  var vm = this;

  vm.searchId = Searcher.sruid;
  vm.items    = _.flatten(_.map(Searcher.result, function(store) {
    return store.items;
  }));
  vm.page     = Searcher.page;

  vm.selectedItems  = {}; // items currently selected fro bucket list
  vm.selectedStores = {}; // stores currently selected for bucket list
  vm.noMoreResult   = false;

  vm.itemHeight = window.innerWidth * 480 / 640 + 100;

  ///////////////////////
  // ViewModel methods //
  ///////////////////////

  vm.isItemSelected     = isItemSelected;
  vm.toggleItem         = toggleItem;
  vm.isStoreSelected    = isStoreSelected;
  vm.toggleStore        = toggleStore;
  vm.hasMoreResults     = hasMoreResults;
  vm.loadMoreResults    = loadMoreResults;
  vm.storeIcon          = storeTypeIcon;
  vm.goBack             = goBack;
  vm.goHome             = goHome;
  vm.openSearch         = openSearch;

  vm.toString = function(obj) {
    return JSON.stringify(obj, null, 2);
  }

  _init();

  ionicMaterialInk.displayEffect();


  /////////////////////////////////////
  // ViewModel method implementation //
  /////////////////////////////////////

  function isItemSelected(item) {
    if(item) return vm.selectedItems[itemIdKey(item.itemId)] === true;
    else return false;
  }

  function toggleItem(item) {
    if(vm.isItemSelected(item)) _deselectItem(item.itemId)
    else _selectItem(item.itemId);
  }

  function isStoreSelected(storeId) {
    return vm.selectedStores[storeIdKey(storeId)] > 0; // covers the case of undefined too;
  }

  function toggleStore(storeId) {
    if(vm.isStoreSelected(storeId)) _deselectStore(storeId);
    else _selectStore(storeId);
  }

  // Infinite scroll related functions
  function hasMoreResults() {
    return !vm.noMoreResult;
  }

  function loadMoreResults() {
    Searcher.nextResults(vm.searchId. vm.page + 1)
      .then(function() {

          if(Searcher.result.length === vm.result.length)
            vm.noMoreResult = true;
          else {
            // Searcher updates new results in its
            // member variables
            vm.searchId = Searcher.sruid;
            vm.result   = Searcher.result;
            vm.page     = Searcher.page;
          }

      });
  }


  /////////////////////
  // Private methods //
  /////////////////////

  // init of the controller
  function _init() {
    $ionicLoading.hide();

    _initStickyHeader();
  }


  // [IMP][TO DO] Need heavy optimization
  function _initStickyHeader() {
    var fakeHeader = angular.element(document.querySelector('div.fake-header'));

    $scope.$on('stickHeader', function(event, elemPos) {
      var _elem = angular.element(elemPos.elem);
      vm.item = elemPos.item;
      fakeHeader.html($sce.getTrustedHtml($sce.trustAsHtml(_elem.html())));
      $compile(fakeHeader.contents())($scope);
      $scope.$digest();
    });
  }

  // Make sure you dont selec the whole store
  function _selectItem(itemId) {
    Searcher.addItemToBucket(itemId);
    vm.selectedItems[itemIdKey(itemId)] = true;
    vm.selectedStores[storeIdKey(itemId.storeId)] = (vm.selectedStores[storeIdKey(itemId.storeId)] || 0) + 1;
  }

  function _deselectItem(itemId) {
    Searcher.removeItemFromBucket(itemId);
    vm.selectedItems[itemIdKey(itemId)] = false;
    vm.selectedStores[storeIdKey(itemId.storeId)] = vm.selectedStores[storeIdKey(itemId.storeId)] - 1;
  }

  function _selectStore(storeId) {
    Searcher.addStoreToBucket(storeId);
    vm.selectedStores[storeIdKey(storeId)] = 1;
  }

  function _deselectStore(storeId) {
    Searcher.removeStoreFromBucket(storeId);
    vm.selectedStores[storeIdKey(storeId)] = 0;
  }

  function itemIdKey(itemId) {
    return itemId.storeId.stuid + "-" + itemId.cuid;
  }

  function storeIdKey(storeId) {
    return storeId.stuid;
  }

  function goBack() {
    $ionicHistory.goBack();
  }

  function goHome() {
    $state.go('boson.feed');
  }

  function openSearch() {
    $scope.searchModal.show();
  }

}