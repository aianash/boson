angular
  .module('boson.search')
  .controller('SearchResultController', SearchResultController);

SearchResultController.$inject = [
  '$scope',
  '$compile',
  '$sce',
  '$ionicLoading',
  'storeTypeIcon',
  'initSearcher'
];

function SearchResultController(
  $scope,
  $compile,
  $sce,
  $ionicLoading,
  storeTypeIcon,
  Searcher) {

  var vm = this;

  vm.searchId = Searcher.sruid;
  vm.result   = Searcher.result;
  vm.page     = Searcher.page;

  vm.selectedItems  = {}; // items currently selected fro bucket list
  vm.selectedStores = {}; // stores currently selected for bucket list
  vm.noMoreResult   = false;

  ///////////////////////
  // ViewModel methods //
  ///////////////////////

  vm.isItemSelected = isItemSelected;
  vm.toggleItem     = toggleItem;
  vm.isStoreSelected= isStoreSelected;
  vm.toggleStore    = toggleStore;
  vm.hasMoreResults = hasMoreResults;
  vm.loadMoreResults= loadMoreResults;
  vm.storeIcon      = storeTypeIcon;
  vm.isStoreInfo    = isStoreInfo;
  vm.isResultEntry  = isResultEntry;

  _init();


  /////////////////////////////////////
  // ViewModel method implementation //
  /////////////////////////////////////

  function isItemSelected(itemId) {
    return vm.selectedItems[itemId] == true;
  }

  function toggleItem(itemId, storeId) {
    if(vm.isItemSelected(itemId)) _deselectItem(itemId, storeId)
    else _selectItem(itemId, storeId);
  }

  function isStoreSelected(storeId) {
    return vm.selectedStores[storeId] > 0; // covers the case of undefined too;
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

  function isStoreInfo(type) {
    return type == 'storeInfo';
  }

  function isResultEntry(type) {
    return type == 'resultEntry';
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
  function _selectItem(itemId, storeId) {
    Searcher.addItemToBucket(itemId, storeId);
    vm.selectedItems[itemId] = true;
    vm.selectedStores[storeId] = (vm.selectedStores[storeId] || 0) + 1;
  }

  function _deselectItem(itemId, storeId) {
    Searcher.removeItemFromBucket(itemId, storeId);
    vm.selectedItems[itemId] = false;
    vm.selectedStores[storeId] = vm.selectedStores[storeId] - 1;
  }

  function _selectStore(storeId) {
    Searcher.addStoreToBucket(storeId);
    vm.selectedStores[storeId] = 1;
  }

  function _deselectStore(storeId) {
    Searcher.removeStoreFromBucket(storeId);
    vm.selectedStores[storeId] = 0;
  }

}