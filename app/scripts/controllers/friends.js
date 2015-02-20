var _friends = angular.module('controllers.friends',
	['services.friends']);

_friends.controller('FriendsController',
  ['$scope',
   'FriendsService',
function($scope, FriendsService) {

	$scope.friends = [];
	$scope.selectedFriends = {};

	FriendsService.getNearbyFriends().then(function(friends) {
		$scope.friends = friends;
	});

	function removeInvitation(userId) {
		$scope.selectedFriends[userId] = false;
		FriendsService.removeFriendFromInvite(userId);
	}

	function addInvitation(userId) {
		$scope.selectedFriends[userId] = true;
		FriendsService.selectFriendToInvite(userId);
	}

	$scope.isInvited = function(userId) {
		return $scope.selectedFriends[userId] == true
	};

	$scope.toggleInvitation = function(userId) {
		if($scope.isInvited(userId)) removeInvitation(userId);
		else addInvitation(userId);
	};

}]);