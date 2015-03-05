angular
  .module('boson.search')
  .factory('QueryModal', QueryModal);

QueryModal.$inject = ['$ionicModal'];

function QueryModal($ionicModal) {

  var self = this;

  var promise = $ionicModal.fromTemplateUrl('search/query-modal.html', {
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

}