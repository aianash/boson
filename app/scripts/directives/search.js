var _search = angular.module('directives.search', []);


_search.directive('hasSticky', function() {

	function link($scope, $elem, attrs) {
		var self = this;
		$scope.aggregate = $scope.aggregate || {};

		function checkAndNotify() {
			var minId = 0;
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
					}
			});

			$scope.$emit('stickHeader', $scope.aggregate[minId].elem);
		}

		if(attrs.hasSticky === 'true') {
			$scope.$on('stickyPosition', function(event, elemPos) {
				$scope.aggregate[elemPos.id] = elemPos;
				checkAndNotify();
			});
		}
	}

	return {
		restrict: 'A',
		link: link
	}
});


_search.directive('isSticky', function() {

	function link($scope, $elem, attrs) {
		if(attrs.isSticky === 'true') {
			var container, $container, notifyElemPos;

	    var elem = $elem[0];
	    var item = $scope.item;
	    var limit = 80; // 44 + 71 / 2

	    container = _findScrollableParent(elem);
	    $container = angular.element(container);

	    notifyElemPos = angular.bind({elem: elem, item: item}, _notifyElemPos);
	    $container.on('scroll', notifyElemPos);

	    $scope.$on('$destroy', onDestroy);

	    function onDestroy() {
	      $container.off('scroll', notifyElemPos);
	    }

	    function _notifyElemPos(event) {
	    	var top = this.elem.getBoundingClientRect().top;
	    	$scope.$emit('stickyPosition', {elem: this.elem, position: top, id: this.elem.id});
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

	return {
		restrict: 'A',
		link: link
	};
});