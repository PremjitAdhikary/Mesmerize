class InteractiveVehicle {

  constructor(maxSpeed, maxAcc, maxFriction, health, actDelay, wheels) { 
    this.maxSpeed = maxSpeed;
    this.maxAcc = maxAcc;
    this.maxFriction = maxFriction;
    this.health = health;
    let me = this;
    this.damagable = new Damagable({
      obj: me, 
      onNoHealthCallback: () => me.destroyed()
    });
    this.actWithDelay = intervalCaller(actDelay, () => me.action());
    this.wheels = [];
    for (let w of wheels) {
      this.wheels.push({
        wheel: new Wheel(0, 0, w.radius), 
        offset: w.offset
      });
    }
    this.exhaustWithDelay = intervalCaller(() => Math.floor(Math.random()*3+7), 
      () => {
        bus.dispatch("AbbEventVehicleExhaust", { 
        pos: me.getExhaustPosition(), vel: me.getExhaustVelocity() });
        return true;
      });
    this.burnWithDelay = intervalCaller(() => Math.floor(Math.random()*3+7), 
      () => {
        bus.dispatch("AbbEventVehicleBurn", me.getBurnPosition());
        return true;
      });
    
    this.minX = 50;
    this.maxX = 590;
  }

  init(x, y, color, showHealth) {
    this.lC = color;
    this.x = x;
    this.y = y;
    this.vel = 0;
    this.currHealth = this.health;
    this.wheels.forEach( w => w.wheel.init(x+w.offset, y, color) );
    this.state = OBJ_ON;
    this.showHealth = showHealth;
    this.totalPoweredUp = 0;
    this.poweredUp = 0;
  }

  show() {
    if (this.poweredUp > 0) 
      this.drawPoweredUp();
    this.drawBody();
    this.wheels.forEach( w => w.wheel.show() );
    if (debug) {
      stroke(255, 0, 0);
      strokeWeight(1);
      noFill();
      this.getCollisionBoxes().forEach(box => rect(this.x + box.tlx, this.y+box.tly, box.w, box.h));
    }
    if (this.showHealth) this.damagable.draw();
  }

  drawPoweredUp() {
    push();
    translate(this.x, this.y);
    stroke(fireColor);
    strokeWeight(1);
    noFill();
    rect (-this.damagable.barWid/2, this.damagable.yOffset + 6, this.damagable.barWid, 5);
    fill(fireColor);
    let w = map(this.poweredUp, 0, this.totalPoweredUp, 0, this.damagable.barWid);
    rect (-this.damagable.barWid/2, this.damagable.yOffset + 6, w, 5);
    pop();
  }

  animate() {
    if (this.isPopped()) {
      this.burnWithDelay();
      return;
    }
    if (this.isPoweredUp())
      this.poweredUp--;

    this.moveVehicle();
    this.exhaustWithDelay();
  }

  moveVehicle() {
    if (this.isStationary()) return;

    if (this.isVehicleStopping()) return;

    let isLeft = (this.vel < 0);
    this.vel = Math.min(this.maxSpeed(), Math.abs(this.vel) - this.maxFriction);
    this.vel = this.vel * (isLeft ? -1 : 1);
    this.x += this.vel;
    this.rangeCheck();
    this.moveWheels();
  }

  isVehicleStopping() {
    if (Math.abs(this.vel) >= this.maxFriction) 
      return false;

    this.x += this.vel;
    this.vel = 0;
    this.moveWheels();
    return true;
  }

  moveRight = () => {
    if (this.isPopped()) return;
    this.vel += this.maxAcc;
  }

  moveLeft = () => {
    if (this.isPopped()) return;
    this.vel -= this.maxAcc;
  }

  act = () => {
    if (this.isPopped()) return;
    this.actWithDelay();
  }

  setRange(minX, maxX) {
    this.minX = minX;
    this.maxX = maxX;
  }

  rangeCheck() {
    if (this.x < this.minX) {
      this.x = this.minX;
      this.vel = 0;
    }
    if (this.x > this.maxX) {
      this.x = this.maxX;
      this.vel = 0;
    }
  }

  moveWheels = () => this.wheels.forEach( w => w.wheel.move(this.x+w.offset, this.y) );

  setToExplode() {
    this.state = OBJ_POP;
    this.vel = 0;
    this.poweredUp = 0;
    this.lC = darkColor;
    this.wheels.forEach( w => w.wheel.lC = darkColor );
  }

  isHit = (x, y) => !this.isPopped() && this.getCollisionBoxes().some(
    box => collidePointRect(x, y, this.x + box.tlx, this.y + box.tly, box.w, box.h)
  );

  powerUp(ticks) {
    this.totalPoweredUp = ticks;
    this.poweredUp = ticks;
    bus.dispatch("AbbEventVehiclePoweredUp", { });
  }

  isPoweredUp = () => this.poweredUp > 0;

  isPopped = () => this.state == OBJ_POP;

  isStationary = () => this.vel == 0;

}