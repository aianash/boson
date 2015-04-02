angular
  .module('boson.shopplan')
  .controller('InviteFriendsController', InviteFriendsController);

InviteFriendsController.$inject = [
  'lodash',
  '$scope',
  'initShopPlanner'
];

function InviteFriendsController(_, $scope, ShopPlanner) {

  var vm = this;

}