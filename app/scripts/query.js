// /** DEPRECATED */

// var _query = angular.module('_query', []);

// _query.factory('Query', ['$q', function($q) {

// 	return {
// 		'expand': function(queryStr) {

// 			var promise = $q.when(queryStr);

// 			// Throttling and REST request
// 			promise = promise.then(function(queryStr) {
// 				var defer = $q.defer();

// 				setTimeout(function() {
// 					defer.resolve({
//   		      'str': queryStr,
//   		       'expanded': [
//   		       		{
//   		       			label: 'descr',
//   		       			value: "men's casual shirt",
//   		       			type: 'string'
//   		       		},
//   		       		{
//   		       			label: 'color',
//   		       			value: ['red', 'blue', 'green'],
//   		       			type: 'color-array'
//   		       		},
//   		       		{
//   		       			label: 'size',
//   		       			value: '41',
//   		       			type: 'string'
//   		       		},
//   		       		{
//   		       			label: 'fit',
//   		       			value: 'slim fit',
//   		       			type: 'string'
//   		       		},
//   		       		{
//   		       			label: 'brand',
//   		       			value: ['levis', 'woodland', 'peter england'],
//   		       			type: 'string-array'
//   		       		}
//   		       ]
//       		});
// 				}, 500);

// 				return defer.promise;
// 			});

// 			return promise;
// 		}
// 	};
// }]);


// /*========== DIRECTIVES ===========*/

// _query.directive('expandedQuery', function() {
// 	return {
// 		restrict: 'E',
// 		templateUrl: 'expanded-query.html'
// 	};
// });


// _query.filter('component', ['$sce', function($sce) {
// 	return function(input, type) {
// 		var out = ""
// 		switch(type) {
// 			case "string":
// 				out = "<i>" + input + "</i>";
// 				break;
// 			case "string-array":
// 				out = "<i>" + input.join(", ") + "</i>";
// 				break;
// 			case "color-array":
// 				var html = [];
// 				angular.forEach(input, function(value, key){
// 					html.push("<i class='icon ion-record' style='color: " + value + ";'></i>");
// 				});
// 				out = html.join("");
// 				console.log(out)
// 				break;
// 			default:
// 				out = "<i>" + input + "</i>";
// 		};

// 		return $sce.trustAsHtml(out);
// 	};
// }]);


// /*========== CONTROLLERS ============*/

// _query.controller('QueryController',
//                  ['$scope',
//                   '$timeout',
//                   'Query',
//                   function($scope, $timeout, Query) {

//   $scope.queryStr = '';
//   $scope.query = {};

//   $scope.search = function() {
//     $scope.$emit('search', $scope.query);
//   };

//   $scope.expand = function() {
//     Query.expand($scope.queryStr)
//         .then(function(query) {
//           $scope.query = query;
//         });
//   };

//   $scope.reset = function() {
//     $scope.query = {};
//     $scope.queryStr = '';
//   };

// }]);