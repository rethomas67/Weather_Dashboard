var cityUrl =
  "http://api.openweathermap.org/geo/1.0/direct?q=Atlanta,USA&limit=1&appid=53c5fea2f330bb5e7ac45cffe4100676";
fetch(cityUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    /*console.log(data.data[0]);
    var activities = data.data;
    console.log("id: " + activities[0].id + " name: " + activities[0].name);
    for (var i = 0; i < activities.length; i++) {
      console.log("id: " + activities[i].id + " name: " + activities[i].name);
    }*/
  });
