_listings = angular.module('_listings', ['_search']);


/**
 * Items Controller
 *
 * @param  {Array}  $scope) {             $scope.items [description]
 * @return {[type]}         [description]
 */
_listings.controller('ListingsController',
                    ['$scope',
                     'fetchMore',
                     function($scope, fetchMore) {

  $scope.items = [];
  $scope.searchId = '';

  $scope.selectedItems = {};

  function selectItem(id) {
    $scope.selectedItems[id] = true;
  };

  function deselectItem(id) {
    $scope.selectedItems[id] = false;
  };

  $scope.isListing = function(type) {
    return type === 'listing';
  }

  $scope.noContent = ($scope.searchId === '');
  $scope.$watch('searchId', function(nV, oV) {
    $scope.noContent = nV === '';
  })

  // Fetch default listing
  if($scope.noContent) {
    fetchMore('asdfasdf').then(function(items) {
      $scope.items = items;
    });
  }

  $scope.itemSelected = function(id) {
    if($scope.isItemSelected(id)) deselectItem(id)
    else selectItem(id);
  };

  $scope.isItemSelected = function(id) {
    return $scope.selectedItems[id] == true;
  };



  // Infinite scroll functionality for both
  // default and search listing
  $scope.moreContent = function() {
    return !$scope.noContent;
  };

  $scope.loadMoreData = function() {
    fetchMore($scope.searchId).then(function(items) {
      $scope.items = $scope.items.concat(items);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.$on('showResults', function(event, result) {
    $scope.items = result.items;
    $scope.searchId = result.searchId;
  });

  $scope.$on('reset', function() {
    $scope.items = [];
    $scope.searchId = '';
  });

}]);




_listings.directive('listingsStickyHeader', function() {

  function link($scope, $elem, attrs) {
    var container, $container, elementWithinBound;

    var elem = $elem[0];
    var item = $scope.item;

    container = _findScrollableParent(elem);
    $container = angular.element(container);

    elementWithinBound = angular.bind({elem: elem, item: item}, _elementWithinBound);
    $container.on('scroll', elementWithinBound);
    $scope.$on('$destroy', onDestroy);

    function onDestroy() {
      $container.off('scroll', elementWithinBound);
    };

    function _elementWithinBound() {
      if(Math.abs(this.elem.getBoundingClientRect().top) < 50) {
        $scope.$emit('stickHeader', this.item.brand);
        // console.log(this.item.id + "\t" + this.elem.getBoundingClientRect().top);
      }
    }

    function _findScrollableParent(elem) {
      var parent = elem;
      while(parent && !parent.classList.contains('scroll-content')) {
        parent = parent.offsetParent;
      }
      return parent;
    }
  };

  return {
    restrict: 'A',
    link: link
  };
});
