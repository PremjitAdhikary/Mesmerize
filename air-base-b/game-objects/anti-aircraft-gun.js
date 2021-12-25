class AntiAircraftGun extends InteractiveVehicle {

  constructor() {
    super(GameConfigs.CONFIGS.gunnerMaxSpeed, AntiAircraftGun.MAX_ACCELERATION, 
      AntiAircraftGun.MAX_FRICTION, AntiAircraftGun.HEALTH, 
      GameConfigs.CONFIGS.gunnerActDelay, AntiAircraftGun.WHEELS);
    this.reloadWithDelay = intervalCaller(() => 30, () => {
      this.rounds = AntiAircraftGun.ROUNDS;
      return true;
    });
    this.damagable.damageCriteria = () => !kModeOn;
  }

  init(x, y, color, showHealth = true) {
    super.init(x, y, color, showHealth);
    this.rounds = AntiAircraftGun.ROUNDS;
    this.barrelFiring = false;
    this.barrelFlip = false;
  }

  show() {
    super.show();
    this.drawWheelConnector();
  }

  animate() {
    super.animate();
    if (this.isPopped()) return;
    if (this.rounds == 0) 
      this.reloadWithDelay();
  }

  drawBody() {
    push();
    translate(this.x, this.y);
    this.drawShadow();
    this.drawGuns();
    this.drawExhaust();
    this.drawMain();
  }

  drawShadow() {
    stroke(darkColor);
    strokeWeight(5);
    line(-28, 10, 28, 10);
  }

  drawGuns() {
    stroke(this.lC);
    strokeWeight(3);
    line( 10, -20, 21, -40 );
    line( 10, -10, 26, -38 );
    if (!this.barrelFiring) return;
    this.barrelFiring = !this.barrelFiring;
    noStroke();
    fill(fireColor);
    if (this.isPoweredUp() || kModeOn) {
      circle(21, -40, 12);
      circle(26, -38, 12);
    } else {
      if (this.barrelFlip) {
        circle(21, -40, 12);
      } else {
        circle(26, -38, 12);
      }
    }
  }

  drawExhaust() {
    drawLine(-15, 0, -15, -40, this.lC, 6);
  }

  drawMain() {
    strokeWeight(2);
    let view = AntiAircraftGun.MAIN;
    drawPoly(view.body.xCords, view.body.yCords, this.lC, 2, true, bgColor, 
      true, view.bodyS.xCords, view.bodyS.yCords, this.lC, 1, 3, 25);
    pop();
  }

  drawWheelConnector() {
    push();
    translate(this.x, this.y);
    stroke (this.lC);
    strokeWeight(2);
    let view = AntiAircraftGun.MAIN;
    drawPoly(view.beam.xCords, view.beam.yCords, this.lC, 2, true, bgColor, 
      true, view.beamS.xCords, view.beamS.yCords, this.lC, 1, 3, 25);
    pop();
  }

  getCollisionBoxes = () => AntiAircraftGun.COLLISION_BOXES;

  getExhaustPosition = () => createVector(this.x-15, this.y - 42);

  getExhaustVelocity = () => createVector(this.vel/3, -1);

  getBurnPosition = () => createVector(this.x, this.y - 30);

  action() {
    if (this.rounds == 0) return;
    this.rounds--;
    this.barrelFiring = true;
    this.barrelFlip = !this.barrelFlip;
    if (this.isPoweredUp() || kModeOn) {
      bus.dispatch("AbbEventFireBullet", { 
        pos: createVector(this.x+30, this.y-43), vel: createVector(5.5, -10), damage: 6 });
      bus.dispatch("AbbEventFireBullet", { 
        pos: createVector(this.x+22, this.y-45), vel: createVector(5.5, -10), damage: 6 });
    } else {
      bus.dispatch("AbbEventFireBullet", { 
        pos: createVector(this.x+26, this.y-45), vel: createVector(5.5, -10), damage: 4 });
    }
    return true;
  }

  destroyed() {
    this.setToExplode();
    bus.dispatch("AbbEventGunnerDown", { gunner: this });
  }

}

AntiAircraftGun.MAX_ACCELERATION = 1;
AntiAircraftGun.MAX_FRICTION = 0.5;
AntiAircraftGun.HEALTH = 50;
AntiAircraftGun.WHEELS = [
  { radius: 8, offset: -25 }, 
  { radius: 8, offset: 25 }
];
AntiAircraftGun.ROUNDS = 100;

AntiAircraftGun.MAIN = {
  body: {
    xCords: [-15, -15, 0, 12, 12],
    yCords: [0, -30, -30, -15, 0]
  },
  bodyS: {
    xCords: [-14, -14, -1, 11, 11],
    yCords: [-1, -29, -29, -14, -1]
  },
  beam: {
    xCords: [-22, -22, 22, 22],
    yCords: [3, -10, -10, 3]
  },
  beamS: {
    xCords: [-19, -19, 19, 19],
    yCords: [2, -9, -9, 2]
  }
};

AntiAircraftGun.COLLISION_BOXES = [
  {tlx: -15, tly: -30, w: 30, h: 35}, 
  {tlx: -30, tly: -8, w: 60, h: 15}
];