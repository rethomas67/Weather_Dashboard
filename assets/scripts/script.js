//when a user clicks the history data the city forecasts are updated
function updateData() {
  //using the javascript date object for calcs on forecast dates
  var today = new Date();
  date = today.toLocaleDateString();
  //pulling the Api data for the current weather conditions
  var city = currentWeatherData.name;
  var weatherImage = currentWeatherData.weather[0].icon;
  var currentTemp = currentWeatherData.main.temp;
  var currentWind = currentWeatherData.wind.speed;
  var currentHumidity = currentWeatherData.main.humidity;
  //initializing the lookup index to find the city in my array object
  var updateIndex = -1;
  //from the user click on a city find a match in the array
  for (var i = 0; i < weatherResult.length; i++) {
    if (weatherResult[i].city == selectedCity.trim().replace("-", " ")) {
      updateIndex = i;
    }
  }

  //forecast declarations
  var forecastWeatherImage;
  var forecastTemp;
  var forecastWind;
  var forecastHumidity;
  var forecastImg;

  var idx = 0;
  //24hours per day * 60min per hour* 60secper min to milliseconds
  var msPerDay = 24 * 60 * 60 * 1000;
  //#of days to increment
  var day = 1;
  //today's date
  var nextDay = today;

  //40 approx for 3 hour interval data on forecasts
  while (idx < 40) {
    //calc for time starting epoch times 1970 gettime in ms date constructor accepts addDays with this param
    nextDay = new Date(nextDay.getTime() + day * msPerDay);
    idx += 8;
    validIdx = idx;
    //never can hit exactly on 5 days
    if (idx == 40) {
      validIdx = forecastWeatherData.list.length - 1;
    }
    //storing the data from the forecasting API
    forecastImg = forecastWeatherData.list[validIdx].weather[0].icon;
    forecastTemp = forecastWeatherData.list[validIdx].main.temp;
    forecastWind = forecastWeatherData.list[validIdx].wind.speed;
    forecastHumidity = forecastWeatherData.list[validIdx].main.humidity;

    //push this stuff into my own array object
    forecastResult.push({
      date: nextDay.toLocaleDateString(),
      img: forecastImg,
      temp: forecastTemp,
      windspeed: forecastWind,
      humidity: forecastHumidity,
    });
  }

  //updating 5 days of forecasting data into my array object
  for (var i = 0; i < forecastResult.length; i++) {
    weatherResult[updateIndex].forecast[i].date = forecastResult[i].date;
    weatherResult[updateIndex].forecast[i].img = forecastResult[i].img;
    weatherResult[updateIndex].forecast[i].temp = forecastResult[i].temp;
    weatherResult[updateIndex].forecast[i].windspeed =
      forecastResult[i].windspeed;
    weatherResult[updateIndex].forecast[i].humidity =
      forecastResult[i].humidity;
  }

  //update the current forcast into my array object
  weatherResult[updateIndex].longitude = longitude;
  weatherResult[updateIndex].latitude = latitude;
  weatherResult[updateIndex].city = city;
  weatherResult[updateIndex].date = date;
  weatherResult[updateIndex].weatherImage = weatherImage;
  weatherResult[updateIndex].currentTemp = currentTemp;
  weatherResult[updateIndex].currentWind = currentWind;
  weatherResult[updateIndex].currentHumidity = currentHumidity;

  //clear out the temporary forecast array
  forecastResult = [];
  return updateIndex;
}

//adding data to an array object after the search button is clicked
function processData() {
  //forecastResult
  var today = new Date();
  date = today.toLocaleDateString();
  //storing the current forecast data from the API
  var city = currentWeatherData.name;
  var weatherImage = currentWeatherData.weather[0].icon;
  var currentTemp = currentWeatherData.main.temp;
  var currentWind = currentWeatherData.wind.speed;
  var currentHumidity = currentWeatherData.main.humidity;

  //forecast API storage variables
  var forecastWeatherImage;
  var forecastTemp;
  var forecastWind;
  var forecastHumidity;
  var forecastImg;

  //24hours per day * 60min per hour* 60secper min to milliseconds
  var idx = 0;
  //24hours per day * 60min per hour* 60secper min to milliseconds
  var msPerDay = 24 * 60 * 60 * 1000;
  //#of days to increment
  var day = 1;
  //today's date
  var nextDay = today;

  //40 approx for 3 hour interval data on forecasts
  while (idx < 40) {
    //calc for time starting epoch times 1970 gettime in ms date constructor accepts addDays with this param
    nextDay = new Date(nextDay.getTime() + day * msPerDay);
    idx += 8;
    validIdx = idx;
    if (idx == 40) {
      validIdx = idx - 1;
    }
    //storing the API's data to variables on forecasting
    forecastImg = forecastWeatherData.list[validIdx].weather[0].icon;
    forecastTemp = forecastWeatherData.list[validIdx].main.temp;
    forecastWind = forecastWeatherData.list[validIdx].wind.speed;
    forecastHumidity = forecastWeatherData.list[validIdx].main.humidity;
    //push this stuff into my own array object
    forecastResult.push({
      date: nextDay.toLocaleDateString(),
      img: forecastImg,
      temp: forecastTemp,
      windspeed: forecastWind,
      humidity: forecastHumidity,
    });
  }

  //storing the current forecast and 5 day forecast to my own array object
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
  //clear out my temp array
  forecastResult = [];
}

