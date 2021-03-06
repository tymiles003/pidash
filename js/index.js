// our main widget storage
var widgetDirectory = {};
var widgets = {};

//count time until restart for updates
var restart_count = 0;
var restart_at = 6;
var backgroundImageIndex = 0;

// mains
window.onload = function(){
  //load our widgets
  var html = "";
  for(var w in config.widgets){
    widgets[w] = new Widget(new widgetDirectory[config.widgets[w].widget](config.widgets[w].data));

    html = html + '<i id="widget-' + w + '-icon" class="fas fa-x"></i> <span class="small" id="widget-' + w + '-text"></span>';
  }

  //push the widgets html to the page
  document.getElementById("icons").innerHTML = html;

  //load the DOM elements into our widget array
  for(var w in config.widgets){
    widgets[w].setIconDOM(document.getElementById("widget-" + w + "-icon"));
    widgets[w].setTextDOM(document.getElementById("widget-" + w + "-text"));
  }

  // start the clock. It runs every second
  clock();

  // the quick loop, every 10 seconds
  setInterval(quickloop,1000 * 10);
  quickloop();

  //the regular loop, every 10 minutes
  setInterval(loop,1000 * 60 * 10);
  loop();
}

// every 10 seconds second loop
function quickloop(){
  for(var w in widgets){
    if(widgets[w].control.quickloop){
      widgets[w].control.quickloop(widgets[w].update);
    }
  }
}

// 10 minute loop
function loop(){
  for(var w in widgets){
    if(widgets[w].control.loop){
      widgets[w].control.loop(widgets[w].update);
    }
  }

  restart_count++;
  if(restart_count == restart_at)
    location.reload();

  changeBackgroundImage();
}

function changeBackgroundImage(){
    document.body.style.backgroundImage = "url('" + config.backgroundImages[backgroundImageIndex] + "')";
    backgroundImageIndex++;
    if (backgroundImageIndex >= config.backgroundImages.length) {
        backgroundImageIndex = 0;
    }
}

//our widget class
function Widget(script){
  var DOM_icon = null;
  var DOM_text = null;

  this.update = function(icon,text){
    DOM_text.innerHTML = text;
    DOM_icon.className = icon;
  }

  this.setIconDOM = function(i){
    DOM_icon = i;
  }

  this.setTextDOM = function(i){
    DOM_text = i;
  }

  this.control = script;
}

// our clock
function clock(){
  var hour = 0;
  var min = 0;
  setInterval(timer,1000);
  timer();

  function timer(){
    var date = new Date;

    var hr = date.getHours();
    var min = date.getMinutes();
    var apm = "am";

    if(parseInt(hr) > 12){
      hr = parseInt(hr) - 12;
      apm = "pm";
    }

    if(parseInt(min) == 0){
      min = "0";
    }

    if(String(min).length <= 1){
      min = "0" + min;
    }

    document.getElementById('clock').innerHTML = String(hr) + ":" + String(min) + "<span class='clock-small'> " + ""/*apm*/ + "</span>";
  }
}
