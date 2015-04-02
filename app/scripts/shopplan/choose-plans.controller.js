angular
  .module('boson.shopplan')
  .controller('ChoosePlansController', ChoosePlansController);

ChoosePlansController.$inject = [
  'lodash',
  '$scope',
  'initShopPlanner'
];

function ChoosePlansController(_, $scope, ShopPlanner) {

  console.log("plans");

  var vm = this;

}