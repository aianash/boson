angular
  .module('boson.search')
  .controller('QueryController', QueryController);

QueryController.$inject = [
  'lodash',
  '$scope',
  '$ionicLoading',
  '$state',
  'Searcher'
];

function QueryController(_, $scope, $ionicLoading, $state, Searcher) {

  var vm = this;

  // queryStr contains the raw query user types
  // and query in addition contains the chosen filters'
  // values
  vm.queryStr = '';
  vm.query    = {};
  vm.filters  = {}; // [TO DO]
  query.sruid = _.now(); // using timestamp as 64 bit search unique id
                         // searchId is always generated at the app

  // ViewModel methods

  vm.search       = search;
  vm.reset        = reset;
  vm.showFilters  = showFilters;


  // Updates the query to server
  // and then go to result view
  function search() {
    $ionicLoading.show({template: 'Searching...'});

    Searcher.updateQuery(query)
      .then(function(data) {
        $state.go('boson.search.result', {searchId: vm.query.sruid});
      });
  }

  function showFilters() {
    // [TO DO] Implement a new version of filter
  }

  function reset() {
    var sruid = vm.query.sruid;
    vm.query = {sruid: sruid};
    vm.filters = {};
    vm.queryStr = '';
  }

}