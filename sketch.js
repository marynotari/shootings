// TO DO:
// -- put in title and link to source in html
// -- include instructions on hover

let mapImg;
let lat, lon, x, y;
let duration;
let isOverMap;

//arrays for storing the x,y of the ellipses,
//the diameter,
//and booleans if mouse is over or not
let ellipsesX = [];
let ellipsesY = [];
let ellipsesD = [];
let ellipsesOver = [];

function preload() {
  mapImg = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/-98.5795,39.8283,'
                      + zoom
                      + '/1000x600?access_token=pk.eyJ1IjoibWFyeW5vdGFyaSIsImEiOiJjamYwYTRpMjIwbHVzMnlubjF4cmtsY3hlIn0.78W4e4tnr0HjFBA8jxUqgA'
  );
}

//center of USA: 39.8283° N, 98.5795° W
let centerLat = 39.8283; //latitude of where you want the center of map to be
let centerLon = -98.5795; //longitude of where you want the center of map to be

let zoom = 3.3;

// Declare an empty variable for the shootingText to display on hover over ellipses
let texts = [];

// Declare an empty variable to hold createCanvas();
let canvas = null;

// Declare start and stop buttons
let button1 = null;
let button2 = null;

let currentText = null;

//calculate the Web Mercator of both longitude and latitude
//from https://www.youtube.com/watch?time_continue=736&v=ZiYdOwOrGyc
function mercX(lon) {
  lon = radians(lon); //convert the degrees into radians–-p5 uses radians by default
  let a = (256 / PI) * pow(2, zoom);
  let b = lon + PI; //radians
  return a * b;
}

function mercY(lat) {
  lat = radians(lat);
  let a = (256 / PI) * pow(2, zoom);
  let b = tan(PI / 4 + lat / 2);
  let c = PI - log(b);
  return a * c;
}

// Automatically reposition button when window is resized
function windowResized() {
  button1.position(windowWidth/2 - button1.width, windowHeight/2 - button1.height);
}

//BEGIN SETUP-------------------------------------------------------------------------
function setup() {

  // Create canvas and assign it to variable
  canvas = createCanvas(1024, 512);

  // Create Start Button
  button1 = createButton('CLICK HERE TO BEGIN');
  // button1.position(windowWidth/2 - button1.width, 70);
  button1.position(windowWidth/2 - button1.width, windowHeight/2 - button1.height);
  // button1.addClass('button');
  button1.id('startButton');
  button1.mousePressed(startButton);

  //NOTE: Stop Button is in startButton()

  // Style canvas
  canvas.parent('sketch-container');
  canvas.style('z-index', -1);
  canvas.style('display', 'block');

  //draw the map
  translate(width / 2, height / 2);
  imageMode(CENTER); //now 0, 0 corresponds to center of map
  image(mapImg, 0, 0);

}
//END SETUP-------------------------------------------------------------------------

