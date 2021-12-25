class TrainerTarget {

  constructor(x, y, a) {
    // this.x = x;
    // this.y = y;
    this.pos = createVector(x, y);
    this.a = a;
    this.active = true;
    this.health = 3;
    let me = this;
    this.damagable = new Damagable({
      obj: me, 
      onNoHealthCallback: () => me.setToExplode(), 
      repairCriteria: () => false
    });
    this.reset();
  }

  get x() { return this.pos.x }
  get y() { return this.pos.y }
  get _position() { return createVector(this.pos.x, this.pos.y) }
  get _velocity() { return createVector(this.pos.x - this.prevx, 0) }

  reset() {
    this.active = true;
    this.prevx = this.pos.x;
    this.currHealth = this.health;
  }

  show() {
    if (!this.active) return;
    strokeWeight(2);
    stroke(darkColor);
    noFill();
    circle(this.pos.x, this.pos.y, 30);
    circle(this.pos.x, this.pos.y, 20);
    fill(fireColor);
    circle(this.pos.x, this.pos.y, 8);
  }

  animate() {
    if (!this.active) return;

    this.prevx = this.pos.x;
    this.pos.x += (Math.sin(this.a) * 6);
    this.a += 0.03;
  }

  isHit = (x, y) => (this.active 
    && collidePointCircle(x, y, this.pos.x, this.pos.y, 30));

  setToExplode() {
    if (audioOn) explodeBlast();
    this.active = false;
    bus.dispatch("AbbEventTargetExplode", { bomb: this });
  }

  inView = () => (this.pos.x > -30 && this.pos.x < (width + 30) 
    && this.pos.y > -30 && this.pos.y < (height + 30));

}