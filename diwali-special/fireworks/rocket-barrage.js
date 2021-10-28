class RocketBarrage extends FwParticle {

  constructor(timer) {
    super(0, 0);
    this._timer = timer;
    this._rockets = [];
  }

  show(envX, envY) {
    if (this._timer > 0 && this._timer % 3 == 0) {
      this.fireRocket(random([
        RocketBarrage.NE1, RocketBarrage.NE2, RocketBarrage.NE3, 
        RocketBarrage.SE1, RocketBarrage.SE2, RocketBarrage.SE3, 
        RocketBarrage.S1, RocketBarrage.S2, RocketBarrage.S3, 
        RocketBarrage.SW1, RocketBarrage.SW2, RocketBarrage.SW3, 
        RocketBarrage.N1, RocketBarrage.N2, RocketBarrage.N3, 
        RocketBarrage.NW1, RocketBarrage.NW2, RocketBarrage.NW3
      ]));
    }
    this._rockets.forEach( r => r.show(envX, envY) );
    this._timer--;
  }

  isOver() {
    return this._timer <= 0 && this._rockets[this._rockets.length - 1].isOver();
  }

  fireRocket(data) {
    let rocket = new Rocket(data.x, data.y);
    rocket.timer = data.timer();
    rocket.acceleration = data.acc();
    rocket.velocity = data.vel();
    rocket.addBomb(this.bombForRocket(data.x, data.y));
    this._rockets.push(rocket);
  }
  
  bombForRocket(x, y) {
    let color = random([
      [SketchColor.yellow()],
      [SketchColor.orange()]
    ]);
    let bomb = new Bomb(x, y, color);
    bomb.timer = Math.floor(random(10, 15));
    bomb.totalParticles = Math.floor(random(15, 20));
    bomb.particleSize = 3;
    bomb.particleTrailSize = 3;
    if (random(100) > 50)
      bomb.soundPool = shortSoundPool;
    return bomb;
  }

}

RocketBarrage.NE1 = {
  x: 43, y: 808,
  timer: () => Math.floor(random(45, 50)),
  acc: () => createVector(random(-0.02, 0.02), random(0.02, 0.03)),
  vel: () => createVector(random(2, 3.5), random(-3, -4))
};

RocketBarrage.NE2 = {
  x: 71, y: 768,
  timer: () => Math.floor(random(30, 35)),
  acc: () => createVector(random(-0.04, 0.04), random(0.02, 0.03)),
  vel: () => createVector(random(2.5, 4), random(-3, -4))
};

RocketBarrage.NE3 = {
  x: 88, y: 709,
  timer: () => Math.floor(random(30, 35)),
  acc: () => createVector(random(-0.02, 0.02), random(0.02, 0.03)),
  vel: () => createVector(random(4, 5), random(-2, -3))
};

RocketBarrage.SE1 = {
  x: 43, y: 808,
  timer: () => Math.floor(random(20, 25)),
  acc: () => createVector(random(-0.02, -0.09), random(0.1, 0.2)),
  vel: () => createVector(random(2, 6), random(2, 3))
};

RocketBarrage.SE2 = {
  x: 71, y: 768,
  timer: () => Math.floor(random(30, 35)),
  acc: () => createVector(random(-0.1, -0.2), random(0.1, 0.2)),
  vel: () => createVector(random(1.5, 4.5), random(2, 3))
};

RocketBarrage.SE3 = {
  x: 88, y: 709,
  timer: () => Math.floor(random(35, 40)),
  acc: () => createVector(random(-0.1, -0.2), random(0.1, 0.2)),
  vel: () => createVector(random(1.5, 4.5), random(2, 3))
};

RocketBarrage.SW1 = {
  x: 172, y: 636,
  timer: () => Math.floor(random(45, 50)),
  acc: () => createVector(random(-0.02, 0.02), random(-0.02, -0.03)),
  vel: () => createVector(random(-1.5, -2.5), random(3, 4))
};

RocketBarrage.SW2 = {
  x: 209, y: 658,
  timer: () => Math.floor(random(45, 50)),
  acc: () => createVector(random(-0.03, 0.03), random(-0.02, -0.03)),
  vel: () => createVector(random(-2.5, -3), random(3, 4))
};

RocketBarrage.SW3 = {
  x: 243, y: 643,
  timer: () => Math.floor(random(45, 50)),
  acc: () => createVector(random(-0.01, 0.01), random(-0.03, -0.05)),
  vel: () => createVector(random(-3, -4), random(2.5, 3.5))
};

RocketBarrage.S1 = {
  x: 172, y: 636,
  timer: () => Math.floor(random(45, 50)),
  acc: () => createVector(random(-0.03, 0.02), random(0.07, 0.1)),
  vel: () => createVector(random(-1.8, -1), random(3, 4))
};

RocketBarrage.S2 = {
  x: 209, y: 658,
  timer: () => Math.floor(random(45, 50)),
  acc: () => createVector(random(-0.03, 0.02), random(0.07, 0.1)),
  vel: () => createVector(random(-2.2, -1.8), random(3, 4))
};

RocketBarrage.S3 = {
  x: 243, y: 643,
  timer: () => Math.floor(random(45, 50)),
  acc: () => createVector(random(-0.03, 0.02), random(0.07, 0.1)),
  vel: () => createVector(random(-3.2, -2), random(3, 4))
};

RocketBarrage.N1 = {
  x: 50, y: 915,
  timer: () => Math.floor(random(45, 50)),
  acc: () => createVector(random(0.05, 0.1), random(-0.04, -0.06)),
  vel: () => createVector(random(1.8, 1), random(-3, -4))
};

RocketBarrage.N2 = {
  x: 102, y: 915,
  timer: () => Math.floor(random(45, 50)),
  acc: () => createVector(random(0.01, 0.15), random(-0.04, -0.06)),
  vel: () => createVector(random(-0.07, 0.7), random(-3, -4))
};

RocketBarrage.N3 = {
  x: 156, y: 915,
  timer: () => Math.floor(random(45, 50)),
  acc: () => createVector(random(-0.02, 0.09), random(-0.04, -0.06)),
  vel: () => createVector(random(-0.1, 0.3), random(-3, -4))
};

RocketBarrage.NW1 = {
  x: 50, y: 915,
  timer: () => Math.floor(random(25, 30)),
  acc: () => createVector(random(-0.09, -0.15), random(0.04, 0.09)),
  vel: () => createVector(random(1.5, 3.5), random(-5, -7))
};

RocketBarrage.NW2 = {
  x: 102, y: 915,
  timer: () => Math.floor(random(35, 40)),
  acc: () => createVector(random(-0.09, -0.15), random(0.04, 0.09)),
  vel: () => createVector(random(0.5, 2.5), random(-4.5, -5.5))
};

RocketBarrage.NW3 = {
  x: 156, y: 915,
  timer: () => Math.floor(random(45, 50)),
  acc: () => createVector(random(-0.03, -0.1), random(0.04, 0.06)),
  vel: () => createVector(random(-0.1, 0.35), random(-4, -5))
};