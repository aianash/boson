angular
  .module('boson.feed')
  .controller('FeedController', FeedController);


FeedController.$inject = [
  'lodash',
  '$scope',
  '$state',
  '$ionicLoading',
  '$ionicModal',
  '$cordovaSplashscreen',
  '$ionicSideMenuDelegate',
  'storeTypeIcon',
  'Higgs',
  'initFeed'
];



/**
 * Controller for Feed's view
 *
 * [NOTE] Its still work in progress
 */
function FeedController(
  _,
  $scope,
  $state,
  $ionicLoading,
  $ionicModal,
  $cordovaSplashscreen,
  $ionicSideMenuDelegate,
  storeTypeIcon,
  Higgs,
  Feed) {

  $ionicModal.fromTemplateUrl('search/search-query.modal.html', {
    scope: $scope,
    animation: 'appear',
    focusFirstInput: true,
    hardwareBackButtonClose: false
  }).then(function(modal) {
    $scope.searchModal = modal;
  });

  $scope.$on('$destroy', function() {
    $scope.searchModal.remove();
  });

  var vm = this;

  vm.user = Higgs.getUserInfo();
  vm.selectedStores = {};

  var actionsAltEl = document.getElementById('feed-actions-alt');
  var actionsEl    = document.getElementById('feed-actions');
  var feedPageEl   = document.getElementById('feed-page');

  var alt = false;
  var lastScrollPos;
  var lastTime;

  function isSpeedScroll(current) {
    var speed = Math.abs(current - lastScrollPos);
    var direction = current > lastScrollPos ? 'DOWN' : 'UP';
    lastScrollPos = current;
    lastTime = _.now();
    if(speed > 10) return direction;
    else return 'NOPE';
  }

  function nearTop(pos) {
    return Math.abs(pos) < 10;
  }

  feedPageEl.addEventListener('scroll', function() {
    var top = actionsEl.getBoundingClientRect().top;
    if((top < 0 && !alt) || (isSpeedScroll(top) === 'UP' && nearTop(top))) {
      actionsEl.style.opacity = '0'; //.classList.add('not-visible');
      actionsAltEl.style.opacity = '0.6';

      actionsEl.style.visibility = 'hidden'; //.classList.add('not-visible');
      actionsAltEl.style.visibility = 'visible'; // actionsAltEl.classList.remove('not-visible');
      alt = true;
    } else if(top > 0 && alt || (isSpeedScroll(top) === 'DOWN' && nearTop(top))) {
      actionsEl.style.opacity = '0.6';
      actionsAltEl.style.opacity = '0';

      actionsEl.style.visibility = 'visible';
      actionsAltEl.style.visibility = 'hidden';
      alt = false;
    }
  }, false);

  // [NOTE] Currently showing posterAds and offers
  // as separate components
  vm.ads    = Feed.posterAds;
  vm.offers = Feed.offers;

  // Move this logic
  setTimeout(function() {
    $cordovaSplashscreen.hide();
  }, 2000);

  setTimeout(function(){
    $ionicSideMenuDelegate.$getByHandle('user').canDragContent(false);
  }, 500);



  //////////////////////////////////////
  // ViewModel functions used in view //
  //////////////////////////////////////

  vm.goToSearch   = goToSearch;

  function goToSearch() {
    $scope.searchModal.show();
  }


  ////////////////////////////////////////////
  //////////// Helper methods ////////////////
  ////////////////////////////////////////////


  function _selectStore(storeId) {
    Higgs.addStoreToBucketList(storeId);
    $scope.selectedStores[storeId] = true;
  }

  function _deselectStore(storeId) {
    Higgs.removeStoreFromBucketList(storeId);
    $scope.selectedStores[storeId] = false;
  }

}