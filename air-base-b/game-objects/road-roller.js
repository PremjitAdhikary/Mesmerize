class RoadRoller extends InteractiveVehicle {

  constructor() {
    super(GameConfigs.CONFIGS.rollerMaxSpeed, RoadRoller.MAX_ACCELERATION, RoadRoller.MAX_FRICTION, 
      RoadRoller.HEALTH, GameConfigs.CONFIGS.rollerActDelay, RoadRoller.WHEELS);
    let me = this;
    this.damagable.damageCriteria = () => !me.isPoweredUp() && !kModeOn;
    this.fixAmount = 4;
  }

  init(x, y, color, showHealth = true) {
    super.init(x, y, color, showHealth);
    this.repairOn = false;
    this.repairA = 0;
  }

  show() {
    super.show();
    if (debug && this.isPoweredUp()) {
      stroke(255, 0, 0);
      strokeWeight(1);
      noFill();
      circle(this.x, this.y, RoadRoller.SHEILD_DIAM);
    }
  }

  drawBody() {
    push();
    translate(this.x, this.y);
    this.drawRepair();
    this.drawShadow();
    this.drawExhaust();
    this.drawMain();
    if (this.isPoweredUp() || kModeOn)
      this.drawSheild();
    pop();
  }

  drawRepair() {
    if (!this.repairOn) return;
    this.repairOn = false;
    stroke(fireColor);
    strokeWeight(3);
    let x = Math.sin(this.repairA) * 8;
    this.repairA += 0.1;
    line(x-2, 0, x-2, 15);
  }

  drawShadow() {
    stroke(darkColor);
    strokeWeight(5);
    line(-35, 15, 30, 15);
  }

  drawExhaust() {
    drawLine(15, 0, 15, -40, this.lC, 6);
  }

  drawMain() {
    strokeWeight(2);
    let view = RoadRoller.MAIN;
    drawPoly(view.body.xCords, view.body.yCords, this.lC, 2, true, bgColor, 
      true, view.bodyS.xCords, view.bodyS.yCords, this.lC, 1, 3, 25);
    drawPoly(view.window.xCords, view.window.yCords, this.lC, 2, true, bgColor);
  }

  drawSheild() {
    stroke(darkColor, 90);
    strokeWeight(2);
    noFill();
    let r = RoadRoller.SHEILD_DIAM - Math.floor((this.poweredUp%30)/3);
    arc(0, 0, r, r, PI, 0);
  }

  getCollisionBoxes = () => RoadRoller.COLLISION_BOXES;

  getExhaustPosition = () => createVector(this.x+15, this.y - 42);

  getExhaustVelocity = () => createVector(this.vel/3, -2);

  getBurnPosition = () => createVector(this.x, this.y - 35);

  act = () => {
    let cantAct = !this.isStationary() || this.isPopped();
    if (cantAct) return;
    this.actWithDelay();
    this.repairOn = true;
  }

  action() {
    this.damagable.repair(this.fixAmount/10);
    bus.dispatch("AbbEventEngineerFix", { amt: this.fixAmount, x: this.x, y: this.y });
    return true;
  }

  isHit = (x, y) => 
    !this.isPopped() && (
      (!this.isPoweredUp() && this.getCollisionBoxes().some(
        box => collidePointRect(x, y, this.x + box.tlx, this.y + box.tly, box.w, box.h))) 
      || 
      ((kModeOn || this.isPoweredUp()) 
        && collidePointCircle(x, y, this.x, this.y, RoadRoller.SHEILD_DIAM))
    );

  destroyed() {
    this.setToExplode();
    bus.dispatch("AbbEventRollerDown", { roller: this });
  }

}

RoadRoller.MAX_ACCELERATION = 1.25;
RoadRoller.MAX_FRICTION = 0.3;
RoadRoller.HEALTH = 60;
RoadRoller.WHEELS = [
  { radius: 12, offset: -25 }, 
  { radius: 12, offset: 20 }
];

RoadRoller.SHEILD_DIAM = 150;

RoadRoller.OFFSET = 25;
RoadRoller.MAIN = {
  body: {
    xCords: [-RoadRoller.OFFSET-15, -RoadRoller.OFFSET-15, -RoadRoller.OFFSET, 
      -RoadRoller.OFFSET/2, 0, 0, RoadRoller.OFFSET, RoadRoller.OFFSET],
    yCords: [0, -20, -20, -35, -35, -15, -15, 0]
  },
  bodyS: {
    xCords: [-RoadRoller.OFFSET-14, -RoadRoller.OFFSET-14, -RoadRoller.OFFSET+1, 
      -RoadRoller.OFFSET/2-1, -1, -1, RoadRoller.OFFSET-1, RoadRoller.OFFSET-1],
    yCords: [-1, -19, -19, -34, -34, -16, -16, -1]
  },
  window: {
    xCords: [-RoadRoller.OFFSET+4, -RoadRoller.OFFSET/2+4, -4, -4],
    yCords: [-20, -30, -30, -20]
  }
};
RoadRoller.COLLISION_BOXES = [
  {tlx: -RoadRoller.OFFSET-5, tly: -20, w: RoadRoller.OFFSET*2+10, h: 35}, 
  {tlx: -RoadRoller.OFFSET/2-10, tly: -35, w: RoadRoller.OFFSET/2+10, h: 15}
];