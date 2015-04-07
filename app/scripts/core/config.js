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

  $urlRouterProvider.otherwise('/feed');

  $stateProvider.state('boson', {
    abstract: true,
    templateUrl: 'core/main.html'
  });



  /**
   * Feed Views
   */

  $stateProvider.state('boson.feed', {
    abstract: true,
    url: '/feed',
    template: '<ion-nav-view></ion-nav-view>'
  });

  $stateProvider.state('boson.feed.index', {
    url: '',
    templateUrl: 'feed/feed-index.html',
    controller: 'FeedController',
    controllerAs: 'vm',
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
    template: '<ion-nav-view></ion-nav-view>'
  });

  $stateProvider.state('boson.search.query', {
    url: '',
    templateUrl: 'search/query-index.html',
    controller: 'QueryController',
    controllerAs: 'vm'
  });

  $stateProvider.state('boson.search.result', {
    url: '/results/:searchId',
    templateUrl: 'search/search-result-index.html',
    controller: 'SearchResultController',
    controllerAs: 'vm',
    resolve: {
      initSearcher: initSearcher
    }
  })


  /**
   * ShopPlan Views
   */
  $stateProvider.state('boson.shopplan', {
    abstract: true,
    url: '/shopplan',
    template: '<ion-nav-view></ion-nav-view>'
  });

  $stateProvider.state('boson.shopplan.index', {
    url: '',
    templateUrl: 'shopplan/shopplan-index.html',
    controller: 'ShopPlanListController',
    controllerAs: 'vm',
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

  $stateProvider.state('boson.shopplan.create', {
    abstract: true,
    url: '/create',
    templateUrl: 'shopplan/shopplan-create.html',
    controller: 'ShopPlanCreateController as creator',
    resolve: {
      initShopPlanner: initShopPlanner
    }
  });

  $stateProvider.state('boson.shopplan.create.plans', {
    url: '/plans',
    templateUrl: 'shopplan/choose-plans.html',
    controller: 'ChoosePlansController as plans',
    resolve: {
      initShopPlanner: withShopPlans
    }
  });


  $stateProvider.state('boson.shopplan.create.map', {
    url: '/map',
    templateUrl: 'shopplan/map-destinations.html',
    controller: 'ChooseDestinationsController as map',
    resolve: {
      initShopPlanner: withMapLocations
    }
  });

  $stateProvider.state('boson.shopplan.create.invite', {
    url: '/friends',
    templateUrl: 'shopplan/invite-friends.html',
    controller: 'InviteFriendsController as invite',
    resolve: {
      initShopPlanner: withFriends
    }
  });

  $stateProvider.state('boson.shopplan.create.preview', {
    url: '/preview',
    templateUrl: 'shopplan/preview-plan.html',
    controller: 'PreviewPlanController as preview',
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


initSearcher.$inject = ['$stateParams', 'Searcher'];

function initSearcher($stateParams, Searcher) {
  return Searcher.getResults($stateParams.searchId)
    .then(function() { return Searcher; });
}


initShopPlanner.$inject = ['ShopPlanner'];

function initShopPlanner(ShopPlanner) {
  return ShopPlanner;
}


withShopPlans.$inject = ['initShopPlanner'];

function withShopPlans(ShopPlanner) {
  return ShopPlanner.initShopPlans();
}


withMapLocations.$inject = ['lodash', 'initShopPlanner'];

function withMapLocations(_, ShopPlanner) {
  return ShopPlanner.initStoreLocationsFromBucket();
}


withFriends.$inject = ['initShopPlanner'];

function withFriends(ShopPlanner) {
  return ShopPlanner.initFriends();
}