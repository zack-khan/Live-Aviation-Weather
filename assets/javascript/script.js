const searchBtn = $("#search-btn");
const titleEl = $("#searched-city")
const temp = $('#temp');
const wind = $('#wind');
const humidity = $('#humidity');
const visibility = $('#visibility');
const altSetting = $('#altSetting');
const fltCond = $('#flt-cond');
const searched = $("#text-in");
const forecastBoxes = $("#forecast-boxes")
let station = '';
const historyList = $('#history');
let stations = [];

// localStorage.setItem('Airports', JSON.stringify(stations));

async function getWeather () {
    let res = await fetch(`https://api.checkwx.com/metar/${station}/decoded/?x-api-key=add95b072d72452b81e4726333`);
    let wxData = await res.json();
    wxData = wxData.data[0];

    populateWeather(wxData);
    getForecast();
}

async function getForecast () {

    let res = await fetch(`https://api.checkwx.com/taf/${station}/decoded?x-api-key=add95b072d72452b81e4726333`);

    let fxData = await res.json();
    fxData = fxData.data[0];

    // fxData ? populateForecast(fxData) : clearForecast()

    populateForecast(fxData);
}


function populateWeather(wxData) {
    if (wxData) {
        wxData.station.name ? titleEl.text(wxData.station.name + " (" + wxData.icao + ")") : titleEl.text(`No Live Data Found!`);
        wxData.temperature ? temp.text("Temperature: " + wxData.temperature.fahrenheit + "°F") : temp.text("Temperature:");
        wxData.wind ? wind.text("Wind: " + wxData.wind.degrees + "° at " + wxData.wind.speed_kts + " kts") : wind.text("Wind:");
        wxData.humidity ? humidity.text("Humidity: " + wxData.humidity.percent + "%") : humidity.text("Humidity:");
        wxData.visibility ? visibility.text(`Visibility: ${wxData.visibility.miles} mi`) : visibility.text(`Visibility:`);
        wxData.barometer ? altSetting.text(`Altimeter Setting: ${wxData.barometer.hg} mmHg`) : altSetting.text(`Altimeter Setting:`);
        if (wxData.flight_category) {
            fltCond.text("Flight Category: " + wxData.flight_category);
            fltCond.removeClass();
            fltCond.addClass(wxData.flight_category);
        } else {
            fltCond.text("Flight Category:");
            fltCond.removeClass();
        }
    }
    
}

function populateForecast(fxData) {
    for (i = 0; i < 5; i++) {
        if (fxData) {
            if (fxData.forecast[i]) {
                if (fxData.forecast[i].timestamp.from) {
                    forecastBoxes.children().eq(i).children().eq(0).children().eq(0).text(fxData.forecast[i].timestamp.from + " to " + fxData.forecast[i].timestamp.to);
                }
                if (fxData.forecast[i].clouds) {
                    if (fxData.forecast[i].clouds[0].text.includes("Clear")) {
                        forecastBoxes.children().eq(i).children().eq(0).children().eq(1).text(fxData.forecast[i].clouds[0].text);
                    } else {
                        forecastBoxes.children().eq(i).children().eq(0).children().eq(1).text(fxData.forecast[i].clouds[0].text + " at " + fxData.forecast[i].clouds[0].feet + "ft");
                    }
                } else {
                    forecastBoxes.children().eq(i).children().eq(0).children().eq(1).text("No Cloud Forecast");
                }

                if (fxData.forecast[i].conditions) {
                    forecastBoxes.children().eq(i).children().eq(0).children().eq(2).text(fxData.forecast[i].conditions[0].text);
                } else {
                    forecastBoxes.children().eq(i).children().eq(0).children().eq(2).text("No Forecast Precip");
                }

                if (fxData.forecast[i].wind) {
                forecastBoxes.children().eq(i).children().eq(0).children().eq(3).text(fxData.forecast[i].wind.degrees + "° at " + fxData.forecast[i].wind.speed_kts + " kts");
                } else {
                    forecastBoxes.children().eq(i).children().eq(0).children().eq(3).text("No Forecast Wind");
                }

                if (fxData.forecast[i].visibility) {
                forecastBoxes.children().eq(i).children().eq(0).children().eq(4).text("Visibility: " + fxData.forecast[i].visibility.miles + " mi");
                } else {
                    forecastBoxes.children().eq(i).children().eq(0).children().eq(4).text("No Vis Data");
                }
            } else {
                forecastBoxes.children().eq(i).children().eq(0).children().eq(0).text("No Forecast Data");
                forecastBoxes.children().eq(i).children().eq(0).children().eq(1).text("");
                forecastBoxes.children().eq(i).children().eq(0).children().eq(2).text("");
                forecastBoxes.children().eq(i).children().eq(0).children().eq(3).text("");
                forecastBoxes.children().eq(i).children().eq(0).children().eq(4).text("");
            }
        } else {
            forecastBoxes.children().eq(i).children().eq(0).children().eq(0).text("No Forecast Data");
            forecastBoxes.children().eq(i).children().eq(0).children().eq(1).text("");
            forecastBoxes.children().eq(i).children().eq(0).children().eq(2).text("");
            forecastBoxes.children().eq(i).children().eq(0).children().eq(3).text("");
            forecastBoxes.children().eq(i).children().eq(0).children().eq(4).text("");
        }
    }
}

function addToHistory () {
    let exists = false;
    stations = JSON.parse(localStorage.getItem('Airports'));
    // console.log(stations);
    if (stations) { 
        stations.forEach(stationListItem => station == stationListItem ? exists = true : null); // Check if entered station already exists in history list
    } else {
        exists = false;
        stations = [];
    }

    if (!exists) {
        stations.push(station);
        localStorage.setItem('Airports', JSON.stringify(stations));

        historyList.prepend('<button class="text-center text-xl rounded-sm w-full mb-1" type="button"></button>');
        historyList.children().first().text(station);
        historyList.children().on("click", function() {
            // console.log(this);
            let buttonClicked = $(this);
            station = buttonClicked.text();

            // console.log(station);
            searched.val(station); // Sets input text to clicked button
            getWeather();
        });
    }
}

window.onload = (e) => {
    stations = JSON.parse(localStorage.getItem("Airports"));

    if (stations) {
        stations.forEach(stationInList => {
            historyList.prepend('<button class="text-center text-xl bg-gray-400 rounded-sm w-full hover:bg-gray-500 mb-1" type="button"></button>');
            historyList.children().first().text(stationInList);
            historyList.children().on("click", function() {
                // console.log(this);
                let buttonClicked = $(this);
                station = buttonClicked.text();

                // console.log(station);
                searched.val(station); // Sets input text to clicked button
                getWeather();
            });
        })
    }
}

searchBtn.on("click", function() {
    station = searched.val().trim();
    station = station.toUpperCase();

    if (station.length !== 4) {
        // Do nothing
    } else {
        addToHistory();
        getWeather();
    }
});

searched.on("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        searchBtn.click();
    }
});
