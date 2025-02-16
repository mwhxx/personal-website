let numLines = 50;   
let amp = 110;
let mod1 = 10;
let mod2 = -0.049;
let twist = 0.385;        
let shapegap = 30;
let rotateCanvas = 0;
let scroll = 0.38;
let startHue = 200;
let endHue = 260;
let numSteps = 10;
let spriteSeedX, spriteSeedY;
let seeds = [];
let walkers = [];
const TWO_PI = Math.PI * 2;
const PI = Math.PI;
var xmotion = 0;
var ymotion = 0;
let rx = 0;
let ry = 0;
let ax = 0;
let ay = 0;
var iter = 0;
let strokeColor = { h: 200, s: 100, b: 100, a: 8 };
//
function rF1(x, y) { return { x: x / 2, y: y / 2 }; }
function rF2(x, y) { return { x: (width / 32 + x) / 2, y: (height / 2 + y) / 1.5 }; }
function rF3(x, y) { return { x: (width / 8 + x) / 1.25, y: y / 2 }; }
function rF4(x, y) { return { x: (width / 16 + x) / 1.75, y: (height / 4 + y) / 1.3 }; }
function rF5(x, y) { return { x: (width / 12 + x) / 1.6, y: (height / 3 + y) / 1.4 }; }
function rF6(x, y) { return { x: (width / 20 + x) / 1.9, y: (height / 5 + y) / 1.25 }; }
function rF7(x, y) { return { x: (x * 0.8 + width / 10), y: (y * 0.7 + height / 10) }; }
function rF8(x, y) { return { x: (x * 0.6 + width / 5), y: (y * 0.5 + height / 5) }; }
function rF9(x, y) { return { x: (x * 0.9 + width / 15), y: (y * 0.85 + height / 15) }; }
//
function aF1(x, y) { return { x: x, y: y }; }
function aF2(x, y) { return { x: (0.25 + x) / 2, y: y / 8 }; }
function aF3(x, y) { return { x: (1 + x), y: y }; }
function aF4(x, y) { return { x: (x + 0.1) / 1.2, y: (y + 0.1) / 1.5 }; }
function aF5(x, y) { return { x: (x - 0.15) * 1.1, y: (y + 0.05) * 1.2 }; }
function aF6(x, y) { return { x: (x + 0.05) * 1.3, y: (y - 0.1) * 1.4 }; }
function aF7(x, y) { return { x: (x * 0.9 + 0.1), y: (y * 0.8 + 0.05) }; }
function aF8(x, y) { return { x: (x * 1.1 - 0.05), y: (y * 0.95 + 0.02) }; }
function aF9(x, y) { return { x: (x * 1.2 + 0.15), y: (y * 1.1 - 0.05) }; }
//
var rFuns = [rF1, rF2, rF3, rF4, rF5, rF6, rF7, rF8, rF9];
var aFuns = [aF1, aF2, aF3, aF4, aF5, aF6, aF7, aF8, aF9];

function setup() {
  const cnv = createCanvas(windowWidth, 700);
  cnv.parent('sketch-container');
  background(0);
  for (let i = 0; i < 100; i++) {
    let w = new Walker(
      random(width), 
      random(height), 
      (i + 1) / 5, 
      2.5 * i
    );
    walkers.push(w);
  }
  spriteSeedX = random(1000);
  spriteSeedY = random(1000);
  for (let i = 0; i < numLines; i++) {
    seeds.push({ x: random(1000), y: random(1000) });
  }
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  frameRate(60);
}

function draw() {
  let t = millis() / 1000;
  for (let stepCount = 0; stepCount < numSteps; stepCount++) {
    for (let i = 0; i < walkers.length; i++) {
      walkers[i].step();
      walkers[i].render();
    }
  }
  blendMode(ADD);
  let spriteX = map(noise(t * 0.1 + spriteSeedX), 0, 1, 0, width);
  let spriteY = map(noise(t * 0.1 + spriteSeedY), 0, 1, 0, height);
  let spritePos = createVector(spriteX, spriteY);
  push();
    translate(spritePos.x, spritePos.y);
    rotate(rotateCanvas * -TWO_PI);
    scale(0.5);
    let numPoints = 20;  // num of shapes per liquid line
    for (let i = 0; i < numLines; i++) {
      push();
        let offsetX = map(noise(t * 2.3 + seeds[i].x), 0, 1, -50, 50);
        let offsetY = map(noise(t * 2.3 + seeds[i].y), 0, 1, -50, 50);
        translate(offsetX, offsetY);
        rotate(-TWO_PI * twist * i);
        for (let j = 0; j < numPoints; j++) {
          let tt = map(j, 0, numPoints - 1, -0.5, 0.5);
          let innerVal = sin(tt + i * mod1 + scroll * TWO_PI);
          let displacement = sin(innerVal * amp + (mod2 / 0.3 * PI) * tt / 6.0);
          let x = tt * shapegap;
          let y = displacement * shapegap;
          let hueVal = lerp(startHue, endHue, j / (numPoints - 1));
          fill(hueVal, 180, 100, 10);
          rect(x, y, 9, 9);
          ellipse(x, y, 7, 7);
        }
      pop();
    }
  pop();
  blendMode(BLEND);
  //
  strokeColor.h = map(sin(frameCount * 0.01), -1, 1, 200, 210);
  strokeColor.s = map(sin(frameCount * 0.015), -1, 1, 20, 40);
  strokeColor.a = map(sin(frameCount * 0.02), -1, 1, 5, 25); 
  blendMode(ADD);
  drawTopLayer();
  drawTopLayer();
  blendMode(BLEND);
}

class Walker {  
  constructor(xpos, ypos, stepSz, c) {
    this.x = xpos;
    this.y = ypos;
    this.lx = xpos;
    this.ly = ypos;
    this.stepSz = stepSz;
    this.c = c;
  }
  //
  step() {
    let flip = floor(random(0, 4));
    if (flip === 0) {
      this.x += this.stepSz;
    } else if (flip === 1) {
      this.x -= this.stepSz;
    } else if (flip === 2) {
      this.y += this.stepSz;
    } else if (flip === 3) {
      this.y -= this.stepSz;
    }
    this.x = (this.x + width) % width;
    this.y = (this.y + height) % height;
  }
  //
  render() {
    noStroke();
    fill(0);
    rect(this.x, this.y, this.stepSz, this.stepSz);
    this.lx = this.x;
    this.ly = this.y;
  }
}


function drawTopLayer() {
  for (let i = 0; i < 5000; i++) { 
    let index1 = floor(random(0, 9));
    let r = rFuns[index1](rx, ry);
    rx = r.x;
    ry = r.y;
    //
    let a = aFuns[(index1 + 1) % aFuns.length](ax, ay);
    ax = a.x;
    ay = a.y;
    //
    let inputX = (rx + 0.5 * ax) * 0.01 + xmotion; 
    let inputY = (ry + 0.5 * ay) * 0.01 + ymotion;
    let nx = noise(inputX);
    let ny = noise(inputY);
    let x = map(nx, 0, 1, -width * 0.4, width * 1.4); 
    x = x < 0 ? width + (x % width) : x % width;
    let y = map(ny, 0, 1, -height * 0.4, height * 1.4);
    y = y < 0 ? height + (y % height) : y % height;
    stroke(strokeColor.h, strokeColor.s, strokeColor.b, strokeColor.a);
    point(x, y);
  }
  xmotion += 0.06;
  ymotion += 0.06;
}

function windowResized() {
  resizeCanvas(windowWidth, 700);
  background(0); // Optional: Reset background on resize
}
