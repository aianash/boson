var _query = angular.module('directives.query', []);

_query.directive('expandedQuery', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/directives/expanded-query.html'
	};
});



_query.filter('component', ['$sce', function($sce) {
	return function(input, type) {
		var out = ""
		switch(type) {
			case "string":
				out = "<i>" + input + "</i>";
				break;
			case "string-array":
				out = "<i>" + input.join(", ") + "</i>";
				break;
			case "color-array":
				var html = [];
				angular.forEach(input, function(value, key){
					html.push("<i class='icon ion-record' style='color: " + value + ";'></i>");
				});
				out = html.join("");
				break;
			default:
				out = "<i>" + input + "</i>";
		};

		return $sce.trustAsHtml(out);
	};
}]);