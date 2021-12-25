class Bullet {

  constructor(pos, velocity, damage = 4, firedBy = BLUE_TEAM) {
    this.pos = pos;
    this.velocity = velocity;
    this.active = true;
    this.damage = damage;
    this.firedBy = firedBy;
    this.targets = [];
    if (audioOn) bulletFire();
  }

  show() {
    if (!this.active) return;
    stroke(fireColor);
    strokeWeight(2);
    fill(fireColor);
    circle(this.pos.x, this.pos.y, 3);
    if (this.prev)
      line(this.prev.x, this.prev.y, this.pos.x, this.pos.y);
  }

  animate() {
    if (!this.active) return;
    this.prev = this.pos.copy();
    this.pos.add(this.velocity);
    if (!this.inView()) {
      this.active = false;
      return;
    }
    let target = this.targets.find( t => t.isHit(this.pos.x, this.pos.y) );
    if (target) {
      target.damage(this.damage, this.pos.x, this.pos.y);
      this.active = false;
    }
  }

  inView = () => (this.pos.x > -10 && this.pos.x < (width + 10) 
    && this.pos.y > -10 && this.pos.y < (430));

  addTarget = target => this.targets.push(target);

}