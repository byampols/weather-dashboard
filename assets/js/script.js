//GLOBAL VARIABLES
var searchFormEl = document.querySelector("#search");
var todayContainerEl = document.querySelector("#today");
var forecastContainerEl = document.querySelector("#forecast-container");
var forecastEl = forecastContainerEl.querySelector("#forecast");
var searchHistoryEl = document.querySelector("#search-history");
var searchHistory = [];

//FUNCTIONS
var todaysForecast = function(forecast,name) {
    //get data
    var todaysDate = moment.unix(forecast.current.dt).format("M/D/YYYY");
    var todaysIcon = forecast.current.weather[0].icon;
    var todaysTemp = forecast.current.temp;
    var todaysWind = forecast.current.wind_speed;
    var todaysHumidity = forecast.current.humidity;
    var todaysUVIndex = forecast.current.uvi;
    //fill out TODAY container
    todayContainerEl.innerHTML="";
    todayContainerEl.classList = "border border-dark bg-secondary text-light";

    var todayDiv = document.createElement("div");
    todayDiv.classList = "mx-3 my-2";
    var todayHeader = document.createElement("h2");
    todayHeader.innerHTML = `${name} (${todaysDate}) <img src="http://openweathermap.org/img/wn/${todaysIcon}@2x.png" />`;
    var todayTemp = document.createElement("p");
    todayTemp.innerHTML = `Temp: ${todaysTemp} &#176 C`;
    var todayWind = document.createElement("p");
    todayWind.innerHTML = `Wind: ${todaysWind} m/s`;
    var todayHumidity = document.createElement("p");
    todayHumidity.innerHTML = `Humidity: ${todaysHumidity}%`
    var todayUV = document.createElement("p");
    var color = "";
    if (todaysUVIndex < 3) {
        color = "badge-success";
    } else if (todaysUVIndex < 6) {
        color = "badge-warning";
    } else if (todaysUVIndex < 8) {
        color = "badge-danger";
    } else {
        color = "badge-dark";
    }
    todayUV.innerHTML = `UV Index: <span class = "badge ${color}">${todaysUVIndex}</span>`;
    //append elements
    todayDiv.appendChild(todayHeader);
    todayDiv.appendChild(todayTemp);
    todayDiv.appendChild(todayWind);
    todayDiv.appendChild(todayHumidity);
    todayDiv.appendChild(todayUV);
    todayContainerEl.appendChild(todayDiv);
};

var printForecast = function(forecast,name) {
    //call function to print today's forecast
    todaysForecast(forecast,name);
    //for loop to print the 5 day forecast
    var dailyForecast = forecast.daily;
    forecastContainerEl.querySelector("h2").textContent = "5-Day Forecast:";
    forecastEl.innerHTML = "";
    for (let i = 1; i<dailyForecast.length - 2; i++) {
        var date = moment.unix(dailyForecast[i].dt).format("M/D/YYYY");
        var icon = dailyForecast[i].weather[0].icon;
        var temp = dailyForecast[i].temp.day;
        var wind = dailyForecast[i].wind_speed;
        var humidity = dailyForecast[i].humidity;

        //create card
        var dayCard = document.createElement("div");
        dayCard.classList = "card text-light bg-dark mb-3";
        //create card header
        var cardHeader = document.createElement("div");
        cardHeader.classList = "card-header text-center";
        cardHeader.innerHTML = `${date}`;
        //create card body
        var cardBody = document.createElement("div");
        cardBody.classList = "card-body bg-secondary text-center";
        
        //create image
        var image = document.createElement("img");
        image.classList = "card-title";
        image.setAttribute("src",`http://openweathermap.org/img/wn/${icon}@2x.png`);
        //create ps
        var tempEl = document.createElement("p");
        tempEl.innerHTML = `Temp: ${temp} &#176 C`;
        var windEl = document.createElement("p");
        windEl.innerHTML = `Wind: ${wind} m/s`;
        var humidityEl = document.createElement("p");
        humidityEl.innerHTML = `Humidity: ${humidity}%`;

        //append elements
        cardBody.appendChild(image);
        cardBody.appendChild(tempEl);
        cardBody.appendChild(windEl);
        cardBody.appendChild(humidityEl);

        dayCard.appendChild(cardHeader);
        dayCard.appendChild(cardBody);

        forecastEl.appendChild(dayCard);
    }
};

var getForecast = function(lat,long,name) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&exclude=minutely,hourly&appid=1474a6ceb86df05129151e5a9bd2c243`;
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                printForecast(data,name);
            })
        } else {
            alert('Error: City not found!');
        }
    });
};

var getCity = function(name) {
    var apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${name}&key=e062f0068b08490f942fbd2edd564afc`
    //e062f0068b08490f942fbd2edd564afc
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var results = data.results[0];
                getForecast(results.geometry.lat,results.geometry.lng,results.formatted);
            })
        } else {
            alert('Error: City not found!');
            return;
        }
    });
};

var printSearchHistory = function() {
    //get history
    searchHistoryEl.innerHTML = "";
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    if (!searchHistory) {
        searchHistory = [];
    }
    //for item in searchHistory, add a button
    for (let i = 0; i < searchHistory.length; i++) {
        var button = document.createElement("button");
        button.classList = "btn btn-secondary w-100 my-2";
        button.innerHTML = `${searchHistory[i].trim()}`;
        searchHistoryEl.appendChild(button);
    }
};

var saveHistory = function(search) {
    if (search === "") {
        return;
    }
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    if (!searchHistory) {
        searchHistory = [];
    }
    searchHistory.unshift(search);
    if (searchHistory.length > 8) {
        searchHistory.pop();
    }
    localStorage.setItem("searchHistory",JSON.stringify(searchHistory));
    printSearchHistory();
};

var historyEventHandler = function(event) {
    if (event.target.type === "submit") {
        var city = event.target.textContent;
        getCity(city);
    }
}

var searchEventHandler = function(event) {
    event.preventDefault();
    var inputEl = event.target.querySelector("#city-name").value;
    event.target.querySelector("#city-name").value = "";
    saveHistory(inputEl);
    getCity(inputEl);
};
//EVENT-LISTENERS
printSearchHistory();
searchFormEl.addEventListener("submit", searchEventHandler);
searchHistoryEl.addEventListener("click", historyEventHandler);