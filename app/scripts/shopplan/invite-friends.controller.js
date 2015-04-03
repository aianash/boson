angular
  .module('boson.shopplan')
  .controller('InviteFriendsController', InviteFriendsController);

InviteFriendsController.$inject = [
  'lodash',
  '$scope',
  'initShopPlanner'
];

function InviteFriendsController(_, $scope, ShopPlanner) {

  ShopPlanner.ensurePlanSelected();

  var vm = this;

  vm.friends = ShopPlanner.friends;
  vm.invitedFriends = {}

  // ViewModel methods
  vm.toggleInvitation = toggleInvitation;
  vm.isInvited        = isInvited;


  ///////////////////////
  // ViewModel methods //
  ///////////////////////

  function toggleInvitation(userId) {
    if(this.isInvited(userId)) _addInvitation(userId);
    else _removeInvitation(userId);
  }

  function isInvited(userId) {
    return !!vm.invitedFriends[userId]
  }

  function _addInvitation(userId) {
    ShopPlanner.addToInvitation(userId)
    vm.invitedFriends[userId] = true;
  }

  function _removeInvitation(userId) {
    ShopPlanner.removeFromInvitation(userId);
    vm.invitedFriends[userId] = false;
  }

}