angular
  .module('boson.login')
  .controller('LoginController', LoginController)

LoginController.$inject = [
  '$state',
  '$ionicHistory',
  '$ionicActionSheet',
  '$timeout',
  '$cordovaSplashscreen',
  'Higgs'
];


function LoginController(
  $state,
  $ionicHistory,
  $ionicActionSheet,
  $timeout,
  $cordovaSplashscreen,
  Higgs
) {

  $timeout(function() {
    if(Higgs._isLoggedIn) skip();
    else $cordovaSplashscreen.hide();
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
         .then(_goToFeed, _showError('Facebook login failed. Please try again.'))
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
    $ionicHistory.nextViewOptions({
      disableBack: true,
      historyRoot: true
    });
    $state.go('boson.feed');
  }

  function _goToFeed(success) {
    if(success) $state.go('boson.feed');
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