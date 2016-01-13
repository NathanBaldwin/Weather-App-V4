var controllerModule = angular.module('blank.controllers', []);
 
controllerModule.controller('weatherCtrl', function($scope, $http) {
  var weather = this;
  weather.temp = "--";
  // this.iconName = "";
  // this.color = "blue";

  $scope.lat = "";
  $scope.long = "";
  var apiKey = "3148eafe3ec04cf5";

  var autoIpUrl = "http://api.wunderground.com/api/" + apiKey + "/geolookup/conditions/q/autoip.json";

  $http.get(autoIpUrl).then(function (res) {
      console.log("auto ip resolve object", res);
      console.log("temp f from auto ip:", res.data.current_observation.temp_f);
      weather.temp = res.data.current_observation.temp_f;
      weather.icon = res.data.current_observation.icon_url;
      // this.iconName = res.data.currently.icon;
      // console.log("this.iconName", this.iconName);

    });


  navigator.geolocation.getCurrentPosition(function(geopos) {
    console.log(geopos);

    $scope.lat = geopos.coords.latitude;
    console.log("lat came back:", $scope.lat);
    $scope.long = geopos.coords.longitude;
    $scope.$apply();

    var url = "http://api.wunderground.com/api/" + apiKey + "/geolookup/q/autoip.json";

  });
 
 $scope.$watch('lat', function() {
 	if ($scope.lat !== "") {
 	console.log("this.lat changed!!", $scope.lat);
 	var geoLocateUrl = "http://api.wunderground.com/api/" + apiKey + "/geolookup/conditions/q/" + $scope.lat + "," + $scope.long + ".json";

    $http.get(geoLocateUrl).then(function (res) {
      console.log("geo foolookup resolve object", res);
      console.log("temp f from geolookup:", res.data.current_observation.temp_f);
      weather.temp = res.data.current_observation.temp_f;
      weather.icon = res.data.current_observation.icon_url;

    })
   };
 })



 this.search = function() {
  	console.log("you clicked search!");
  	var citysearchUrl = "http://api.wunderground.com/api/" + apiKey + "/geolookup/conditions/q/" + weather.searchQuery + ".json";

    $http.get(citysearchUrl).then(function (res) {
    $scope.searchedCityObject = res;
      console.log("search city resolve object", res);
      console.log("temp f from searched city:", res.data.current_observation.temp_f);
      weather.temp = res.data.current_observation.temp_f;
      weather.icon = res.data.current_observation.icon_url;

    })
    .then(function() {
    	console.log("log after returned search");
    	console.log("nested res", $scope.searchedCityObject);
    	var searchedHistory = localStorage.getItem('searchHistory');

    	console.log("currentSearchHistory", searchedHistory);

    	var searchedStationId = $scope.searchedCityObject.data.current_observation.station_id;
    	console.log("searched station id:", $scope.searchedCityObject.data.current_observation.station_id);

    	var searchedCity = $scope.searchedCityObject.data.location.city;
    	console.log("searchedCity:", searchedCity);

    	var searchedState = $scope.searchedCityObject.data.location.state;
    	console.log("searched State:", searchedState);

    	var searchLocKey = searchedCity + ", " + searchedState;
    	console.log("searchLocKey", searchLocKey);

    	if (searchedHistory === null) {
    		console.log(" searched history is null");
    		searchedHistory = {
    			[searchLocKey]: searchedStationId
    		};
    		localStorage.setItem('searchHistory', JSON.stringify(searchedHistory));
    	} else {
    		
    	var parsedHistObj = JSON.parse(searchedHistory);
    	console.log("parsedHistObj", parsedHistObj);

	    	if (parsedHistObj.hasOwnProperty(searchLocKey) === false) {
	    		console.log("you haven't searched this city before");
	            parsedHistObj[searchLocKey] = searchedStationId;
	            console.log("ammended search history:", parsedHistObj);
		    	localStorage.setItem('searchHistory', JSON.stringify(parsedHistObj));
	        } else {
	        	console.log("already have station id!!");
	        }
    };
    })

 }



});