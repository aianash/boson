angular
  .module('boson.search')
  .controller('QueryController', QueryController);

QueryController.$inject = [
  'lodash',
  '$scope',
  '$timeout',
  '$ionicHistory',
  '$ionicLoading',
  '$state',
  'Searcher'
];

function QueryController(_, $scope, $timeout, $ionicHistory, $ionicLoading, $state, Searcher) {

  var vm = this;

  // queryStr contains the raw query that user types
  // and query in addition contains the chosen filters'
  // values
  vm.queryStr = '';
  vm.query    = {};
  vm.filters  = {}; // [TO DO]

  ///////////////////////
  // ViewModel methods //
  ///////////////////////

  vm.search = search;
  vm.reset  = reset;
  vm.goBack = goBack;


  $scope.$on('modal.shown', function(ev, modal) {
    vm.modal = modal;
    $timeout(function() {
      document.getElementById('search-button').classList.toggle('on');
    }, 500);
  });

  function search() {
    $ionicLoading.show();
    var sruid = _.now();
    vm.query.queryStr = vm.queryStr
    Searcher.updateQuery(sruid, vm.query);
    document.getElementById('search-button').classList.remove('on');
    $state.go('boson.search.result', {sruid: sruid})
          .then(function() {
            vm.modal.hide();
          });
  }

  function reset() {
    vm.query = {};
    vm.filters = {};
    vm.queryStr = '';
  }

  function goBack() {
    document.getElementById('search-button').classList.remove('on');
    vm.modal.hide();
  }

}