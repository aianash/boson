angular
  .module('boson.shopplan')
  .controller('ShopPlanListController', ShopPlanListController);

ShopPlanListController.$inject = [
  'lodash',
  '$scope',
  '$state',
  '$ionicPopup',
  'initShopPlan'
];

function ShopPlanListController(_, $scope, $state, $ionicPopup, ShopPlan) {

  var vm = this;

  vm.shopplans = ShopPlan.plans;

  // ViewModel methods
  vm.hasPlans     = hasPlans;
  vm.showPlan     = showPlan;
  vm.setReminder  = setReminder;
  vm.editShopPlan = editShopPlan;


  ////////////////////////////////////////////

  function hasPlans() {
    return !!vm.shopplans && vm.shopplans.length > 0;
  }

  function showPlan(planId) {
    $state.go('boson.shopplan.detail', {planId: planId});
  }

  // [TO DO] After higgs has apis
  function setReminder(planId) {

    var plan = _.find(vm.shopplans, function(plan){ plan.id === planId });

    // [TO IMPROVE] Temp Solution for date picker.
    vm.temp = {date: new Date(plan.date)};

    var datePopup = $ionicPopup.show({
      template: '<input type="date" ng-model="vm.temp.date">',
      title: 'Set Shopping Plan\'s reminder',
      scope: $scope,
      buttons: [
        {text: 'Cancel'},
        {
          text: '<b>Done</b>',
          type: 'button-positive',
          onTap: function(e) {
            return vm.temp.date
          }
        }
      ]
    });

    datePopup.then(function(res) {
      var data = new Date(res);
      // [TO DO] plan.setReminder(date);
    });
  }


  // [TO DO] After higgs service have apis
  function editShopPlan(planId) {

    var plan = _.find(vm.shopplans, function(plan){ plan.id === planId });

    vm.temp = { title: plan.title };

    var titlePopup = $ionicPopup.show({
      template: '<input type="text" ng-model="vm.temp.title">',
      title: 'Change Shopping Plan\'s title',
      scope: $scope,
      buttons: [
        {text: 'Cancel'},
        {
          text: '<b>Done</b>',
          type: 'button-positive',
          onTap: function(e) {
            return vm.temp.title
          }
        }
      ]
    });

    titlePopup.then(function(res) {
      var title = res;
      // [TO DO] plan.updateTitle(title);
    });
  }

}