//API call for 5 day forecast weather
async function getForecastWeather(latitude, longitude) {
  //forecast URL with parameters
  var weatherUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&units=imperial&appid=53c5fea2f330bb5e7ac45cffe4100676";

  //Promise for the call I can learn more on this
  rslt = fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      forecastWeatherData = data;
    });
  //waiting for the call to finish
  await rslt;

  //Don't add to the arrays if the call is for an update
  var index;
  if (!bUpdate) {
    processData();
    index = weatherResult.length - 1;
  } else {
    index = updateData();
  }

  //add the current forecast and the 5 day forecast to the page
  populateCurrentWeather(index);
  populateForecastWeather(index);

  //since we're done add the data to local storage- web pages need a string representation
  localStorage.setItem("weatherResultStorage", JSON.stringify(weatherResult));
  //we're clear to make another call to the API's processing is done
  bProcessing = false;
  bUpdate = false;
}

//looping through the 5 day forecasts to present to the user
function populateForecastWeather(index) {
  var forecasts = weatherResult[index].forecast;

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
    //just used for a class name on my web page
    forecastClass = "forecast" + j;
    //indices for forecasts on my array
    date = forecasts[i].date;
    //grab an image with the png code
    img = "https://openweathermap.org/img/wn/" + forecasts[i].img + ".png";
    //unicode for degrees
    temp = forecasts[i].temp + "\u00B0";
    wind = forecasts[i].windspeed + " MPH";
    humidity = forecasts[i].humidity + " %";

    //where am I going to present the forecast data using jquery
    forecastElement = $("." + forecastClass + " .card-body");
    forecastElement.children(".forecast_date").text(date);
    forecastElement.children(".img_forecast").attr("src", img);
    forecastElement.children(".forecast_temp").text(temp);
    forecastElement.children(".forecast_wind").text(wind);
    forecastElement.children(".forecast_humidity").text(humidity);
  }
  $(".forecasts").children().show();
}

//present the current forecast
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

//API call for the current data
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
      //sometimes the API changes the name of the entered city
      currentWeatherData.name = selectedCity.trim();
    });
  //wait for the current forecast
  await rslt;

  getForecastWeather(latitude, longitude);
}

//make the function asynchrounous to wait for the data
async function getGeoLocationData() {
  //the geolocation api url using the dynamic input from the user
  //url encode for spaces between the city
  var cityUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    encodeURIComponent(selectedCity.trim()) +
    "&limit=1&appid=53c5fea2f330bb5e7ac45cffe4100676";

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

//Adds a button with a city to update history
function updateCityHistory() {
  //the new dynamic button creation
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

  //add the element from the string under the cities HTML class
  var cities = $(".cities");
  cities.append(historyElement);

  //make a unique class name for the button
  var classItem = cities.children(".city_item");

  classItem.removeClass("city_item");
  classItem.addClass(selectedCity.trim().replace(" ", "-"));
  buttonItem = classItem.children("button");
  buttonItem.text(selectedCity);
  //add the click event
  $("." + selectedCity.trim().replace(" ", "-")).on("click", updateWeatherData);
}

//start up the API calls
function processAPI() {
  getGeoLocationData();

  //adds to the search history when it's not a request to rerun the API's for the cities
  if (!bUpdate) {
    updateCityHistory();

    $(".city_input").val("");
  }
}

//the search button click event
function weatherData(event) {
  event.preventDefault();
  if (!bProcessing) {
    bProcessing = true;

    bUpdate = false;
    //get the users input using jquery
    selectedCity = $(".city_input").val();
    //use the geolocation API to retrieve longitude and latitude
    processAPI();
  } else {
    alert("Wait until processing has completed");
  }
}

//the historical update click event
function updateWeatherData(event) {
  event.preventDefault();
  if (!bProcessing) {
    bProcessing = true;
    bUpdate = true;
    //get the users input using jquery
    selectedCity = $(this).text();

    //use the geolocation API to retrive longitude and latitude
    processAPI();
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

localStorage.clear();

//click event to process the weather data for the input city
$(".btn_search").on("click", weatherData);

$(".forecasts").children().hide();
$(".img_city").hide();

var weatherResultStorage = JSON.parse(
  localStorage.getItem("weatherResultStorage")
);

if (weatherResultStorage) {
  weatherResultStorage.forEach((item) => {
    weatherResult.push(item);
    var index = weatherResult.length - 1;
    populateCurrentWeather(index);
    populateForecastWeather(index);
    selectedCity = item.city;
    updateCityHistory();
  });
}
