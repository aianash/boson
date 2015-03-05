angular
  .module('boson.widgets')
  .directive('bonHasSticky', bonHasSticky)
  .directive('bonIsSticky', bonIsSticky)

function bonHasSticky() {

  return {
    restrict: 'A',
    link: link
  };

  function link($scope, $elem, attrs) {
    var self = this;
    $scope.aggregate = $scope.aggregate || {};

    function checkAndNotify() {
      var minId = '';
      var minD = -999999;
      var found = false;
      angular.forEach($scope.aggregate, function(val, key) {
        if(!found)
          // If there is any element below the header
          // and within 80px then use that
          if(val.position > 0 && val.position < 80) {
            minId = key;
            found = true;

            // else choose the nearest one from all the
            // items above the header (ie with position negative)
          } else if(val.position < 0 && val.position > minD) {
            minId = key;
            minD = val.position;
          }
      });

      if(minId !== '') $scope.$emit('stickHeader', $scope.aggregate[minId]);
    }

    if(attrs.bonHasSticky === 'true') {
      $scope.$on('stickyPosition', function(event, elemPos) {
        $scope.aggregate[elemPos.item.id] = elemPos;
        checkAndNotify();
      });
    }
  }
}


function bonIsSticky() {

  return {
    restrict: 'A',
    link: link
  };

  function link($scope, $elem, attrs) {
    var container, $container, notifyElemPos;

    if(attrs.bonIsSticky === 'true') {

      var elem = $elem[0];
      var item = $scope.item;
      var limit = 80; // 44 + 71 / 2

      container = _findScrollableParent(elem);
      $container = angular.element(container);

      notifyElemPos = angular.bind({elem: elem, item: item}, _notifyElemPos);
      $container.on('scroll', notifyElemPos);

      $scope.$on('$destroy', onDestroy);

    }

    function onDestroy() {
      $container.off('scroll', notifyElemPos);
    }

    function _notifyElemPos(event) {
      var top = this.elem.getBoundingClientRect().top;
      $scope.$emit('stickyPosition', {elem: this.elem, position: top, item: this.item});
    }

    function _findScrollableParent(elem) {
      var parent = elem;
      while(parent && !parent.classList.contains('scroll-content')) {
        parent = parent.offsetParent;
      }
      return parent;
    }
  }
}