angular
  .module('boson.core')
  .controller('NavBarController', NavBarController)

NavBarController.$inject = [
  '$state',
  '$ionicSideMenuDelegate',
  'Higgs'
];

function NavBarController(
  $state,
  $ionicSideMenuDelegate,
  Higgs
) {

  var vm = this;

  vm.goToFeed       = goToFeed;
  vm.goToSearch     = goToSearch;
  vm.goToShopPlans  = goToShopPlans;
  vm.toggleSideMenu = toggleSideMenu;

  //////////////////////////////////////
  // ViewModel functions used in view //
  //////////////////////////////////////

  function goToFeed() {
    $state.go('boson.home.feed');
  }

  function goToSearch() {
    $state.go('boson.home.search');
  }

  function goToShopPlans() {
    $state.go('boson.shopplan.index');
  }

  function toggleSideMenu() {
    $ionicSideMenuDelegate.$getByHandle("user").toggleRight();
  }

}