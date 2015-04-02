angular
  .module('boson.shopplan')
  .controller('ChooseDestinationsController', ChooseDestinationsController);

ChooseDestinationsController.$inject = [
  'lodash',
  '$scope',
  'initShopPlanner'
];

function ChooseDestinationsController(_, $scope, ShopPlanner) {

  var vm = this;

}