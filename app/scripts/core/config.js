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
   * Searach Views
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
    url: '/results',
    templateUrl: 'search/search-result-index.html',
    controller: 'SearchResultController',
    controllerAs: 'vm'
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
    controller: 'ShoppingPlanController',
    controllerAs: 'vm'
  });

  $stateProvider.state('boson.shopplan.detail', {
    url: '/detail/:planId',
    templateUrl: 'shopplan/shopplan-detail.html',
    controller: 'ShoppingPlanDetailController',
    controllerAs: 'vm'
  });

  $stateProvider.state('boson.shopplan.create', {
    url: '',
    templateUrl: 'shopplan/shopplan-create.html',
    controller: 'ShopPlanCreateController',
    controllerAs: 'vm'
  });

}




initializeFeed.$inject = ['Feed']

/**
 * Initializes the Feed by calling Feed.get
 *
 * [IMP] should return the Feed service
 */
function initializeFeed(Feed) {
  // [NOTE] To detect using location service
  Feed.get({city: 'bangalore', page: 0});
  return Feed;
}