angular
  .module('boson.shopplan')
  .controller('InviteFriendsController', InviteFriendsController);

InviteFriendsController.$inject = [
  'lodash',
  '$scope',
  'initShopPlanner'
];

/**
 * Controller for editing invites during create plan
 *
 * Common object used
 * friend
 *  {
 *    id: { uuid: <Number> }
 *    name:{
 *      first: <string>
 *      last: <string>
 *      handle: <string>
 *    }
 *    avatar: {
 *      small: <url - string>
 *    }
 *    inviteStatus: <constant string>
 *  }
 *
 */
function InviteFriendsController(_, $scope, ShopPlanner) {

  ShopPlanner.ensurePlanSelected();

  var vm = this;

  vm.friends          = ShopPlanner.friends;
  vm.invitedFriends   = {};

  // ViewModel methods
  vm.toggleInvitation = toggleInvitation;
  vm.isInvited        = isInvited;

  _activate();

  ///////////////////////
  // ViewModel methods //
  ///////////////////////

  function toggleInvitation(uuid) {
    if(this.isInvited(uuid)) _addInvitation(uuid);
    else _removeInvitation(uuid);
  }

  function isInvited(uuid) {
    return !!vm.invitedFriends[uuid];
  }

  ///////////////////////
  // Private functions //
  ///////////////////////

  function _activate() {

    // Lazily get existing friends
    ShopPlanner.getExistingInvites()
      .then(function(invites) {
        _.forEach(invites, function(friend) {
          vm.isInvited[friend.id.uuid] = true;
        });
      });
  }

  function _addInvitation(uuid) {
    ShopPlanner.addToInvitation(uuid);
    vm.invitedFriends[uuid] = true;
  }

  function _removeInvitation(uuid) {
    ShopPlanner.removeFromInvitation(uuid);
    vm.invitedFriends[uuid] = false;
  }

}