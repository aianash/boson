var boson = angular.module('boson', ['ionic', '_search', '_query', '_listings'])




boson.config(['$ionicConfigProvider', function($ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
}]);


boson.controller('BosonController', ['$scope', function($scope) {


}]);


// MOVE controllers
boson.controller('PlacesController', ['$scope', function($scope) {


}]);

boson.controller('FriendsController', ['$scope', function($scope) {

}]);

boson.controller('NearbyController', ['$scope', function($scope) {

}]);

boson.controller('PlanController', ['$scope', function($scope) {

}]);

boson.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
