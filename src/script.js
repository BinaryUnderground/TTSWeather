var SpeechRecognition = window.webkitSpeechRecognition;
  
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
 
recognition.onspeechend = function() {
    console.log("ended")
    
}
 
recognition.onerror = function(event) {
  if(event.error == 'no-speech') {
    instructions.text('Try again.');  
  }
}
 

//var startbtn = document.getElementById('start-btn');
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
}

//node.js --->

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');
// Creates a client
const client = new textToSpeech.TextToSpeechClient();
async function quickStart() {

  // The text to synthesize
  const text = 'hello, world!';

  // Construct the request
  const request = {
    input: {text: text},
    // Select the language and SSML voice gender (optional)
    voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
    // select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  await writeFile('output.mp3', response.audioContent, 'binary');
  console.log('Audio content written to file: output.mp3');
}
quickStart();
