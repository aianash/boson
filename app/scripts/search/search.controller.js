angular
  .module('boson.search')
  .controller('SearchController', SearchController);

SearchController.$inject = [
  '$scope',
  '$compile',
  '$sce',
  '$state',
  '$stateParams',
  '$ionicLoading',
  '$timeout',
  '$ionicModal',
  'storeTypeIcon',
  'QueryModal',
  'SearchService'
];

function SearchController(
  $scope,
  $compile,
  $sce,
  $state,
  $stateParams,
  $ionicLoading,
  $timeout,
  $ionicModal,
  storeTypeIcon,
  QueryModal,
  SearchService) {

  $scope.searchId = $stateParams.searchId;
  $scope.items = [];

  var fakeHeader = angular.element(document.querySelector('div.fake-header'));

  function processResult(items) {
    $scope.items = $scope.items.concat(items);
  };

  // Fetch results for the view
  QueryModal.hide();
  $ionicLoading.show({template: 'Fetching results...'});

  SearchService.search($scope.searchId).then(function(items) {
    processResult(items);
    $ionicLoading.hide();
  });

  $scope.$on('stickHeader', function(event, elemPos) {
    var _elem = angular.element(elemPos.elem);
    $scope.item = elemPos.item;
    fakeHeader.html($sce.getTrustedHtml($sce.trustAsHtml(_elem.html())));
    $compile(fakeHeader.contents())($scope);
    $scope.$digest();
  });


  /** Item selection functions */

  $scope.selectedItems = {};

  // Make sure you dont selec the whole store
  function selectItem(itemId, storeId) {
    SearchService.selectItem(itemId, storeId);
    $scope.selectedItems[itemId] = true;
    $scope.selectedStores[storeId] = ($scope.selectedStores[storeId] || 0) + 1;
  }

  function deselectItem(itemId, storeId) {
    SearchService.deselectItem(itemId, storeId);
    $scope.selectedItems[itemId] = false;
    $scope.selectedStores[storeId] = $scope.selectedStores[storeId] - 1;
  }

  $scope.isItemSelected = function(itemId) {
    return $scope.selectedItems[itemId] == true;
  };

  $scope.toggleItem = function(itemId, storeId) {
    if($scope.isItemSelected(itemId)) deselectItem(itemId, storeId)
    else selectItem(itemId, storeId);
  };


  /** Store selection functions */

  $scope.selectedStores = {};

  function selectStore(storeId) {
    SearchService.selectStore(storeId);
    $scope.selectedStores[storeId] = 1;
  }

  function deselectStore(storeId) {
    SearchService.deselectStore(storeId);
    $scope.selectedStores[storeId] = 0;
  }

  $scope.isStoreSelected = function(storeId) {
    return $scope.selectedStores[storeId] > 0; // covers the case of undefined too;
  };

  $scope.toggleStore = function(storeId) {
    if($scope.isStoreSelected(storeId)) deselectStore(storeId);
    else selectStore(storeId);
    return true;
  };

  // Infinite scroll related functions
  $scope.hasMoreResults = function() {
    return SearchService.hasMoreResults();
  };

  $scope.loadMoreResults = function() {
    SearchService.nextResults($scope.searchId).then(function(results) {
      processResult(results);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.isStoreInfo = function(type) {
    return type == 'storeInfo';
  };

  $scope.isResultEntry = function(type) {
    return type == 'resultEntry';
  };

  $scope.openSearch = QueryModal.show;
  $scope.storeIcon = storeTypeIcon;

}