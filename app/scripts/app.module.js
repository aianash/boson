angular.module('boson', [

  /**
   * Access to all
   */
  'boson.core',
  'boson.widgets',

  /**
   * Feature areas
   */
  'boson.login',
  'boson.feed',
  'boson.search',
  'boson.shopplan'
]);



// boson.run(function($ionicPlatform, $cordovaSplashscreen) {
//   $ionicPlatform.ready(function() {
//     // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//     // for form inputs)

//     setTimeout(function(){
//       $cordovaSplashscreen.hide();
//     }, 5000);

//     if(window.cordova && window.cordova.plugins.Keyboard) {
//       cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//     }
//     if(window.StatusBar) {
//       StatusBar.styleDefault();
//     }
//   });
// });
