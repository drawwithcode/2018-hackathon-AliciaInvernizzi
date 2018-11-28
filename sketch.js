var mySong;
var dim;
var myTitle;

var analyzer;

var xspacing = 5;     // Distance between each horizontal location
var w;                // Width of entire wave
var theta = 0.0;      // Start angle at 0
var amplitude;        // Height of wave
var period = 200.0;   // How many pixels before the wave repeats
var dx;               // Value for incrementing x
var yvalues;

function preload(){
  // put preload code here
  mySong = loadSound("./assets/bojack.mp3");
  myTitle = loadImage("./assets/title.png");
}

function setup() {
  // put setup code here
  frameRate(20);
  angleMode(DEGREES);

  createCanvas(windowWidth, windowHeight);

  mySong.play();

  w = windowWidth;
  dx = (TWO_PI / period) * xspacing;
  yvalues = new Array(floor(w/xspacing));

  //stuffs for gradient
  dim = width/4;
  colorMode(RGB, 255, 255, 255);
  noStroke();
  ellipseMode(RADIUS);

  //volume stuffs
  analyzer = new p5.Amplitude();
  analyzer.setInput(mySong);
}

function draw() {
  // put drawing code here
  background('#5269b7');

  //volume stuffs
  volume = analyzer.getLevel();
  volume = map(volume,0,1,0,windowHeight);

  calcWave();
  renderWave();
  rectMode();
  mySong.amp(1);

  if (frameCount > 350) {
  ellipseMode(CENTER);
  fill(lerpColor(color('#F6ABCD'),color('#56B7BF'),frameCount/600));
  ellipse(windowWidth/2, windowHeight/2, frameCount/2);
  }

  //gradient
  for (var x = 0; x <= width; x+=dim) {
    drawGradient(x, height/2);
  }

  if (frameCount > 110) {
  //image
  push();
  imageMode(CENTER);
  translate(windowWidth/2,windowHeight/2);
  rotate(frameCount);
  image(myTitle, 0, 0, myTitle.width/3, myTitle.height/3);
  pop();
  }

  //arc in the corners
  if (frameCount > 270 ) {
    fill(lerpColor(color('#56B7BF'),color('#F6ABCD'),frameCount/600));
    noStroke();
    arc(200, 200, volume, volume, 0, frameCount/2, PIE);
    arc(windowWidth-200, windowHeight-200, volume, volume, 0, frameCount/2, PIE);
    arc(windowWidth-200, 200, volume, volume, 0, frameCount/2, PIE);
    arc(200, windowHeight-200, volume, volume, 0, frameCount/2, PIE);
  }

  //frameCount
  // fill(255);
  // text(frameCount, 500, 100);

}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function drawGradient(x, y) {
  var radius = dim/2;
  var h = random(0, 255);
  for (var r = radius; r > 0; --r) {
    fill(h,105,183);
    ellipse(windowWidth/2, windowHeight/2, r, r);
    h = (h + 1) % 82;
  }
}


function calcWave() {

  var volume = analyzer.getLevel();
  console.log(volume);
  volume = map(volume,0,1,50,width/2);

  // Increment theta (try different values for
  // 'angular velocity' here)
  theta += volume/3;

  // For every x value, calculate a y value with sine function
  var x = theta;
  for (var i = 0; i < yvalues.length; i++) {
    yvalues[i] = sin(x)*volume/3;
    x+=dx;
  }
}


function renderWave() {
  noStroke();
  fill(255);
  // A simple way to draw the wave with an ellipse at each location
  for (var x = 0; x < yvalues.length; x++) {
    ellipse(x*xspacing, height/2+yvalues[x], 2);
  }
}
