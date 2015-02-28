var _plan = angular.module('controllers.shoppingplan',
  ['services.shoppingplan',
   'directives.imageLazyLoad']); // temp loader will be optimized

_plan.controller('ShoppingPlanController',
  ['$scope',
   '$state',
   '$ionicPopup',
   '$ionicPlatform',
   'ShoppingPlanService',
function($scope, $state, $ionicPopup, $ionicPlatform, ShoppingPlanService) {

  ShoppingPlanService.getPlans().then(function (plans) {
    $scope.shoppingPlans = plans;
  });

  $scope.hasPlan = function (){
    return !!$scope.shoppingPlans;
  };

  $scope.showPlan = function(planId) {
    $state.go('boson.shoppingplan.detail', {planId: planId});
  };

  $scope.setDate = function(idx) {
    var plan = $scope.shoppingPlans.myPlans[idx];
    var id = plan.id;

    // Temp Solution for date picker.
    $scope.temp = {date: new Date(plan.date)};

    var datePopup = $ionicPopup.show({
      template: '<input type="date" ng-model="temp.date">',
      title: 'Set Shopping Plan\'s date',
      scope: $scope,
      buttons: [
        {text: 'Cancel'},
        {
          text: '<b>Done</b>',
          type: 'button-positive',
          onTap: function(e) {
            return $scope.temp.date
          }
        }
      ]
    });

    datePopup.then(function(res) {
      plan.date = (new Date(res)).getTime();
      ShoppingPlanService.changePlanDate(id, plan.date);
    });
  };

  $scope.editShoppingPlan = function(idx) {
    var plan = $scope.shoppingPlans.myPlans[idx];
    var id = plan.id;

    $scope.temp = {title: plan.title};

    var titlePopup = $ionicPopup.show({
      template: '<input type="text" ng-model="temp.title">',
      title: 'Set Shopping Plan\'s title',
      scope: $scope,
      buttons: [
        {text: 'Cancel'},
        {
          text: '<b>Done</b>',
          type: 'button-positive',
          onTap: function(e) {
            return $scope.temp.title
          }
        }
      ]
    });

    titlePopup.then(function(res) {
      plan.title = res;
      ShoppingPlanService.changePlanTitle(id, plan.title);
    });
  };

}]);



_plan.controller('ShoppingPlanDetailController',
  ['$scope',
   '$stateParams',
   '$ionicPopup',
   '$anchorScroll',
   '$location',
   'ShoppingPlanService',
function($scope, $stateParams, $ionicPopup, $anchorScroll, $location, ShoppingPlanService) {

  $scope.planId = $stateParams.planId;

	var showingStoreId;

  ShoppingPlanService.getPlan($scope.planId).then(function(plan) {
    $scope.plan = plan;
    currentDestIdx = 0;
    showingStoreId = plan.destinations[currentDestIdx].stores[0].id;
  });

  $scope.hasPlan = function() {
  	return !!$scope.plan;
  };

  $scope.isCollapsed = function(id) {
  	return (showingStoreId && showingStoreId === id);
  };

  $scope.showStore = function(id) {
  	showingStoreId = id;
  };

  function moveToDestByIdx(idx) {
    idx = Math.abs(idx) % $scope.plan.destinations.length;
    var newHash = 'dest' + ($scope.plan.destinations[idx].id);

    var target = document.getElementById(newHash);
    target.scrollIntoView(true);
  }

  $scope.prevDestination = function() {
    currentDestIdx -= 1;
    moveToDestByIdx(currentDestIdx);
  };

  $scope.nextDestination = function() {
    currentDestIdx += 1;
    moveToDestByIdx(currentDestIdx);
  };

  $scope.askToMarkShoppingPlan = function($event){
  	var confirmPopup = $ionicPopup.confirm({
  		title: 'Confirm',
  		template: 'Are you sure you want to close the current plan ?'
  	});

  	confirmPopup.then(function(res) {
  		if(res) {
  			ShoppingPlanService.closePlan($scope.plan.id).then(function() {
  				$scope.plan = void 0;
  			});
  		}
  	});
  };

}]);