'use strict'

angular
  .module('boson.listings')
  .controller('ListingsController', ListingsController);


ListingsController.$inject = [
  '$scope',
  '$cordovaSplashscreen',
  '$cordovaFacebook',
  '$ionicSideMenuDelegate',
  'storeTypeIcon',
  'QueryModal',
  'ListingsService',
  'Higgs'
];

function ListingsController(
  $scope,
  $cordovaSplashscreen,
  $cordovaFacebook,
  $ionicSideMenuDelegate,
  storeTypeIcon,
  QueryModal,
  ListingsService, Higgs) {

  $scope.user = {
    img: 'http://imageshack.com/a/img661/3717/dMwcZr.jpg'
  };

  setTimeout(function() {
    $cordovaSplashscreen.hide();
  }, 5000);

  setTimeout(function(){
    $ionicSideMenuDelegate.$getByHandle('user').canDragContent(false);
  }, 500);

  $scope.toggleSideMenu = toggleSideMenu
  $scope.loginFacebook  = loginFacebook

  $scope.offers = [];

  // Fetch default listing
  ListingsService.fetchListings().then(function(listings) {
    $scope.ads = listings.ads;
    $scope.offers = listings.offers;
  });



  $scope.selectedStores = {};

  function selectStore(storeId) {
    ListingsService.selectStore(storeId);
    $scope.selectedStores[storeId] = true;
  }

  function deselectStore(storeId) {
    ListingsService.deselectStore(storeId);
    $scope.selectedStores[storeId] = false;
  }



  $scope.isStoreSelected = function(storeId) {
    return $scope.selectedStores[storeId] == true;
  }

  $scope.toggleStore = function(storeId) {
    if($scope.isStoreSelected(storeId)) deselectStore(storeId)
    else selectStore(storeId);
  }

  $scope.openSearch = QueryModal.show;

  $scope.offerIcon = function(type) {
    return storeTypeIcon(type);
  };

  // Infinite scroll related functions
  $scope.moreContent = function() {
    return ListingsService.hasMoreListings()
  };


  $scope.loadMoreData = function() {
    ListingsService.fetchMore().then(function(offers) {
      $scope.offers = $scope.offers.concat(offers);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  }


  ///////////////////////////////////////////////

  function toggleSideMenu() {
    $ionicSideMenuDelegate.$getByHandle('user').toggleRight();
  }

  function loginFacebook() {
    $cordovaFacebook.login(['public_profile', 'email', 'user_friends'])
      .then(function(success) {
        console.log(success.authResponse.userID);
        console.log(success.authResponse.accessToken);
        console.debug(JSON.stringify(success));

        $cordovaFacebook.api('me', ["public_profile"])
          .then(function(res){
              console.debug(JSON.stringify(res));
            }, function(err) {
              console.log(err);
          }).then(function() {
            return $cordovaFacebook.api('me/picture?redirect=false&type=normal', ['public_profile'])
          }).then(function(success) {
              $scope.user.img = success.data.url;
              console.log(JSON.stringify(success));
            }, function(err) {
              console.log(err);
          });


      }, function(err) {
        console.debug(err);
      });
  }
}