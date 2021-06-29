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
    fetch("https://api.checkwx.com/taf/" + station + "/decoded?x-api-key=add95b072d72452b81e4726333")
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
    for (i = 0; i < 5; i++) {
        forecastBoxes.children().eq(i).children().eq(0).children().eq(0).text(fxData.forecast[i].timestamp.from + " to " + fxData.forecast[i].timestamp.to);

        if (fxData.forecast[i].clouds) {
            forecastBoxes.children().eq(i).children().eq(0).children().eq(1).text(fxData.forecast[i].clouds[0].text + " at " + fxData.forecast[i].clouds[0].feet + "ft");
        } else {
            forecastBoxes.children().eq(i).children().eq(0).children().eq(1).text("Skies Clear");
        }

        if (fxData.forecast[i].conditions) {
            forecastBoxes.children().eq(i).children().eq(0).children().eq(2).text(fxData.forecast[i].conditions[0].text);
        } else {
            forecastBoxes.children().eq(i).children().eq(0).children().eq(1).text("No Forecast Precip");
        }

        if (fxData.forecast[i].wind) {
           forecastBoxes.children().eq(i).children().eq(0).children().eq(3).text(fxData.forecast[i].wind.degrees + "° at " + fxData.forecast[i].wind.speed_kts + " kts");
        } else {
            forecastBoxes.children().eq(i).children().eq(0).children().eq(1).text("No Forecast Wind");
        }

        if (fxData.forecast[i].visibility) {
           forecastBoxes.children().eq(i).children().eq(0).children().eq(4).text(fxData.forecast[i].visibility.miles + " mi");
        } else {
            forecastBoxes.children().eq(i).children().eq(0).children().eq(1).text("No Vis Data");
        }
    }
}

searchBtn.on("click", function() {
    station = searched.val();
    console.log(station);
    getWeather();
});

getWeather();