var APIKey = "85d498a50118be4822a5a08b4629b33a";
var cityEntered = document.querySelector('#cityEntered');
var searchButton = document.querySelector('#searchButton');
var todaysWeather = document.querySelector('#todaysWeather');
var forecastHeader = document.querySelector('#forecastHeader')
var fiveDayForecast = document.querySelector('#fiveDayForecast');
var previousSearch = document.querySelector('#previousSearch');
var previousSearchList = [];
var city;


function citybutton(event){
    event.preventDefault();
    city = cityEntered.value.trim().toLowerCase();
    if(city == ''){
        alert('Please Enter City Name');
        return
    }
    cityName(city);
    
}


function previousButton(event){
    city = event.target.textContent;
    cityName(city);
}

function clearPreviousSearch(){
    fiveDayForecast.innerHTML = '';
    forecastHeader.textContent = '';
    cityEntered.value = '';
    todaysWeather.textContent = '';
}

function cityName(city){

    var geoAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`

    fetch(geoAPI)
        .then(function (response){
            return response.json();
        })
        .then(function (data){
             if(!previousSearchList.includes(city)){
                previousSearchList.push(city);
                window.localStorage.setItem('storedSearches', JSON.stringify(previousSearchList));
                displayPreviousSearch();
            }
            oneCall(data[0].lat, data[0].lon);
        
        })

}

function oneCall(lat,lon){

    var oneCallAPI = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${APIKey}&units=imperial`

    fetch(oneCallAPI)
        .then(function (response){
            return response.json();
        })
        .then(function (data){
            clearPreviousSearch();
            displayToday(data.current, data.daily);
            displayFiveDay(data.daily);
        })
}

function displayFiveDay(data){
    forecastHeader.textContent = '5-Day Forecast';
    for(i=1; i<6; i++){
        var card = document.createElement('div');
        card.setAttribute('class', 'fiveDay');
        card.innerHTML = `<div>
                            <h4>${weekDate(data[i].dt)}</h4>
                            <img src=http://openweathermap.org/img/wn/${data[i].weather[0].icon}@2x.png />
                            <ul class="details">
                                <li>Temp: ${data[i].temp.max} &degF</li>
                                <li>Wind: ${data[i].wind_speed} MPH</li>
                                <li>Humidity: ${data[i].humidity} %</li>
                            </ul>`
        fiveDayForecast.appendChild(card);
    }
}

function displayToday(data){
    var cityCurrentInfo = document.createElement('div');
    var uvColor = getUVColor(data.uvi);
    cityCurrentInfo.innerHTML = `<div class='todaysWeatherDirection'>
                                <h2>${city}</h2>
                                 <img src=http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png />
                                 </div>
                                 <h3>Today's Weather</h3>
                                    <ul class="details">
                                        <li>Temp: ${data.temp} &degF</li>
                                        <li>Wind Speed: ${data.wind_speed} MPH</li>
                                        <li>Humidity: ${data.humidity} %</li>
                                        <li>UV Index: <span class="uvIcon" id='${uvColor}'>${data.uvi}</span></li>
                                    </ul>`
    todaysWeather.append(cityCurrentInfo);

}

function getUVColor(uvIndex){

    if(uvIndex < 2){
        return 'low';
    }
    if(uvIndex < 6){
        return 'medium';
    }
    else{
        return 'high';
    }
}

function weekDate(date){
    return moment.unix(date).format("MM/DD/YYYY");
}

function previousSearches(){ 
    var storedSearches = window.localStorage.getItem("storedSearches")
    if(storedSearches){
        previousSearchList = JSON.parse(storedSearches);
        displayPreviousSearch();
    }
}

function displayPreviousSearch(){
    previousSearch.innerHTML = '';
    for(var i = 0; i < previousSearchList.length; i++){
            var searchLocationLink = document.createElement('li');
            searchLocationLink.textContent = previousSearchList[i];
            previousSearch.appendChild(searchLocationLink);
    }
}

previousSearches();
searchButton.addEventListener('click', citybutton);
previousSearch.addEventListener('click', previousButton);