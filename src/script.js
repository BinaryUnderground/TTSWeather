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
    document.getElementById('textbox').value= Content;
  
};
 
recognition.onstart = function() { 
    console.log("started")
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


