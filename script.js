var SpeechRecognition = window.webkitSpeechRecognition;
  

var firstMsg = new SpeechSynthesisUtterance("Hello, this is a web application that informs visually impaired users of weather information, press and hold the button in the middle of the screen and state a city or state or country then let go of the button");
window.speechSynthesis.speak(firstMsg);



var recognition = new SpeechRecognition();
 
var Textbox = document.getElementById('textbox');
const instructions = document.getElementById('instructions');

var Content = '';

recognition.continuous = true;
 
recognition.onresult = function(event) {
 
  var current = event.resultIndex;
 
  var transcript = event.results[current][0].transcript;
 
    Content += transcript;
    document.getElementById('textbox').value = Content;
    var inputVal = document.getElementById('textbox').value;
    weatherBalloon(inputVal);
    
    Content = '';

    
};
 
recognition.onstart = function() { 
    console.log("started")
    document.getElementById('textbox').value = '';

}
Textbox.onchange = function() {
  
}
recognition.onspeechend = function() {
    console.log("ended")
    
}
 
recognition.onerror = function(event) {
  if(event.error == 'no-speech') {
    instructions.text('Try again.');  
  }
}
 

//var startbtn = document.getElementById('start-btn');
//DESKTOP FUNCTIONALITY
document.getElementById('start-btn').addEventListener("mousedown", function(e) {
    if (Content.length) {
        Content += ' ';
      }
      recognition.start();
});
document.getElementById('start-btn').addEventListener("mouseup", function(e) {
    if (Content.length) {
        Content += ' ';
      }
      recognition.stop();
});

//MOBILE FUNCTIONALITY
document.getElementById('start-btn').addEventListener("touchstart", function(e) {
    if (Content.length) {
        Content += ' ';
      }
      recognition.start();
});
document.getElementById('start-btn').addEventListener("touchend", function(e) {
    
      recognition.stop();
});


function weatherBalloon(cityName) {
    var key = "4583df71a6be113c353d48cc4d720e36";
    fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + key)
        .then(function (resp) {
            return resp.json();
        }) // Convert data to json
        .then(function (data) {
            drawWeather(data);
        })
        .catch(function () {
            // catch any errors
        });
} 


window.onload = function () {
    weatherBalloon("New York");
};

function drawWeather(d) {
    var celcius = Math.round(parseFloat(d.main.temp) - 273.15);
    var fahrenheit = Math.round((parseFloat(d.main.temp) - 273.15) * 1.8 + 32);
    document.getElementById("description").innerHTML = d.weather[0].description;
    document.getElementById("temp").innerHTML = fahrenheit + "&deg;";
    document.getElementById("location").innerHTML = d.name;
    var city = d.name;
    var condition = document.getElementById("description").innerHTML;
    var id = d.weather[0].id;
    if (id >= 200 && id <= 232) {
        var moreDetails = "Thunderstorm Alert!!! You might wanna stay home today.";
    } else if (id >= 300 && id <= 531) {
        var moreDetails = "Do not forget your umbrella.";
    } else if (id >= 600 && id <= 622) {
        var moreDetails = "Stay safe out there. Consider a jacket.";
    } else if (id === 781) {
        var moreDetails = "Stay home";
    } else if (id === 800) {
        var moreDetails = "Have a great day.";
    } else var moreDetails = "";
    var to_speak = new SpeechSynthesisUtterance("Today in "+ city +  "it is "+ fahrenheit + "degrees farenheit and " + condition + "." + moreDetails);
    var iconcode = d.weather[0].icon;
    var iconurl = "http://openweathermap.org/img/wn/" + iconcode + "@2x.png";
    document.getElementById("wicon").src = iconurl;
    
    window.speechSynthesis.speak(to_speak);
}

