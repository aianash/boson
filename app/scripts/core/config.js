angular
  .module('boson.core')
  .provider('config', ConfigProvider)
  .constant('$ionicLoadingConfig', {
    templateUrl: 'core/loading.html',
    noBackdrop: true
  }).config(configure);


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


configure.$inject = ['$ionicConfigProvider', '$stateProvider', '$urlRouterProvider', '$localForageProvider', 'HiggsProvider'];

function configure($ionicConfigProvider, $stateProvider, $urlRouterProvider, $localForageProvider, HiggsProvider) {

  /** Configure localforage */
  $localForageProvider.config({
    name        : 'boson-store',
    description : 'boson local storage for apps data'
  });

  /** Configure higgs service provider */
  HiggsProvider.setHiggsPort(8100);
  HiggsProvider.setHiggsHost('localhost');
  if(ionic.Platform.isAndroid()) {
    HiggsProvider.setHiggsPort(8080);
    HiggsProvider.setHiggsHost('higgs.goshoplane.com');
  }
  HiggsProvider.setApiVersion('1');
  HiggsProvider.setClientId('boson-app');


  // $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.views.transition('none');
  $ionicConfigProvider.scrolling.jsScrolling(true);
  $ionicConfigProvider.views.maxCache(0);

  $urlRouterProvider.otherwise('/login');

  $stateProvider.state('boson', {
    abstract: true,
    template: '<ion-nav-view></ion-nav-view>'
  });


  /**
   * Login View
   */

  $stateProvider.state('boson.login', {
    url: '/login',
    templateUrl: 'login/login-index.html',
    controller: 'LoginController as login'
  });

  // Registering a new user should be a different step
  // which includes adding friends and other informations


  /**
   * Feed Views
   */

  $stateProvider.state('boson.feed', {
    url: '/feed',
    templateUrl: 'feed/feed-index.html',
    controller: 'FeedController as feed',
    resolve: {
      initFeed: initializeFeed
    }
  });


  /**
   * Search Views
   */

  $stateProvider.state('boson.search', {
    abstract: true,
    url: '/search',
    template: '<ion-nav-view name="fabContent"></ion-nav-view><ion-nav-view name="mainContent"></ion-nav-view>'
  });

  $stateProvider.state('boson.search.result', {
    url: '/results/:sruid',
    views: {
      'mainContent': {
        templateUrl: 'search/search-result-index.html',
        controller: 'SearchResultController as src',
        resolve: {
          initSearcher: initSearcher
        }
      },
      'fabContent': {
        template: '<button id="show-map" ng-click="goToShopPlanCreate()" class="spin button button-fab button-fab-bottom-right show-map"><i class="icon ion-ios-location"></i></button>',
        controller: function ($scope, $timeout, $state, $ionicHistory) {
          $scope.goToShopPlanCreate = function() {
            $ionicHistory.nextViewOptions({
              disableAnimate: true
            });
            $state.go('boson.shopplan.createmap');
          }

          $timeout(function () {
            document.getElementById('show-map').classList.toggle('on');
          }, 500);
        }
      }
    }
  });


  /**
   * ShopPlan Views
   */
  $stateProvider.state('boson.shopplan', {
    abstract: true,
    url: '/shopplan',
    // template: '<ion-nav-view ></ion-nav-view>'
    template: '<ion-nav-view name="fabContent"></ion-nav-view><ion-nav-view name="mainContent"></ion-nav-view>'
  });

  $stateProvider.state('boson.shopplan.index', {
    url: '',
    templateUrl: 'shopplan/shopplan-index.html',
    controller: 'ShopPlanListController as vm',
    resolve: {
      initShopPlan: initShopPlan
    }
  });

  $stateProvider.state('boson.shopplan.detail', {
    url: '/detail/:planId',
    templateUrl: 'shopplan/shopplan-detail.html',
    controller: 'ShopPlanDetailController as detail',
    resolve: {
      initShopPlan: initShopPlanDetail
    }
  });

  $stateProvider.state('boson.shopplan.createmap', {
    url: '/createmap',
    views: {
      'mainContent' : {
        templateUrl: 'shopplan/map-destinations.html',
        controller: 'ChooseDestinationsController as map',
        resolve: {
          initShopPlanner: withBucketStores
        }
      }
    }
  });

}




initializeFeed.$inject = ['Feed'];

function initializeFeed(Feed) {
  return Feed;
  // [TO DO] To detect city using location service
  return Feed.get({city: 'bangalore', page: 0})
    .then(function(){ return Feed; });
}



initShopPlan.$inject = ['ShopPlan'];

function initShopPlan(ShopPlan) {
  return ShopPlan.all()
    .then(function(){ return ShopPlan; });
}


initShopPlanDetail.$inject = ['$stateParams', 'ShopPlan'];

function initShopPlanDetail($stateParams, ShopPlan) {
  return ShopPlan.get($stateParams.planId)
    .then(function() { return ShopPlan; });
}


initSearcher.$inject = ['$stateParams', '$ionicLoading', 'Searcher'];

function initSearcher($stateParams, $ionicLoading, Searcher) {
  return Searcher.getResults($stateParams.sruid)
    .then(function() {
      $ionicLoading.hide();
      return Searcher;
    });
}


initShopPlanner.$inject = ['ShopPlanner'];

function initShopPlanner(ShopPlanner) {
  return ShopPlanner;
}


withShopPlans.$inject = ['initShopPlanner'];

function withShopPlans(ShopPlanner) {
  return ShopPlanner.initShopPlans();
}


withBucketStores.$inject = ['$ionicLoading', 'lodash', 'ShopPlanner'];

function withBucketStores($ionicLoading, _, ShopPlanner) {
  $ionicLoading.show({delay: 200});

  return ShopPlanner.getBucketStores()
    .then(function() {
      $ionicLoading.hide();
      return ShopPlanner;
    });
}


withFriends.$inject = ['initShopPlanner'];

function withFriends(ShopPlanner) {
  return ShopPlanner.initFriends();
}