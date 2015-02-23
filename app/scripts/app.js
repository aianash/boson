var boson =
  angular.module('boson',
    ['ionic',

     'controllers.listings',
     'controllers.friends',
     'controllers.map',
     'controllers.nearby',
     'controllers.plan',
     'controllers.query',
     'controllers.search',

     'directives.listings',
     'directives.query',
     'directives.search'
    ]
  );


boson.config(
  ['$ionicConfigProvider',
   '$stateProvider',
   '$urlRouterProvider',
function($ionicConfigProvider, $stateProvider, $urlRouterProvider) {
  $ionicConfigProvider.tabs.position('bottom');

  $urlRouterProvider.otherwise('/listings');

  $stateProvider.state('boson', {
    abstract: true,
    templateUrl: 'templates/main.html'
  });



  /** Listing Tab states and substates */

  $stateProvider.state('boson.listing', {
    abstract: true,
    url: '/listings',
    views: {
      listings: {
        template: '<ion-nav-view></ion-nav-view>'
      }
    }
  });

  $stateProvider.state('boson.listing.index', {
    url: '',
    templateUrl: 'templates/views/listings-index.html',
    controller: 'ListingsController'
  });


  $stateProvider.state('boson.listing.search', {
    url: '/search/:searchId',
    templateUrl: 'templates/views/search-index.html',
    controller: 'SearchController'
  });



  $stateProvider.state('boson.map', {
    url: '/map',
    views: {
      map: {
        controller: 'MapController',
        templateUrl: 'templates/views/map.html'
      }
    }
  });

  $stateProvider.state('boson.friends', {
    url: '/friends',
    views: {
      friends: {
        controller: 'FriendsController',
        templateUrl: 'templates/views/friends.html'
      }
    }
  });

  $stateProvider.state('boson.plan', {
    url: '/plan',
    views: {
      plan: {
        controller: 'PlanController',
        templateUrl: 'templates/views/plan.html'
      }
    }
  });


  /** STATES NOT YET DEVELOPED */
  // $stateProvider.state('boson.nearby', {
  //   url: '/nearby',
  //   views: {
  //     map: {
  //       template: 'templates/views/nearby.html'
  //     }
  //   }
  // });

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
