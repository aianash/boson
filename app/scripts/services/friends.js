var _friends = angular.module('services.friends',
	['services.higgs']);


_friends.factory('FriendsService',
	['$q',
	 'higgs',
function($q, higgs) {

	var _FriendsService;

	_FriendsService = (function() {
		function FriendsService(){ /** constructor */ };

		FriendsService.prototype.getNearbyFriends = function() {
			return higgs.getNearbyFriends();
		};

		FriendsService.prototype.removeFriendFromInvite = function(userId) {
			higgs.removeUserFromInviteList(userId);
		};

		FriendsService.prototype.selectFriendToInvite = function(userId) {
			higgs.addUserToInviteList(userId);
		};

		return FriendsService;
	})();

	return new _FriendsService();

}]);