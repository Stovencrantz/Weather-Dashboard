$(document).ready(function(){
//school key
// var API_KEY = "8988ce4587b71b5353869d036e2f9471"; 
var API_KEY = "8988ce4587b71b5353869d036e2f9471";

//Converts our temp value (in K) from our API, and converts it (to F) for our page
function KtoF(kelvin){
    var temp = Math.round((kelvin-273.15)*(9/5)+32);
    return temp; 
}

//Creates 
function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year; 
    // console.log("Todaysdate is: " + time);
    return time;
  }
  

//function for populating todays weather
function todayWeather(){
    //grab user input
    var city = $("#citySearch").val().toLowerCase()
    var state = $("#stateSearch").val().toUpperCase();
    state = "US-" + state;
    var location = city + " " + state;
    console.log("---------------------------------------------------------------");
    console.log(location);

    var weatherDataURL = "http://api.openweathermap.org/data/2.5/weather?q="+ city + "," + state +"&appid=" + API_KEY;
    console.log(weatherDataURL);
    $.ajax({
        url: weatherDataURL,
        method: "GET"
    }).then(function(response){
        console.log(response);

        //grab our search location
        state = state.split("-");
        var location = $(".locationDiv").append(city.toUpperCase(),", ", state[1]);

        $(".currentDateDiv").text(timeConverter(response.dt));

        //grab the elements that will store our weather data
        var tempVal = KtoF(response.main.temp);
        var dayTempEl = $(".tempVal").text(" " + tempVal + "°F");


        var humidityValEl = $(".humidityVal").text(response.main.humidity + "%");
        var windSpeedValEl = $(".windSpeedVal").text(response.wind.speed);
        //create the src link to display the icon code as an image
        var iconCode = response.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
        //append the icon link to the src attribute of our icon element in html
        $("#todayWicon").attr('src', iconURL);

        //append temp value to our temp element

        //creating a url link that will give us uvIndex data when we parse lat and lon
        var uvIndexURL = "http://api.openweathermap.org/data/2.5/uvi?appid="+ API_KEY + "&lat="+response.coord.lat+"&lon=" + response.coord.lon;
        //Ajax call to the portion of openweathermap API 
        $.ajax({
            url: uvIndexURL,
            method: "GET"
        }).then(function(response){
            console.log(response);
            var uvIndexVal = response.value;
            var uvIndexColor = "";
            //UV index color scales:
            //8-10+ = red for very high
            if(uvIndexVal >= 8){
                uvIndexColor = "red";
            }
            //6-7 = orange for high
            else if(uvIndexVal < 8 && uvIndexVal >= 6){
                uvIndexColor = "orange";
            }
            //3-5 = yellow for moderate
            else if(uvIndexVal < 6 && uvIndexVal >= 3){
                uvIndexColor = "yellow";
            }
             //0-2 = green for low
            else{
                uvIndexColor = "green";
            }

            var uvIndexValEl = $(".uvIndexVal").css("background-color",uvIndexColor).text(response.value);
        })
    })
}

//This function populates our weather for the future five days
function fiveDayWeather(){
    var city = $("#citySearch").val().toLowerCase()
    var state = $("#stateSearch").val().toUpperCase();
    state = "US-" + state;
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q="+ city +","+ state +"&appid="+ API_KEY;
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);

        //fill a day card with infromation, then move to the next card and populate that
        var numDays = 6;
        //40 total indexs with each [4] being 12hr interval  and [8] being 24 hr interval
        //we start at index 4, which is noon, thus we will display wheather data every noon hour
        var index = 4;
        for (var i = 1; i < numDays; i++){
            //dynamic date
            var dateVar = "#currentDateDiv-" + i;
            var dayDateEl = $(dateVar).text(timeConverter(response.list[index].dt));

            //dynamic icon
            var iconVar = "#fiveDayWicon-" + i;
            var iconCode = response.list[index].weather[0].icon;
            var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
            var iconEl = $(iconVar).attr("src", iconURL);

            //dynamimc temp
            var tempVar = "#tempDiv-" + i;
            var tempVal = KtoF(response.list[index].main.temp);
            var dayTempEl = $(tempVar).text(" " + tempVal + "°F");

            //dynamic humidity
            var humidityVar = "#humidityDiv-" + i;
            var humidityEl = $(humidityVar).text(" " + response.list[index].main.humidity + "%")
            
            //increment 24 hours between each data population
            index = index + 8;
        }
    })

}

$("#searchBtn").on("click", function(){
    event.preventDefault();
    todayWeather();
    fiveDayWeather();


})




// add all these conditions for the date to search history aka. local storage
//When user searches a city and state, display: the current date, the location,
// an icon representing current weather conditions, temp(in F), humidity, wind speed, and UV index 
//contain the UV # within a body of color that matches the severity of the UV

//5 day forcast should display: date, icon of weather, temp, and humidity

// If user clicks a previously searched location, display the current weather conditions and future 5 days

//When user refreshes the page, display their last search
})