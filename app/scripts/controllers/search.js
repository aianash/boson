_search = angular.module('controller.search', []);

_search.controller('SearchController',
	['$scope',
   '$ionicLoading',
   '$timeout',
   '$ionicModal',
   'service.search',
function($scope, $ionicLoading, $timeout, $ionicModal, SearchService) {

  $scope.showResults = false;
  $scope.brandId = 'InstaShopper';

  $scope.$on('stickHeader', function(event, brandId) {
    console.log(brandId);
    $scope.brandId = brandId;
    $scope.$digest();
  });

  $ionicModal.fromTemplateUrl('query-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.queryModal = modal;
  });

  $scope.brandIdPresent = function() {
    return $scope.brandId != null && typeof $scope.brandId != 'undefined';
  }

  $scope.$on('search', function(event, query) {
    $ionicLoading.show({template: 'Fetching...'});

    SearchService.search(query).then(function(result) {
      $scope.showResults = true;
      $scope.$broadcast('showResults', result);
      $ionicLoading.hide();
      $scope.queryModal.hide();
    });

  });


  $scope.closeSearch = function() {
    $scope.queryModal.hide();
  };

  $scope.showSearch = function() {
    $scope.queryModal.show();
  };

}]);