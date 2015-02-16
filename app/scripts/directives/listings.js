var _listings = angular.module('directives.listings', []);

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
    }

    function _elementWithinBound() {
      if(Math.abs(this.elem.getBoundingClientRect().top) < 50) {
        $scope.$emit('stickHeader', this.item.brand);
      }
    }

    function _findScrollableParent(elem) {
      var parent = elem;
      while(parent && !parent.classList.contains('scroll-content')) {
        parent = parent.offsetParent;
      }
      return parent;
    }
  }

  return {
    restrict: 'A',
    link: link
  };
});
