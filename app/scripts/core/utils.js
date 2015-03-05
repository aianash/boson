angular
  .module('boson.core')
  .factory('randomId64', randomId64)
  .factory('storeTypeIcon', storeTypeIcon)



function randomId64() {
  return function() {
    return Math.random().toString(36).substr(2); // [FIX] less than 16 bit
  };
}

function storeTypeIcon() {
  return function(type) {
    switch(type) {
      case 'apparels':
        return 'ion-tshirt-outline'
      case 'store':
        return 'ion-bag'
    };
  }
}