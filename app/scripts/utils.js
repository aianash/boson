var _utils = angular.module('utils', []);

_utils.factory('randomId64', function() {
	return function() {
		return Math.random().toString(36).substr(2); // [FIX] less than 16 bit
	};
});

_utils.factory('storeTypeIcon', function() {
	return function(type) {
		switch(type) {
      case 'apparels':
        return 'ion-tshirt-outline'
      case 'store':
        return 'ion-bag'
    };
	}
});