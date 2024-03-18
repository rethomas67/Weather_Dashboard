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

//make the function asynchrounous to wait for the data
async function getGeoLocationData() {
  //the geolocation api url using the dynamic input from the user
  var cityUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    selectedCity +
    ",USA&limit=1&appid=53c5fea2f330bb5e7ac45cffe4100676";
  var rslt = fetch(cityUrl)
    //get the 200 response
    .then(function (response) {
      return response.json();
    })
    //push the api data into an array
    .then(function (data) {
      geoLocationData.push(data);
    });
  //continue once there is data
  await rslt;
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

function weatherData(event) {
  event.preventDefault();

  //get the users input using jquery
  selectedCity = $(".city_input").val();
  //use the geolocation API to retrive longitude and latitude
  getGeoLocationData();
  $(".city_input").val("");
  console.log(selectedCity);

  //updates search history for the cities
  updateCityHistory();
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
