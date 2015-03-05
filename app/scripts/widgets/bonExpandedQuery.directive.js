angular
  .module('boson.widgets')
  .directive('bonExpandedQuery', bonExpandedQuery)
  .filter('component', component)

function bonExpandedQuery() {
  return {
    restrict: 'E',
    templateUrl: 'widgets/bonExpandedQuery.html'
  };
}


component.$inject = ['$sce'];

function component($sce){
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
          html.push("<i class='icon ion-android-checkbox-blank color-patches' style='color: " + value + ";'></i>");
        });
        out = html.join("");
        break;
      default:
        out = "<i>" + input + "</i>";
    };

    return $sce.trustAsHtml(out);
  };
}