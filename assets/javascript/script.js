var searchBtn = $("#search-btn");
var titleEl = $("#searched-city")
var temp = $('#temp');
var wind = $('#wind');
var humidity = $('#humidity');
var fltCond = $('#flt-cond');
var searched = $("#text-in");
var forecastBoxes = $("#forecast-boxes")
var station = 'KATL';


function getWeather () {
    fetch("https://api.checkwx.com/metar/" + station + "/decoded/?x-api-key=add95b072d72452b81e4726333")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(data.data[0]);
            wxData = data.data[0];
            populateWeather(wxData);
            getForecast();
        });
}

function getForecast () {
    fetch("https://api.checkwx.com/TAF" + station + "/decoded/?x-api-key=add95b072d72452b81e4726333")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(data.data[0]);
            fxData = data.data[0];
            populateForecast(fxData)
        });
}


function populateWeather(wxData) {
    titleEl.text(wxData.station.name);
    temp.text("Temperature: " + wxData.temperature.fahrenheit + "°F");
    wind.text("Wind: Heading " + wxData.wind.degrees + "° at " + wxData.wind.speed_kts + " kts");
    humidity.text("Humidity: " + wxData.humidity.percent + "%");
    fltCond.text("Flight Category: " + wxData.flight_category);
    fltCond.removeClass();
    fltCond.addClass(wxData.flight_category);
}

function populateForecast(fxData) {

}

searchBtn.on("click", function() {
    station = searched.val();
    console.log(station);
    getWeather();
});
