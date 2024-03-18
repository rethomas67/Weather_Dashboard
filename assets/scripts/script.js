function updateData() {
  alert(selectedCity);
}

function processData() {
  //forecastResult
  var today = new Date();
  date = today.toLocaleDateString();
  var city = currentWeatherData.name;
  var weatherImage = currentWeatherData.weather[0].icon;
  var currentTemp = currentWeatherData.main.temp;
  var currentWind = currentWeatherData.wind.speed;
  var currentHumidity = currentWeatherData.main.humidity;

  var forecastWeatherImage;
  var forecastTemp;
  var forecastWind;
  var forecastHumidity;
  var forecastImg;

  console.log(weatherResult);

  var idx = 0;
  var msPerDay = 24 * 60 * 60 * 1000;
  var day = 1;
  var nextDay = today;

  while (idx < 40) {
    nextDay = new Date(nextDay.getTime() + day * msPerDay);
    idx += 8;
    validIdx = idx;
    if (idx == 40) {
      validIdx = idx - 1;
    }
    forecastImg = forecastWeatherData.list[validIdx].weather[0].icon;
    forecastTemp = forecastWeatherData.list[validIdx].main.temp;
    forecastWind = forecastWeatherData.list[validIdx].wind.speed;
    forecastHumidity = forecastWeatherData.list[validIdx].main.humidity;
    forecastResult.push({
      date: nextDay.toLocaleDateString(),
      img: forecastImg,
      temp: forecastTemp,
      windspeed: forecastWind,
      humidity: forecastHumidity,
    });
  }

  weatherResult.push({
    longitude: longitude,
    latitude: latitude,
    city: city,
    date: date,
    weatherImage: weatherImage,
    currentTemp: currentTemp,
    currentWind: currentWind,
    currentHumidity: currentHumidity,
    forecast: forecastResult,
  });

  forecastResult = [];

  console.log(weatherResult);
}

async function getForecastWeather(latitude, longitude) {
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
  //check for another request to the API's
  if (!bUpdate) {
    processData();
  } else {
    updateData();
  }
  var index = weatherResult.length - 1;
  populateCurrentWeather(index);
  populateForecastWeather(index);
  bProcessing = false;
}

function populateForecastWeather(index) {
  //forecast_date
  //img_forecast
  //forecast_temp
  //forecast_wind
  //forecast_humidity
  var forecasts = weatherResult[index].forecast;
  console.log(index);

  var j;
  var date;
  var img;
  var temp;
  var wind;
  var humidity;

  var forecastElement;
  var forecastClass;

  for (var i = 0; i < forecasts.length; i++) {
    j = i + 1;
    forecastClass = "forecast" + j;
    date = forecasts[i].date;
    console.log(j);
    img = "https://openweathermap.org/img/wn/" + forecasts[i].img + ".png";
    temp = forecasts[i].temp + "\u00B0";
    wind = forecasts[i].windspeed + " MPH";
    humidity = forecasts[i].humidity + " %";

    forecastElement = $("." + forecastClass + " .card-body");
    forecastElement.children(".forecast_date").text(date);
    forecastElement.children(".img_forecast").attr("src", img);
    forecastElement.children(".forecast_temp").text(temp);
    forecastElement.children(".forecast_wind").text(wind);
    forecastElement.children(".forecast_humidity").text(humidity);
  }
  $(".forecasts").children().show();
  //forecast_date
  //img_forecast
  //forecast_temp
  //forecast_wind
  //forecast_humidity
}

function populateCurrentWeather(index) {
  var city = weatherResult[index].city;
  today = weatherResult[index].date;
  var info = city + " (" + today + ")";
  //set span text
  $(".current_city").text(info);
  //set image src attr
  var weatherImage = weatherResult[index].weatherImage;
  var imageUrl = "https://openweathermap.org/img/wn/" + weatherImage + ".png";

  $(".img_city").show();
  $(".img_city").attr("src", imageUrl);
  var currentTemp = "Temp: " + weatherResult[index].currentTemp + "\u00B0";
  $(".current_temperature").text(currentTemp);
  //current_temperature
  //current_windspeed
  var currentWind = "Wind: " + weatherResult[index].currentWind + " MPH";
  $(".current_windspeed").text(currentWind);
  //current_humidity
  var currentHumidity =
    "Humidity: " + weatherResult[index].currentHumidity + " %";
  $(".current_humidity").text(currentHumidity);
}

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
      currentWeatherData = data;
    });
  await rslt;

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
    });
  //continue once there is data

  await rslt;
  latitude = geoLocationData[0].lat;
  longitude = geoLocationData[0].lon;
  getCurrentWeather(latitude, longitude);
}

function updateCityHistory() {
  /*
   */
  //
  var historyElement = `
  <div  
    class="city_item w-75 mb-3 btn-group d-flex text-center text-light rounded-top rounded-bottom"
    role="group"
    >
    
    <button id="btn_history" 
        class="text-dark btn btn-secondary btn-lg btn-block fw-bold"
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
  $("." + selectedCity).on("click", updateWeatherData);
}

function processAPI() {
  getGeoLocationData();

  //adds to the search history when it's not a request to rerun the API's for the cities
  if (!bUpdate) {
    updateCityHistory();

    $(".city_input").val("");
  }
}

function weatherData(event) {
  event.preventDefault();
  if (!bProcessing) {
    bProcessing = true;

    bUpdate = false;
    //get the users input using jquery
    selectedCity = $(".city_input").val();
    //use the geolocation API to retrive longitude and latitude
    processAPI();
  } else {
    alert("Wait until processing has completed");
  }
}

function updateWeatherData(event) {
  alert("a");

  event.preventDefault();
  if (!bProcessing) {
    bProcessing = true;
    bUpdate = true;
    //get the users input using jquery
    selectedCity = $(this).val();
    console.log(selectedCity);
    //use the geolocation API to retrive longitude and latitude
    //processAPI();
  } else {
    alert("Wait until processing has completed");
  }
}

//initialize today's date
var today;

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
var weatherResult = [];
var forecastResult = [];

var bUpdate = false;
var bProcessing = false;

//click event to process the weather data for the input city
$(".btn_search").on("click", weatherData);

$(".forecasts").children().hide();
$(".img_city").hide();

//latitude = geoLocationData.lat;
//long = GeolocationData.lon;

//console.log(currentWeatherData);
