var _query = angular.module('services.query', ['services.dummy']);


_query.factory('QueryService',
  ['$q',
   'DummyData',
function($q, DummyData) {

	return {
		expand: function(searchId, queryStr) {

			var promise = $q.when(queryStr);

			// Throttling and REST request
			promise = promise.then(function(queryStr) {
				var defer = $q.defer();

				setTimeout(function() {
					defer.resolve(DummyData.query(queryStr, searchId));
				}, 500);

				return defer.promise;
			});

			return promise;
		}
	};
}]);


_query.factory('QueryView',
	['$ionicModal',
function($ionicModal) {

	var self = this;

	var promise = $ionicModal.fromTemplateUrl('templates/modals/query-modal.html', {
    animation: 'slide-in-up'
  }).then(function(modal) {
    self.queryModal = modal;
  });

	return {
		opened: function(fn) {
			promise.then(function() {
				self.queryModal.scope.$on('modal.shown', function() {
					fn();
				});
			});
		},
		show: function() {
			promise.then(function() {
				self.queryModal.show();
			})
		},
		hide: function() {
			promise.then(function() {
				self.queryModal.hide();
			})
		}
	};

}]);