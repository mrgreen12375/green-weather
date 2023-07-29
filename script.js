//created api key in open weather
var APIKey = "85d498a50118be4822a5a08b4629b33a";
//setup variables from the ids in html
var cityEntered = document.querySelector('#cityEntered');
var searchButton = document.querySelector('#searchButton');
var todaysWeather = document.querySelector('#todaysWeather');
var forecastHeader = document.querySelector('#forecastHeader')
var fiveDayForecast = document.querySelector('#fiveDayForecast');
var previousSearch = document.querySelector('#previousSearch');
var prev = document.querySelector('.prev');
var clearSearch = document.createElement('button');
//setup array variable to push previous searches into
var previousSearchList = [];
var city;
//created function for the city button to alert if empty or run the city name function when clicked
function citybutton(event){
    event.preventDefault();
    city = cityEntered.value.trim().toLowerCase();
    if(city == ''){
        alert('Please Enter City Name');
        return
    }
    cityName(city);
    
}
//created function for the previous search buttons to reload that city when clicked
function previousButton(event){
    city = event.target.textContent;
    cityName(city);
}
//setup funciton to clear the field for the next searched city
function clearPreviousSearch(){
    fiveDayForecast.innerHTML = '';
    forecastHeader.textContent = '';
    cityEntered.value = '';
    todaysWeather.textContent = '';
}
//created function to pull data from api to push search city into search list and call the oneCall funtion
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
//created function to pull data from api using lat and lon
//first will clear previous search
//then display current day and five day forecast
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
//created function to display five day forcast
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
//created function to display current day forcast
function displayToday(data){
    var cityCurrentInfo = document.createElement('div');
    cityCurrentInfo.innerHTML = `<div class='today'>
                                <div class='todaysWeatherDirection'>
                                <h2>${city}</h2>
                                 <img src=http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png />
                                 </div>
                                 <h3>Today's Weather</h3>
                                    <ul class="details">
                                        <li>Temp: ${data.temp} &degF</li>
                                        <li>Wind Speed: ${data.wind_speed} MPH</li>
                                        <li>Humidity: ${data.humidity} %</li>
                                    </ul>
                                </div>`
    todaysWeather.append(cityCurrentInfo);
}

//created function to display the dated for the five day forcast
function weekDate(date){
    return moment.unix(date).format("MM/DD/YYYY");
}
//created functions to local storage of the previous city searches
function previousSearches(){ 
    var storedSearches = window.localStorage.getItem("storedSearches")
    if(storedSearches){
        previousSearchList = JSON.parse(storedSearches);
        displayPreviousSearch();
    }
}

function displayPreviousSearch(){
    prev.textContent = "Previously Searched";
    prev.setAttribute("style", "display: flex;")
    clearSearch.textContent = "Clear";
    clearSearch.setAttribute("class", "clearButton");
    prev.appendChild(clearSearch);
    previousSearch.innerHTML = '';
    for(var i = 0; i < previousSearchList.length; i++){
            var searchLocationLink = document.createElement('li');
            searchLocationLink.textContent = previousSearchList[i];
            previousSearch.appendChild(searchLocationLink);
    }
}

function clearHighScores() {
    window.localStorage.removeItem('storedSearches');
    window.location.reload();
}
  
clearSearch.addEventListener('click', clearHighScores);
//created event listeners for the search button and previous search buttons
previousSearches();
searchButton.addEventListener('click', citybutton);
previousSearch.addEventListener('click', previousButton);
clearSearch.addEventListener('click', clearHighScores);