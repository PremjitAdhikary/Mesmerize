class Missile extends BasicVehicle {

  constructor(x, y, color, velocity = createVector(0, -15)) {
    super(x, y, color, 32, velocity, createVector(0, 0), GameConfigs.CONFIGS.samMissileSpeed(), 1.5);
    this.launched = false;
    this.pursueStart = 5;
    this.active = true;
    this.damage = 30;
    this.trail = [];
  }

  get x() { return this._position.x }
  set x(val) { this._position.x = val }
  get y() { return this._position.y }
  set y(val) { this._position.y = val }

  show() {
    if (!this.active) return;
    strokeWeight(1);
    if (this.launched) {
      stroke(fireColor);
      noFill();
      beginShape();
      this.trail.forEach( v => vertex(v.x, v.y) );
      endShape();
    }
    stroke(this._color);
    strokeWeight(1);
    fill(this._color);
    push();
    translate(this._position.x, this._position.y);
    rotate(this._velocity.heading());
    triangle(0, -3, 0, 3, 8, 0);
    rect(0, -3, -20, 6);
    rect(-20, -2, -5, 4);
    pop();
    this.trail.push(this._position.copy());
  }

  animate() {
    if (!this.active || !this.launched) return;
    if (this.pursueStart > 0) {
      this._position.add(this._velocity);
      this.pursueStart--;
      return;
    }
    if (!this.inView()) {
      this.active = false;
      return;
    }
    if (!this.target.inView()) {
      this._position.add(this._velocity);
      return;
    } 
    if (this.target.damagable.isHit(this._position.x, this._position.y)) {
      this.target.damagable.damage(this.damage, this._position.x, this._position.y);
      this.active = false;
      return;
    }
    this.act();
    this.update();
  }

  addTarget(target) {
    this.target = target;
    this.addStrategy(new Pursuit(target));
    this._strategy._predictionMax = 6;
    this.launched = true;
  }

  inView = () => (this._position.x > -30 && this._position.x < (width + 30) 
    && this._position.y > -30 && this._position.y < (height + 30));

  restrict() {}
}