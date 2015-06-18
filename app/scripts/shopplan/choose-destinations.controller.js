angular
  .module('boson.shopplan')
  .controller('ChooseDestinationsController', ChooseDestinationsController);

ChooseDestinationsController.$inject = [
  '$window',
  '$scope',
  '$timeout',
  '$ionicActionSheet',
  '$ionicModal',
  '$ionicLoading',
  '$ionicHistory',
  'lodash',
  'initShopPlanner'
];


// Controller for Map view in Create ShopPlan
// [WIP]
//
// Common Object used
// destination
//  {
//    dtuid: <Timestamp/Number>
//    address: {
//      gpsLoc: {
//        lat: <Double>
//        lng: <Double>
//      }
//    }
//  }
//
// store locations (from bucket and plan)
//  {
//    storeId: {
//      stuid: <Number>
//    }
//    address: {
//      gpsLoc: {
//        lat: <Double>
//        lng: <Double>
//      }
//      title: <string>
//      short: <string>
//    }
//    name: {
//      full: <string>
//    }
//    itemTypes: [ <itemType <string>>]
//  }
function ChooseDestinationsController($window, $scope, $timeout, $ionicActionSheet, $ionicModal, $ionicLoading, $ionicHistory, _, ShopPlanner) {

  var vm = this;

  vm.bucketStores   = ShopPlanner.bucketStores;
  vm.goBack         = goBack;
  vm.openCreatePlan = openCreatePlan;

  var destinations  = {}; // holds user selected destinations
  var map;

  $ionicLoading.show({delay: 200});

  document.addEventListener('deviceready', _showOnMap);

  $ionicModal.fromTemplateUrl('shopplan/shopplan-title.modal.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true,
    hardwareBackButtonClose: false
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
    map.clear();
    map.off();
  });

  $scope.createShopplan = function(title) {
    if(!title) {
      _showError('Please enter a title for plan')();
      return;
    }
    var adds = _.values(destinations);
    $scope.modal.hide();
    $scope.message = 'Creating Shop Plan ...';
    $ionicLoading.show({ noBackdrop: false });

    var itemIds =
      _(vm.bucketStores).map(function(store) { return store.catalogueItems; })
        .flatten()
        .map(function(item) { return item.itemId; });

    var cud = {
      'meta': {
        'title': title
      },
      'destinations': {
        'adds': adds
      },
      'invites': {},
      'items': {
        'adds': itemIds
      }
    };

    console.log(JSON.stringify(cud));
    // Call shop planner to create shop plan
    // and then go to shop plan view
  }

  $scope.closeCreatePlan = function() {
    $scope.modal.hide();
    map.setClickable(true);
  }

  /////////////////////////
  // ViewModel functions //
  /////////////////////////

  function openCreatePlan() {
    if(!_.isEmpty(destinations)) {
      map.setClickable(false);
      $scope.modal.show();
    } else {
      _showError('Choose atleast one destination')(new Error('no destinations'));
    }
  }

  function goBack() {
    $ionicHistory.goBack();
  }

  /////////////////////
  // Private Methods //
  /////////////////////

  function _showOnMap() {
    // see if it can be added after map initialization
    document.getElementById('create-plan').classList.toggle('on');
    $timeout(function() {
      var mapDiv = document.getElementById("createmap");
      map = plugin.google.maps.Map.getMap(mapDiv);
      map.addEventListener(plugin.google.maps.event.MAP_READY, function() {
        map.setClickable(true);
        $ionicLoading.hide();
        _addStoresToMap();
        _addClickEventsToMap();
      });
    }, 500);
  }

  function _addStoresToMap() {
    if(map) {
      var points = _.map(vm.bucketStores, _addStoreToMap);
      var latlngBounds = new plugin.google.maps.LatLngBounds(points);
      var zoom = _getBoundsZoomLevel(latlngBounds, {
        height: $window.innerHeight,
        width : $window.innerWidth
      }) - 1;
      map.moveCamera({
        'target': latlngBounds.getCenter(),
        'zoom'  : zoom
      });
    }
  }

  function _addStoreToMap(store) {
    var gpsLoc = store.info.address.gpsLoc;
    var loc = new plugin.google.maps.LatLng(gpsLoc.lat, gpsLoc.lng);
    map.addMarker({
      'position': loc,
      'icon'    : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAsCAMAAADcpCGDAAACLlBMVEXOeRDqsA/////OeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRDOeRD39fDbeQzPehDqsA/fmw/SghDfuGLlpg/mpg/ioA/ZjRDqrw/ntFbemQ/nuF3RfRDRfxDfmg/prg/nqw/QfBDbeg7TgxDelw/clBDakBDSgBDdr1Hhng/t3b7imy/ry4zjog/gmw/UhRDp06jjpA/iv3PckxDy483ThRDnzJPr2rbSiiDt0qHz6dnt06XbkhDx48rt0Z7XihDdlg/QfRDy6tvnqg/39O7kpQ/VhhDOeRD28urSfxDWhxD17+fglijXmjHr2LTguWXnqQ/YjBDcrUvgnQ/t38Tt0Jr07uPt3sLsz5bkrUbcfQ/x4MXShRvy5tLmqA/hu2nPfRP17eHoqw/akhDmyYzw3r/z7eHkxYLapD3cfxHq17Ddrk7eslXioDThvGzv2LLhmizv48707+XqyIXy6t3o0J3y5NDt1KjszZPqxX3lyInjoQ/qx4DapkL18uvw5tLdgBPfmQ/TjSL28u3ajxDehRbbkxDq1q7hnQ/nu2PovWrpv2/XiRDorQ/prQ/WiRC+xCzPAAAAN3RSTlMAAAB7ZoqQKpkzlpM2CcmHJ5yfIY1yBoEVV3U5SBgDaWw/eOSohN6xUcYtb88PMBvDWh6iVAwSXVmjXQAAAq5JREFUeF591NV240gQBuA2O8w0GWae5ZJkZqYwMzPzMDMzM9Pyvt12tazEtk7y3+jmU1VJdbpJYkrLtur1+hy1TiFFqVSugOLN2W5bxGAwhKOhbdpcuVDxl82CFL93MkOXLLZsj/qFxNi9gaJEsYmvFFKzENIQIolfBs9J5SvpIPFuvv8KJZHLN4rAUN9RYTKZZt3RS6xT/bq4yPAyYDGaHgLLseu8E8lwYAMT60MMWPmnsJyh+S9IBjRM7HqNYJSvgsSc78FR3Ieo0LESPk8DJOVzBX5eeAcVOWEUkSYEz/50jQBMuP46C3DEaKeT7KQi24wlAo8ALjo4jusEOMpxwT+m4Q4WiRWQjeOUCpUVAG8+cJjqavb42vndRoWtjBTEsElPG8AMBUGGgvi4Ox3A7iqSWY+ivx2gN8g5ujmWlpPcqS44868gfCwk5WMopo4DwIleqBHFVTjdB9BBl2lIJ7lGFItzwOIQRQ1gLtAJB0pIFo+i+YooHojCgeCaB1/dHf/axhsMjNwUxQyKW4tUuEulP+YeQtHFiQlOUHHbSnexh+5lL1uc8x6K+1w8LQBzrfgX9lFB9luosBvbqHgsiT54Ml6Lv/oACjVb9EKgAds8f+Fyvezugul5bG7Qs+1n8X62fs8rWE7VUgQLxw4yQVQ9AmZ46m37OwbeN3msWLcuTymKYiyCqe3nZ5dMs59CTp/ASqShwKhsy8fEbDWYhwUx3gwiCfLDqCCPb1K3In5stcvFN03iqdSGZcAynpUofuIXUsWYOvnsF42lgN9/Tr0d0p1JwD9YnioKeEui6FfJ7yC10bcCDucr5IJoogk9MmUCk1cnib9ZD7lIw1HEjTEgF0Qd+0e8NtJWE6Rkys6uHsWqgmjptM1axRpCkR45nP/rmuI3VX6mIkn8D8Q6BS9/SrN6AAAAAElFTkSuQmCC',
      'title'   : store.info.name.full,
      'snippet' : store.info.address.title
    }, function(marker) {
      // marker.showInfoWindow();
    });
    return loc;
  }

  function _addClickEventsToMap() {
    if(map) {
      map.on(plugin.google.maps.event.MAP_CLICK, function(latlng) {
        _addDestination(latlng);
      });
    }
  }

  function _addDestination(latlng) {
    map.addMarker({
      'position' : latlng,
      'icon'     : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAsCAMAAADcpCGDAAACJVBMVEX///9wESM0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyI0CyL39fBtESNVDyI2CyI1CyJwESM3DCJoESNSDyI6DCJiECNLDiI+DSJvESNaDyJTDyJGDSJBDSJjECM5DCI7DCI4DCKNX3ZZDyJpESPKtbxHHDNADSLDh4+TM0BMDiLv6+h3GSZHDSJRDyKbcoY8DCLj0dCQYnltEBzMub5NDiJWDyJXDyJmCxc9DSJEDSJIDSLn396vXmrNnqLSwsZODiJpDRiyYm1mESPk09JFDSJPDyJJDiJ5SGGMLDleECLm1tTZu7x/TmZzFiJdLEVvER7t5+VhECOogJM/DSKbPkvCqbP18u+QMT04DyXq3dq0k6GeQU6vjJuoUV2UNkLy7err5ePc0tJqOVLSq6/w6ea1aXXIs7rx6+ffx8d8S2Pz7+vGr7iWaoDTr7K/gIm7nqrs4d/RqavFjJPo4d+CUWmtiZnq39yHJzRwP1fy7+vf1tb18e3TxchdDyJJHjXv5+RAFixfECNsESPhzMzKl53Vx8pbDyLu6edCDSJqESP08e2TZnz1RKZRAAAANnRSTlMAAHtmKpCKmZwJJzaTn4fJMyGWV3UGjYE5FXIYeAOESN5s5D+oaVRRxi1vzw+xMBvDWh6iDBJz5CTsAAACnklEQVR4Xn3U45sjQRAG8J5gs/atjrbRo9he2raNs23btv6+6+rMZCeT3X2/1Ty/dFVS6UGKMIU5qwwGQ7pWx9AgVVaszwi4mzmOqxmt26BPjhcawWYV5YRdvlRdrNi4qTMsKsO6jEVKsJkPieoM1iUsgC1Gr3x8iAwidWM9eTJIFiYocHD2kulgMDgbGA1TYs+VRKqLAq8/eAXTzB/lzUBM/EoK1rY7ADj5RziaroZqeDgSGWX3TwBHhF6szD8b9AnsJUBXR3v6TuCY/J0OwSFriEivAdFXO3m8+7uS/PCTPqZ1RGRY4Qj+18vuc1X4cX39JZk8h0MsWWi1ACOFpsmj6/2Tr9pIZsbHB+5ifM9NhDsHZVmgie0sNCgvGwABOYNxpRG6a1CKHURHE4iyi1OyeEfKz19F0ZyHCo6B8LwHMdT4qT8CqqAsIcvkslGyH8RwMYiTM1PlEXEKxGky4Ug+SuJh0orzGHJhYLKH5hsBl33w0a3St524SsW1uXGaG8BvDhMRKJR+MUegC8Stnkhug7jjJLvYhhDa3g6DmO9jSE//A4wfzkGTYliobQci2emFQ/xnQTxpnML46dwQxs/gT8Mad4HQVtM/nTFmdZUN0JwzIEgSH6br971YAL1jzXCwZY90EWwixOR53fSGgre1Pic8aUmU75Ig3YQPHfzsWHD2Y7uZFekRmdHb5I5eE6uTs5qkwpWKotn3RYwP69MtiP3w3dWpSECK6GvigFdIUooDwqBalGpRTIpKVaD1oPrtkG2OAWFjgVpkCV6l6NAwaoG0flbRI42JFyihU9EjZTGBEltk8VvDLCoyeRiFboxZXDBayx8AJmPmUoLJ9zjISu25zJKC0Y+SfeiZZQST3deadmhZcViTlsLEiP8htArGLrBAHAAAAABJRU5ErkJggg==',
      'animation': plugin.google.maps.Animation.DROP,
      'title'    : 'shopping destination'
    }, function(marker) {
      var gpsLoc = {
        'lat': latlng.lat,
        'lng': latlng.lng
      };
      var dest = _newDestination(gpsLoc);
      destinations[dest.destId.dtuid] = dest;
      marker.setDraggable(true);

      marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function() {
        delete destinations[dest.destId.dtuid];
        marker.remove();
      });

      marker.addEventListener(plugin.google.maps.event.MARKER_DRAG_END, function(marker) {
        marker.getPosition(function(latlng) {
          destinations[dest.destId.dtuid].address.gpsLoc = {
            'lat': latlng.lat,
            'lng': latlng.lng
          };
        });
      });

    });
  }

  function _newDestination(gpsLoc) {
    var destination = {
      'destId': {
        'shopplanId': {
          'createdBy': {'uuid': '-1'},
          'suid': '-1'
        },
        'dtuid': _.now() + ''
      },
      'address': {
        'gpsLoc': gpsLoc
      }
    };

    return destination;
  }

  function _getBoundsZoomLevel(bounds, mapDim) {
    var WORLD_DIM = { height: 256, width: 256 };
    var ZOOM_MAX = 21;

    function latRad(lat) {
        var sin = Math.sin(lat * Math.PI / 180);
        var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
        return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    var ne = bounds.northeast;
    var sw = bounds.southwest;

    var latFraction = (latRad(ne.lat) - latRad(sw.lat)) / Math.PI;

    var lngDiff = ne.lng - sw.lng;
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
    var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
  }

  function _showError(msg) {
    return function onError(error) {
      console.error("Error  = [" + JSON.stringify(error) + "]");
      var hideError = $ionicActionSheet.show({
        titleText: msg
      });
      $timeout(function() {
        hideError()
      }, 2000);
    };
  }
}