/**
 * Configuration for constructor
 * {
 *  len: length of the arrow
 *  maxSpeed: speed at which the arrow can fly
 *  numOfFramesBeforeFadeIn: number of frames to idle out before animation starts
 *  numOfFramesForFadeIn: number of frames for fade in before arrow flies
 *  x:, y: position
 *  damage: amount of damage to dish when collides with target
 * }
 */
 class Arrow {
  
  constructor(config) {
    this.vehicle = new BasicVehicle(
      config.x, config.y, 0, 10, createVector(15, -3), createVector(0, 0), config.maxSpeed, 0.2
    );
    this.vehicle._unrestricted = true;
    this.damage = config.damage;
    this.len = config.len;
    this.numOfFramesBeforeFadeIn = config.numOfFramesBeforeFadeIn;
    this.fadeInStarted = false;
    this.numOfFramesForFadeIn = config.numOfFramesForFadeIn;
    this.alpha = 10;
    this.dAlpha = Math.ceil(50 / this.numOfFramesForFadeIn);
    this.launched = false;
    this.active = true;
    this.baseColorGenerator = () => SketchColor.black();
    this.baseColor = this.baseColorGenerator().stringify();
  }

  animate() {
    if (!this.active || !this.launched) return;
    if (this.outOfScreen()) {
      this.active = false;
      return;
    }
    if (this.noMoreATarget()) {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      return;
    }
    this.vehicle.act();
    this.vehicle.update();
    let targetCollBox = this.target.getCollisionBox();
    if (collideRectRect(
        targetCollBox.x, targetCollBox.y, targetCollBox.w, targetCollBox.h, 
        this.x - this.cX, this.y, this.len, 2)) {
      eventBus.dispatch(this.target.id, { action: CHAR_DAMAGE, damage: this.damage });
      this.active = false;
      return;
    }
  }

  show() {
    if (!this.preRenderValidate()) return;
    push();
    translate(this.x - this.cX, this.y);
    rotate(this.velocity.heading());
    this.render();
    pop();
  }

  preRenderValidate() {
    if (!this.active) return false;
    if (!this.fadeInStarted) {
      this.numOfFramesBeforeFadeIn--;
      if (this.numOfFramesBeforeFadeIn <=0) this.fadeInStarted = true;
      return false;
    }
    return true;
  }

  render() { 
    this.setupColor();
    strokeWeight(1);
    rect(0, 0, this.len, 2);
    triangle(this.len, -2, this.len, 4, this.len+5, 0);
  }

  setupColor() {
    if (this.launched) {
      stroke(this.baseColor);
      fill(this.baseColor);
    } else {
      let fadeColor = this.baseColorGenerator().alpha(this.alpha/100).stringify();
      stroke(fadeColor);
      fill(fadeColor);
      this.alpha += this.dAlpha;
      if (this.alpha >= 100) {
        this.alpha = 100;
        this.launched = true;
      }
    }
  }

  noMoreATarget() {
    return !this.target || !this.target.active || this.target.state == CHAR_DEAD 
     || this.x > (this.target.x + 20);
  }

  outOfScreen() {
    return (this.x > (this.cX + width + 400) || this.y < -100 || this.y > height + 100);
  }

  addTarget(target) {
    this.target = target;
    let wrappedTarget = new TargetAdapter(this.target);
    this.vehicle.addStrategy(new Pursuit(wrappedTarget));
    this.vehicle._strategy._predictionMax = 6;
  }

  deactivate() {
    if (this.launched) return;
    this.active = false;
  }

  updateCX(cx) {
    this.cX = cx;
  }

  get x() { return this.vehicle._position.x }
  set x(val) { this.vehicle._position.x = val }
  get y() { return this.vehicle._position.y }
  set y(val) { this.vehicle._position.y = val }
  get velocity() { return this.vehicle._velocity }

}

class TargetAdapter {
  constructor(target) {
    this.target = target;
  }

  get _position() { return createVector(this.target.x, this.target.y) }
  get _velocity() { return createVector(this.target.dx, 0) }
}

Arrow.MAX_SPEED = 14;