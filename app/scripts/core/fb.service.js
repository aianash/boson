angular
  .module('boson.core')
  .provider('FB', FBProvider);


function FBProvider() {

  this.$get = ['$q', '$cordovaFacebook', FBFactory];

  function FBFactory($q, $cordovaFacebook) {
    var _FB;

    _FB = (function() {
      function FB() {}

      FB.prototype.login = function() {
        return $cordovaFacebook.login(['public_profile', 'email', 'user_friends'])
      };

      FB.prototype.getAccessToken = function() {
        return $cordovaFacebook.getAccessToken();
      };


      FB.prototype.getUser = function() {
        return $cordovaFacebook.api('me', ['public_profile'])
      };

      return FB;
    })();

    return new _FB();
  }

};
