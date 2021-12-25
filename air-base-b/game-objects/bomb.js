class Bomb {

  constructor(pos, velocity) {
    this.pos = pos;
    this.velocity = velocity;
    this.acc = createVector(0, 0.12);
    this.a = random();
    this.health = 2;
    this.currHealth = this.health;
    this.active = true;
    this.damage = Math.floor(random(15, 25));
    let me = this;
    this.damagable = new Damagable({
      obj: me, 
      onNoHealthCallback: () => me.setToExplode()
    });
    this.targets = [];
  }

  show() {
    if (!this.active) return;
    stroke(darkColor);
    fill(darkColor);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.a);
    circle(0, 0, 10);
    line(-8, 0, 8, 0);
    line(0, -8, 0, 8);
    pop();
    if (debug) {
      stroke(255, 0, 0);
      strokeWeight(1);
      noFill();
      circle(this.pos.x, this.pos.y, Bomb.COLLISION_DIAM);
    }
  }

  animate() {
    if (!this.active) return;
    this.a += 0.03;
    this.pos.add(this.velocity);
    this.velocity.add(this.acc);
    if (!this.inView()) {
      this.active = false;
      return;
    }
    
    let targetsHit = this.targets.filter( t => t.isHit(this.pos.x, this.pos.y) );
    if (targetsHit.length > 0) {
      this.setToExplode();
      targetsHit.forEach(t => t.damage(this.damage, this.pos.x, this.pos.y));
    }
  }

  setToExplode() {
    if (audioOn) explodeBlast();
    this.active = false;
    bus.dispatch("AbbEventBombExplode", { bomb: this });
  }

  inView = () => (this.pos.x > -10 && this.pos.x < (width + 10) 
    && this.pos.y > -10 && this.pos.y < (height + 10));

  isHit = (x, y) => (this.active && this.inView() 
    && collidePointCircle(x, y, this.pos.x, this.pos.y, Bomb.COLLISION_DIAM));

  addTarget = target => this.targets.push(target);

}

Bomb.COLLISION_DIAM = 20;