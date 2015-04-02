angular
  .module('boson.shopplan')
  .controller('PreviewPlanController', PreviewPlanController);

PreviewPlanController.$inject = [
  'lodash',
  '$scope',
  'initShopPlanner'
];

function PreviewPlanController(_, $scope, ShopPlanner) {

  var vm = this;

}