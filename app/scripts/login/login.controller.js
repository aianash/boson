angular
  .module('boson.login')
  .controller('LoginController', LoginController)

LoginController.$inject = [
  '$state',
  '$ionicActionSheet',
  '$timeout',
  '$cordovaSplashscreen',
  'Higgs'
];


function LoginController(
  $state,
  $ionicActionSheet,
  $timeout,
  $cordovaSplashscreen,
  Higgs
) {

  $timeout(function() {
    if(Higgs._isLoggedIn) skip();
    $cordovaSplashscreen.hide();
  }, 1000);

  var vm = this;

  //////////////////////////////////////
  // ViewModel functions used in view //
  //////////////////////////////////////

  vm.loginUsingFacebook = loginUsingFacebook;
  vm.loginUsingGPlus    = loginUsingGPlus;
  vm.register           = register;
  vm.login              = login;
  vm.skip               = skip;


  function loginUsingFacebook() {
    Higgs.loginUsingFacebook()
         .then(_goToFeed, _showError('Facebook Login Failed.'))
  }

  function loginUsingGPlus() {
    _showError("Login using google plus not yet implemented")()
  }

  function register() {
    _showError("Register using email/password not yet implemented")()
  }

  function login() {
    _showError("Login using email/password not yet implemented")()
  }

  function skip() {
    $state.go('boson.feed.index');
  }

  function _goToFeed(success) {
    if(success) $state.go('boson.feed.index');
  }

  function _showError(msg) {
    return function onError(error) {
      console.error("Error while login = [" + JSON.stringify(error) + "]");
      var hideError = $ionicActionSheet.show({
        titleText: msg
      });
      $timeout(function() {
        hideError()
      }, 2000);
    };
  }

}