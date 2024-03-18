function processData() {
  var idx = 0;
  console.log(forecastWeatherData.list[idx].dt_txt);
  while (idx < 40) {
    idx += 8;
    validIdx = idx;
    if (idx == 40) {
      validIdx = idx - 1;
    }
    console.log(forecastWeatherData.list[validIdx].dt_txt);
  }
}

async function getForecastWeather(latitude, longitude) {
  console.log(geoLocationData);
  //forecast
  var weatherUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&units=imperial&appid=53c5fea2f330bb5e7ac45cffe4100676";

  rslt = fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      forecastWeatherData = data;
    });
  await rslt;
  console.log(forecastWeatherData);
  processData();
}

async function getCurrentWeather(latitude, longitude) {
  console.log(geoLocationData);
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
      currentWeatherData = data;
    });
  await rslt;
  console.log(currentWeatherData);
  getForecastWeather(latitude, longitude);
}

//make the function asynchrounous to wait for the data
async function getGeoLocationData() {
  //the geolocation api url using the dynamic input from the user
  var cityUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    selectedCity +
    ",USA&limit=1&appid=53c5fea2f330bb5e7ac45cffe4100676";

  var tempData;
  var rslt = fetch(cityUrl)
    //get the 200 response
    .then(function (response) {
      return response.json();
    })
    //push the api data into an array
    .then(function (data) {
      geoLocationData = data;

      console.log(data);
      console.log(data[0].lat);
    });
  //continue once there is data

  await rslt;
  getCurrentWeather(geoLocationData[0].lat, geoLocationData[0].lon);
}

function updateCityHistory() {
  var historyElement = `<div
            class="city_item w-75 mb-3 btn-group d-flex text-center text-light rounded-top rounded-bottom"
            role="group"
          >
            <button
              class="text-dark btn btn-secondary btn-lg btn-block city_item fw-bold"
            >
              
            </button>
          </div>
    `;

  var cities = $(".cities");

  cities.append(historyElement);
  var classItem = cities.children(".city_item");
  classItem.removeClass("city_item");
  classItem.addClass(selectedCity);
  buttonItem = classItem.children("button");
  buttonItem.text(selectedCity);
}

function processAPI() {
  bDone = false;
  getGeoLocationData();

  //updates search history for the cities
  updateCityHistory();
  $(".city_input").val("");

  //latitude = geoLocationData.lat;
  //console.log(geoLocationData.lat);
  //longitude = geoLocationData.lon;
  //getCurrentWeather(latitude, longitude);
  //console.log(currentWeatherData);
}

function weatherData(event) {
  event.preventDefault();

  //get the users input using jquery
  selectedCity = $(".city_input").val();
  //use the geolocation API to retrive longitude and latitude
  processAPI();
  $(".city_input").val("");
  console.log(selectedCity);
}

//initialize geolocation data
var geoLocationData;
var latitude = 0;
var longitude = 0;

//initialize city input
var selectedCity = "";
//initialize the current weather data
var currentWeatherData;

//initialize the forecast data
var forecastWeatherData;

//click event to process the weather data for the input city
$(".btn_search").on("click", weatherData);
$(".forecasts").children().show();

//latitude = geoLocationData.lat;
//long = GeolocationData.lon;

//console.log(currentWeatherData);
