class SAM extends InteractiveVehicle {

  constructor() {
    super(GameConfigs.CONFIGS.samMaxSpeed, SAM.MAX_ACCELERATION, SAM.MAX_FRICTION, 
      SAM.HEALTH, () => 0, SAM.WHEELS);
    
    this.minX = 605;
    this.maxX = 660;
    this.reloadWithDelay = intervalCaller(() => kModeOn ? 300 : 2400, () => {
      this.loadMissiles();
      return true;
    });
  }

  init(x, y, color, showHealth = true) {
    super.init(x, y, color, showHealth);
    this.missiles = new Array(SAM.MISSILE_COUNT);
  }

  reload = () => this.reloadEnabled = true;

  loadMissiles() {
    for (let i=0; i<SAM.MISSILE_COUNT; i++) {
      this.missiles[i] = new Missile(this.x + SAM.MISSILE_X_OFFSETS[i], 
        this.y + SAM.MISSILE_Y_OFFSET, this.lC);
    }
    this.reloadEnabled = false;
    this.missilesLaunched = false;
  }

  animate() {
    super.animate();
    if (this.isPopped()) return;
    let canReload = this.reloadEnabled && this.hasNoMissiles();
    if (canReload) {
      this.reloadWithDelay();
      return;
    }
    for (let i=0; i<SAM.MISSILE_COUNT; i++) {
      if (this.missiles[i]) {
        this.missiles[i].x = this.x + SAM.MISSILE_X_OFFSETS[i];
        this.missiles[i].y = this.y + SAM.MISSILE_Y_OFFSET;
      }
    }
  }

  drawBody() {
    for (let missile of this.missiles) {
      if (missile) missile.show();
    }
    push();
    translate(this.x, this.y);
    this.drawShadow();
    this.drawExhaust();
    this.drawMain();
    pop();
  }

  drawShadow() {
    stroke(darkColor);
    strokeWeight(4);
    line(-25, 9, 25, 9);
  }

  drawExhaust() {
    drawLine(-20, 0, -20, -30, this.lC, 6);
  }

  drawMain() {
    strokeWeight(2);
    let view = SAM.MAIN;
    drawPoly(view.body.xCords, view.body.yCords, this.lC, 2, true, bgColor, 
      true, view.body.xCords, view.body.yCords, this.lC, 1, 3, 25);
    drawPoly(view.launcher.xCords, view.launcher.yCords, this.lC, 2, true, bgColor, 
      true, view.launcher.xCords, view.launcher.yCords, this.lC, 1, 3, 25);
  }

  act = () => {
    let cantAct = (this.isPopped() || this.missilesLaunched || this.hasNoMissiles());
    if (cantAct) return;
    let targetsInRange = 
      [...this.targets]
        .filter(t => t.inView())
        .filter(t => this.targetInRange(t))
        .sort((a, b) => a.currHealth > b.currHealth);
    if (targetsInRange.length < SAM.MISSILE_COUNT) return;
    
    for (let i=0; i<SAM.MISSILE_COUNT; i++) {
      this.lockAndFire(targetsInRange[i], i);
    }
    this.missilesLaunched = true;
  }

  lockAndFire(target, missileIndex) {
    let missile = this.missiles[missileIndex];
    this.missiles[missileIndex] = null;
    missile.addTarget(target);
    bus.dispatch("AbbEventMissileAway", { missile });
  }

  targetInRange = t => Math.abs(this.x - t.x) < 450 && Math.abs(this.y - t.y) < 480;

  hasNoMissiles = () => this.missiles.every( m => !m );

  getExhaustPosition = () => createVector(this.x-20, this.y - 32);

  getExhaustVelocity = () => createVector(this.vel/3, -0.5);

  getBurnPosition = () => createVector(this.x, this.y - 35);

  destroyed() {}

  getCollisionBoxes = () => [];

}

SAM.MAX_ACCELERATION = 0.7;
SAM.MAX_FRICTION = 0.5;
SAM.HEALTH = 50;
SAM.WHEELS = [
  { radius: 6, offset: -7 }, 
  { radius: 6, offset: 7 }, 
  { radius: 6, offset: -21 }, 
  { radius: 6, offset: 21 }
];

SAM.MISSILE_COUNT = 2;
SAM.MISSILE_Y_OFFSET = -38;
SAM.MISSILE_X_OFFSETS = [5, 15];

SAM.MAIN = {
  body: {
    xCords: [-21, -28, -25, -15, -15, 28, 21],
    yCords: [0, -10, -25, -25, -12, -12, 0]
  },
  launcher: {
    xCords: [-2, 22, 22, -2],
    yCords: [-15, -15, -32, -32]
  }
};