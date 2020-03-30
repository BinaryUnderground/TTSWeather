

var SpeechRecognition = window.webkitSpeechRecognition;
  
//instruction message for visually impaired users on how to use program
var firstMsg = new SpeechSynthesisUtterance("Hello, this is a web application that informs visually impaired users of weather information, press and hold the button in the middle of the screen and state a city or state or country then let go of the button");
window.speechSynthesis.speak(firstMsg);


// instantiated speech recognition interface
var recognition = new SpeechRecognition();
 // var textbox will hold text for display
var Textbox = document.getElementById('textbox');
const instructions = document.getElementById('instructions');

var Content = '';

recognition.continuous = true;
//holds all values of speech that's been converted to text 
recognition.onresult = function(event) {
 
  var current = event.resultIndex;
 
  var transcript = event.results[current][0].transcript;
 
    Content += transcript;
    document.getElementById('textbox').value = Content;
    var inputVal = document.getElementById('textbox').value;
    weatherBalloon(inputVal);
    
    Content = '';

    
};
//onstart logs to console that it has started 
recognition.onstart = function() { 
    console.log("started")
    document.getElementById('textbox').value = '';

}
//onchange logs to console that textbox has beenchanged
//redundant because textbox is hidden, although might be useful 
//in later iterations of program
Textbox.onchange = function() {
  console.log("changed")
}
//onend logs to console that it has ended
recognition.onspeechend = function() {
    console.log("ended")
    
}
 //onerror logs to console that no speech is being inputted
recognition.onerror = function(event) {
  if(event.error == 'no-speech') {
    instructions.text('Try again.');  
  }
}
 



var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
    //MOBILE FUNCTIONALITY
    document.getElementById('start-btn').addEventListener("touchstart", function (e) {
        if (Content.length) {
            Content += ' ';
        }
        recognition.start();
    });
    document.getElementById('start-btn').addEventListener("touchend", function (e) {

        recognition.stop();
    });
} else {
    //DESKTOP FUNCTIONALITY
    document.getElementById('start-btn').addEventListener("mousedown", function (e) {
        if (Content.length) {
            Content += ' ';
        }
        recognition.start();
    });
    document.getElementById('start-btn').addEventListener("mouseup", function (e) {
        if (Content.length) {
            Content += ' ';
        }
        recognition.stop();
    });
}

// this is the function where the api would be called
function weatherBalloon(cityName) {
    //private api key
    var key = "4583df71a6be113c353d48cc4d720e36";
    fetch(
        //passing the key and city name to url 
        "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + key)
        .then(function (resp) {
            return resp.json();
        }) // Convert data to json
        .then(function (data) {
            drawWeather(data);
        })
        .catch(function () {
            // catch any errors
            var err_message = new SpeechSynthesisUtterance("Invalid city name, please try again.");
            window.speechSynthesis.speak(err_message);
            console.log("invalid city");
        });
} 
//default screen show the weather of New York
window.onload = function () {
    weatherBalloon("New York");
};

//extract the data from the json response file
function drawWeather(d) {
    var fahrenheit = Math.round((parseFloat(d.main.temp) - 273.15) * 1.8 + 32);

    //DOM manipulation to add the data to the html
    document.getElementById("description").innerHTML = d.weather[0].description;
    document.getElementById("temp").innerHTML = fahrenheit + "&deg;";
    document.getElementById("location").innerHTML = d.name;
    var city = d.name;
    var condition = document.getElementById("description").innerHTML;
    var id = d.weather[0].id;

    //customized message according to the weather
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

    //text-to-speech the output
    var to_speak = new SpeechSynthesisUtterance("Today in " + city + "it is " + fahrenheit + "degrees farenheit and " + condition + ". " + moreDetails);
    window.speechSynthesis.speak(to_speak);

    //getting the icons
    var iconcode = d.weather[0].icon;
    var iconurl = "http://openweathermap.org/img/wn/" + iconcode + "@2x.png";
    document.getElementById("wicon").src = iconurl;
}

