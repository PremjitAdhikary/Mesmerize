let canvas;

let choice_hostel;
let choice_four_fw;
let choice_five_fw;

let bg_img;
let h4_img;
let h5_img;
let h4_boarders_img;
let h5_boarders_img;

let h4_tl_x = 115;
let h4_tl_y = 6;
let h5_tl_x = 6;
let h5_tl_y = 432;

let img_dx;
let img_dy;
let img_x;
let img_y;
let translation_frames = 35;

let allParticles;

let longSoundPool;
let shortSoundPool;

function preload() {
  bg_img = loadImage('img/diwali-bg.png');
  h4_img = loadImage('img/diwali-h4.png');
  h5_img = loadImage('img/diwali-h5.png');
  h4_boarders_img = loadImage('img/diwali-h4-b.png');
  h5_boarders_img = loadImage('img/diwali-h5-b.png');

  longSoundPool = new SoundPool("./audio/long-explosion.wav", 30);
  shortSoundPool = new SoundPool("./audio/short-explosion.wav", 40);
}

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  img_dx = (115 - 6) / translation_frames;
  img_dy = (432 - 6) / translation_frames;
  img_x = choice_hostel == 1 ? h4_tl_x : h5_tl_x;
  img_y = choice_hostel == 1 ? h4_tl_y : h5_tl_y;
  allParticles = [];
}

function draw() {
  background(0);
  updateImgXY();
  image(bg_img, 0, 0, width, height, img_x, img_y, width, height);
  if (img_x == h4_tl_x)
    image(h4_img, 0, 0, width, height, img_x, img_y, width, height);
  if (img_x == h5_tl_x)
    image(h5_img, 0, 0, width, height, img_x, img_y, width, height);
  image(h4_boarders_img, 0, 0, width, height, img_x, img_y, width, height);
  image(h5_boarders_img, 0, 0, width, height, img_x, img_y, width, height);

  allParticles.forEach(p => p.show(img_x, img_y));
  clearParticles();
}

function updateImgXY() {
  if (choice_hostel == 1) {
    if (img_x < h4_tl_x) {
      img_x += img_dx;
      img_y -= img_dy;
    } else {
      img_x = h4_tl_x;
      img_y = h4_tl_y;
    }
  } else {
    if (img_x > h5_tl_x) {
      img_x -= img_dx;
      img_y += img_dy;
    } else {
      img_x = h5_tl_x;
      img_y = h5_tl_y;
    }
  }
}

const fireFuncMap = new Map();
fireFuncMap.set(11, firePhuljhari);
fireFuncMap.set(12, fireRedPhuljhari);
fireFuncMap.set(13, fireMultiColoredPhuljhari);
fireFuncMap.set(21, fireRocket);
fireFuncMap.set(22, fireLadi);
fireFuncMap.set(23, fireFlowerPot);
fireFuncMap.set(24, startBattleOfBlocks);
fireFuncMap.set(25, startAruPachta);

function fire() {
  let choice = choice_hostel*10 + (choice_hostel == 1 ? choice_four_fw : choice_five_fw);
  fireFuncMap.get(choice)();
}

function fireRedPhuljhari() {
  firePhuljhari([SketchColor.red().stringify()]);
}

function fireMultiColoredPhuljhari() {
  firePhuljhari([SketchColor.white().stringify(), 
    SketchColor.yellow().stringify(), SketchColor.orange().stringify()]);
}

function firePhuljhari(colors) {
  let loc = random([createVector(455, 170), createVector(472, 162), 
    createVector(490, 163), createVector(504, 168)]);
  if (colors)
    allParticles.push(new Phuljhari(loc.x, loc.y, colors));
  else
    allParticles.push(new Phuljhari(loc.x, loc.y));
}

function terraceRandomLocation() {
  return random([
    createVector(56, 687), createVector(165, 592), createVector(266, 597), 
    createVector(61, 687), createVector(170, 592), createVector(271, 597), 
    createVector(58, 692), createVector(168, 597), createVector(268, 602)
  ]);
}

function fireRocket() {
  let loc = terraceRandomLocation();
  let rocket = new Rocket(loc.x, loc.y);
  rocket.timer = Math.floor(random(45, 60));
  rocket.acceleration = createVector(random(-0.02, 0.02), random(0.05, 0.11));
  rocket.velocity = createVector(0,random(-4, -5));
  rocket.addBomb(bombForRocket(loc.x, loc.y));
  allParticles.push(rocket);
}

function bombForRocket(x, y) {
  let color = random([
    [SketchColor.greenyellow()],
    [SketchColor.red()],
    [SketchColor.orange()],
    [SketchColor.violet()],
    [SketchColor.red(), SketchColor.orange(), SketchColor.yellow()],
    [SketchColor.violet(), SketchColor.skyblue(), SketchColor.blue()]
  ]);
  let bomb = new Bomb(x, y, color);
  bomb.timer = Math.floor(random(50, 70));
  bomb.totalParticles = Math.floor(random(80, 120));
  bomb.particleSize = Math.floor(random(6, 9));
  bomb.soundPool = longSoundPool;
  return bomb;
}

function fireLadi() {
  if (allParticles.some( sp => sp instanceof Ladi )) 
    return;
  let ladi = new Ladi(245, 600, 1000);
  allParticles.push(ladi);
}

function fireFlowerPot() {
  let loc = terraceRandomLocation();
  let pot = new FlowerPot(loc.x, loc.y, 80);
  allParticles.push(pot);
}

function startBattleOfBlocks() {
  if (allParticles.some( sp => sp instanceof RocketBarrage )) 
    return;
  let barrage = new RocketBarrage(Math.floor(random(1400, 1600)));
  allParticles.push(barrage);
}

function startAruPachta() {
  if (allParticles.some( sp => sp instanceof AruPachta )) 
    return;
  allParticles.push(new AruPachta());
}

function clearParticles() {
  allParticles = allParticles.filter( p => !p.isOver() );
}

function setBus(bus) {
  bus.register("ControlDSch", e => {
    choice_hostel = e.detail.choice_hostel;
    updateImgXY();
  });
  bus.register("ControlDSc4fw", e => choice_four_fw = e.detail.choice_four_fw);
  bus.register("ControlDSc5fw", e => choice_five_fw = e.detail.choice_five_fw);
  bus.register("ControlDSfb", () => fire());
}

function setData(d) {
  choice_hostel = d.choice_hostel;
  choice_four_fw = d.choice_four_fw;
  choice_five_fw = d.choice_five_fw;
}

class AruPachta {

  constructor() {
    this._timer = 2000;
    this._frequencies = [8, 10, 15, 22, 30];
  }

  show() {
    if (this._timer % this._frequencies[Math.floor(this._timer / 400)] == 0) {
      fireRocket();
    }
    this._timer--;
  }

  isOver() {
    return this._timer <= 0;
  }

}