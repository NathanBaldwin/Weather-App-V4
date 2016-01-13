var controllerModule = angular.module('blank.controllers', []);
 
controllerModule.controller('weatherCtrl', function($scope, $http) {
  this.temp = "-";
  this.iconName = "";
  this.color = "blue";
  // this = new weatherCtrl()



  navigator.geolocation.getCurrentPosition(function(geopos) {
    // this = {a: 'b'}
    console.log(geopos);

    var lat = geopos.coords.latitude;
    var long = geopos.coords.longitude;
    var apiKey = "255f1f7bd7cf37d67d37f0d8313cc27e";

    var url = '/api/forecast/' + apiKey + '/' + lat + ',' + long;

    $http.get(url).then(function (res) {
      console.log("resolve object", res);
      console.log("temperature", res.data.currently.temperature);

      this.temp = res.data.currently.temperature;
      this.iconName = res.data.currently.icon;
      console.log("this.iconName", this.iconName);


    }.bind(this))

  }.bind(this));


});