// START BUTTON CALLBACK
function startButton() {

  // Hide Start Button
  button1.hide();

  // BEGIN SOUND-----------------------------------------------------------------------------
  var convolver = new Tone.Convolver("matrix-reverb5.wav").toMaster();

  // Create a piano-like Sound
  var synth = new Tone.Sampler({
    'A0': 'A0.[mp3|ogg]',
    'C1': 'C1.[mp3|ogg]',
    'D#1': 'Ds1.[mp3|ogg]',
    'F#1': 'Fs1.[mp3|ogg]',
    'A1': 'A1.[mp3|ogg]',
    'C2': 'C2.[mp3|ogg]',
    'D#2': 'Ds2.[mp3|ogg]',
    'F#2': 'Fs2.[mp3|ogg]',
    'A2': 'A2.[mp3|ogg]',
    'C3': 'C3.[mp3|ogg]',
    'D#3': 'Ds3.[mp3|ogg]',
    'F#3': 'Fs3.[mp3|ogg]',
    'A3': 'A3.[mp3|ogg]',
    'C4': 'C4.[mp3|ogg]',
    'D#4': 'Ds4.[mp3|ogg]',
    'F#4': 'Fs4.[mp3|ogg]',
    'A4': 'A4.[mp3|ogg]',
    'C5': 'C5.[mp3|ogg]',
    'D#5': 'Ds5.[mp3|ogg]',
    'F#5': 'Fs5.[mp3|ogg]',
    'A5': 'A5.[mp3|ogg]',
    'C6': 'C6.[mp3|ogg]',
    'D#6': 'Ds6.[mp3|ogg]',
    'F#6': 'Fs6.[mp3|ogg]',
    'A6': 'A6.[mp3|ogg]',
    'C7': 'C7.[mp3|ogg]',
    'D#7': 'Ds7.[mp3|ogg]',
    'F#7': 'Fs7.[mp3|ogg]',
    'A7': 'A7.[mp3|ogg]',
    'C8': 'C8.[mp3|ogg]'
  }, {
    baseUrl: 'https://tonejs.github.io/examples/audio/salamander/',
    release: 10
  }).connect(convolver).toMaster();

  // Define the Sound Event
  var shootEvents1 = new Tone.Part(function(time, value) {

    // Map Duration to Total Casualties
    duration = map(value.TOTAL, 1, 610, 0.25, 10);

    // BEGIN VISUAL CANVAS ELEMENTS----------------------------------------------------------

    // Normalize fatality value by making a ratio between current FAT and max FAT (58)
    let normTOTAL = value.FAT / 60

    // Use offset to keep track of how the map and the ellipses are translated
    let offsetX = windowWidth/2;
    let offsetY = windowHeight/2;

    translate(canvas.width/2, canvas.height/2);

    lat = value.LATITUDE;
    lon = value.LONGITUDE;

    // center of map
    let centerX = mercX(centerLon);
    let centerY = mercY(centerLat);

    // center of each circle
    let x = mercX(lon) - centerX; //difference between the center of map and merc'ed geolocation
    let y = mercY(lat) - centerY;

    // diameter of each circle mapped to casualties
    // scaled to a third of original
    // let d = map(value.TOTAL, 3, 605, 1, 201.3);

    //diameter of each circle mapped to fatalities
    let d = map(value.FAT, 3, 58, 5, 96);

    // draw a circle
    noStroke();
    //make the fill of each ellipse get darker/brighter as time goes on
    fill(255, 0, 255, 150);
    ellipse(x, y, d, d); //map size to casualties
    ellipsesX.push(x + width/2);
    ellipsesY.push(y + height/2);
    ellipsesD.push(d);
    ellipsesOver.push(false);

    let date = value.DATE;
    let location = value.LOC;
    let summary = value.SUMMARY;
    let fatalities = value.FAT;
    let injuries = value.INJ;

    // Create a paragraph with the date, location, and summary of each shooting from Shootings.js
    // Push each new paragraph into currentText array to access later
    currentText = createP(date + ' • ' +
                          location + ' • ' +
                          summary + ' ' +
                          fatalities + ' dead, ' +
                          injuries + ' injured');
    texts.push(currentText);

    // Position currentText at the center of each ellipse
    currentText.style('position','absolute');
    // currentText.style('color', '#e2e2e2');
    currentText.style('color', '#b7b7b7');
    currentText.style('font-family', 'Helvetica');
    currentText.id('hiddenText');
    currentText.style('left', offsetX + x + 'px');
    currentText.style('top', offsetY + y + 'px');
    currentText.style("opacity", 0);
    currentText.style('z-index', 1);
    // END VISUAL CANVAS ELEMENTS------------------------------------------------------

    value.CHORD.forEach(note => {
      synth.triggerAttackRelease(note, duration, time, normTOTAL)
    })
  }, Shootings);

  shootEvents1.loop = true;
  shootEvents1.loopStart = Shootings[0].time;
  // shootEvents1.loopStart = Shootings[55].time; //figure out when you want it to start looping (by index)
  shootEvents1.loopEnd = Shootings[Shootings.length - 1].time + 1; //choose a value to pad the duration
  shootEvents1.start(0, 0);


  Tone.Buffer.on('load', function() {
    Tone.Transport.start()
  });
  //END SOUND-------------------------------------------------------------------------

  // Stop button appears after one full loop of the song
  window.setTimeout(function () {
    // Create Stop Button
    button2 = createButton('ENOUGH');
    // position the stop button centered under the map
    button2.position(windowWidth/2 - button2.width, windowHeight/2 + 256 + 20);
    button2.id('stopButton');
    button2.mousePressed(fivecalls);
  }, 95000); //appears after 95 seconds or 95000 milliseconds
}

function showText() {
  // if(currentText.hide()) {
  if(currentText.style('opacity', 0)) {
    currentText.id('showingText');
  }
}

function draw() {

  //NOTE: ellipses are drawn in the Tone.Part callback in Sound.js

  checkHoverOverEllipses();
  displayTextIfHover();

}

function checkHoverOverEllipses() {
  for (let i = 0; i < ellipsesX.length; i++) {
    let distance = dist(mouseX, mouseY, ellipsesX[i], ellipsesY[i]);
    if (distance < 0.5 * ellipsesD[i]) {
      ellipsesOver[i] = true;
      // console.log("ellipse over: " + i);
    } else {
      ellipsesOver[i] = false;
    }
  }
}

function displayTextIfHover() {
  for (let i = 0; i < ellipsesX.length; i++) {
    if (ellipsesOver[i]) {
      //display it
      texts[i].style('opacity', 1);
    } else {
      //hide it
      texts[i].style('opacity', 0);
    }
  }
}

function fivecalls() {
  //click to be led to https://5calls.org/issue/action-against-gun-violence
    // window.location.assign("https://5calls.org/issue/action-against-gun-violence");
    window.location.assign("https://5calls.org/issue/action-against-gun-violence");
}
