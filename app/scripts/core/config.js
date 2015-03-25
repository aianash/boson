angular
  .module('boson.core')
  .provider('config', ConfigProvider)
  .config(configure);


function ConfigProvider() {

  this.$get = [config]

  function config() {
    return {
      appErrorPrefix: '[Boson App Error]',
      appTitle: 'ShopLane',
      version: '0.1.0'
    };
  }
}


configure.$inject = ['$ionicConfigProvider', '$stateProvider', '$urlRouterProvider', 'HiggsProvider'];

function configure($ionicConfigProvider, $stateProvider, $urlRouterProvider, HiggsProvider) {

  /** Configure higgs service provider */
  HiggsProvider.setHiggsPort(8080);
  HiggsProvider.setHiggsHost('http://localhost');
  HiggsProvider.setApiVersion('0.1.0');
  HiggsProvider.setAppSecret('pomodorotechnique');


  $ionicConfigProvider.tabs.position('bottom');

  $urlRouterProvider.otherwise('/listings');

  $stateProvider.state('boson', {
    abstract: true,
    templateUrl: 'core/main.html'
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
    templateUrl: 'listings/listings-index.html',
    controller: 'ListingsController'
  });


  $stateProvider.state('boson.listing.search', {
    url: '/search/:searchId',
    templateUrl: 'search/search-index.html',
    controller: 'SearchController'
  });



  $stateProvider.state('boson.map', {
    url: '/map',
    views: {
      map: {
        controller: 'MapController',
        templateUrl: 'map/map.html'
      }
    }
  });

  $stateProvider.state('boson.friends', {
    url: '/friends',
    views: {
      friends: {
        controller: 'FriendsController',
        templateUrl: 'friends/friends.html'
      }
    }
  });

  $stateProvider.state('boson.shoppingplan', {
    abstract: true,
    url: '/shoppingplan',
    views: {
      shoppingplan: {
        template: '<ion-nav-view></ion-nav-view>'
      }
    }
  });


  $stateProvider.state('boson.shoppingplan.index', {
    url: '',
    templateUrl: 'shoppingplan/shopping-plan-index.html',
    controller: 'ShoppingPlanController'
  });


  $stateProvider.state('boson.shoppingplan.detail', {
    url: '/detail/:planId',
    templateUrl: 'shoppingplan/shopping-plan-detail.html',
    controller: 'ShoppingPlanDetailController'
  });
}