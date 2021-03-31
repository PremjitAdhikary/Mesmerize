let canvas;

let bg;
let gun;

let currentHue = 0;
let gunHue = 0;
let gunAmmo = 0;
let gunMaxAmmo = 100;

let colorBucketX = 580;
let colorBucketY = 350;
let colorBucketD = 70;
let fillColorGun = false;
let shootColorGun = false;

let bucketS = 70;
let bucketB = 90;

let blobs = [];

function preload(){
  bg = loadImage('img/bg.png');
  gun = loadImage('img/Gun.png');
}

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  angleMode(DEGREES);
}

function draw() {
  noStroke();
  colorMode(HSB, 100);
  background(92,100);
  drawBlobs();
  image(bg, 0, 0);
  drawColorBucket();
  drawGun();
  
  checkForFillingColorGunAndProcess();
  checkForShootingColorGunAndProcess();
}

function checkForFillingColorGunAndProcess() {
  if (!fillColorGun || gunAmmo >= 100) return;

  gunHue = (gunHue * gunAmmo + currentHue) / (gunAmmo + 1);
  gunAmmo++;
}

function checkForShootingColorGunAndProcess() {
  if (!shootColorGun) return;

  if (gunAmmo > 0)
    gunAmmo--;

  if (gunAmmo <= 0) {
    gunHue = 0;
    shootColorGun = false;
    return;
  }
  
  if (mouseInWhiteBoard()) {
    blobs[blobs.length-1].grow();
  }
}

function drawColorBucket() {
  fill(currentHue, bucketS, bucketB);
  circle(colorBucketX, colorBucketY, colorBucketD);
  if (fillColorGun) return;
  currentHue += 0.25;
  if (currentHue > 100) {
    currentHue = 0;
  }
}

function drawGun() {
  fill(0, 0, 0);
  let gunX = mouseX;
  if (mouseX < 0) gunX = 0;
  if (mouseX > width) gunX = width;
  let gunY = mouseY;
  if (mouseY < 0) gunY = 0;
  if (mouseY > height) gunY = height;
  rect(gunX-2, gunY, 4, 55+gunAmmo/8);
  rect(gunX-5, gunY+55+gunAmmo/8, 10, 4);
  fill(0, 0, 100);
  rect(gunX-5, gunY, 10, 50);
  fill(gunHue, bucketS, bucketB);
  rect(gunX-5, gunY, 10, gunAmmo/2);
  image(gun, gunX-20, gunY-30);
}

function drawBlobs() {
  for (let blob of blobs) {
    blob.show();
  }
}

function mousePressed() {
  if (isMouseOnColorBucket()) {
    fillColorGun = true;
  } else if (mouseInCanvas()) {
    shootColorGun = true;
    if (mouseInWhiteBoard() && gunAmmo > 0) {
      blobs.push(new Blob(gunHue, bucketS, bucketB, mouseX, mouseY));
    }
  }
}

function mouseReleased() {
  if (fillColorGun) {
    fillColorGun = false;
  } else if (shootColorGun) {
    shootColorGun = false;
  }
}

function isMouseOnColorBucket() {
  return mouseX > (colorBucketX-colorBucketD/2) && mouseX < (colorBucketX+colorBucketD/2) 
   && mouseY > (colorBucketY-colorBucketD/2+20) && mouseY < (colorBucketY+colorBucketD/2+20);
}

function mouseInWhiteBoard() {
  return mouseX > 120 && mouseX < 520 && mouseY > (90+20) && mouseY < (390+20);
}