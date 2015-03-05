angular
  .module('boson.shoppingplan')
  .controller('ShoppingPlanController', ShoppingPlanController);

ShoppingPlanController.$inject = [
  '$scope',
  '$state',
  '$ionicPopup',
  '$ionicPlatform',
  'ShoppingPlanService'
];

function ShoppingPlanController($scope, $state, $ionicPopup, $ionicPlatform, ShoppingPlanService) {

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

}