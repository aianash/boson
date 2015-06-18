angular
  .module('boson.core')
  .controller('SideMenuController', SideMenuController)

SideMenuController.$inject = [
  '$rootScope',
  '$timeout',
  '$ionicActionSheet',
  'Higgs'
];

function SideMenuController(
  $rootScope,
  $timeout,
  $ionicActionSheet,
  Higgs
) {

  var vm = this;

  vm.userInfo = {};

  var listener = $rootScope.$on('user:loggedIn', function(event) {
    Higgs.getUserInfo()
         .then(_updateUserInfo, _showError("Error while updating user info"));
  });

  //////////////////////////////////////
  // ViewModel functions used in view //
  //////////////////////////////////////

  function _updateUserInfo(info) {
    vm.userInfo = info;
    listener();
  }

  function _showError(msg) {
    return function onError(error) {
      console.error("Error while " + msg + " = [" + JSON.stringify(error) + "]");
      var hideError = $ionicActionSheet.show({
        titleText: msg
      });
      $timeout(function() {
        hideError()
      }, 2000);
    };
  }
}