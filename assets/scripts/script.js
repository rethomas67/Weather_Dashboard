async function getCurrentWeather(latitude, longitude) {
  //forecast
  var weatherUrl =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&units=imperial&appid=53c5fea2f330bb5e7ac45cffe4100676";

  rslt = fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      currentWeatherData.push(data);
    });
  await rslt;
}

async function getGeoLocationData() {
  var cityUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=Atlanta,USA&limit=1&appid=53c5fea2f330bb5e7ac45cffe4100676";
  var rslt = fetch(cityUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      geoLocationData.push(data);
    });
  await rslt;
}

function weatherData(event) {
  event.preventDefault();
  //get the users input using jquery
  selectedCity = $(".city_input").val();
  //use the geolocation API to retrive longitude and latitude
  getGeoLocationData();
}

//initialize geolocation data
var geoLocationData = [];
var latitude = 0;
var longitude = 0;

//initialize city input
var selectedCity = "";
//initialize the current forecast data
var currentWeatherData = [];

//click event to process the weather data for the input city
$(".btn_search").on("click", weatherData);
console.log(selectedCity);

//latitude = geoLocationData.lat;
//long = GeolocationData.lon;

//console.log(currentWeatherData);
