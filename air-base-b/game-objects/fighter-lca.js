class FighterLCA extends FighterJet {

  constructor(x, y, ox, oy, w, h) {
    super(x, y, FighterLCA.FLY_BY(ox, oy, w, h));
    this.type = FighterJet.TYPE_LCA;
    this.health = 15;
    let me = this;
    this.shootWithDelay = intervalCaller(GameConfigs.CONFIGS.lcaShootDelay, () => {
      if (!me.inView() || me.y < 50 || me._velocity.y < 0) return false;
      let nozzle = createVector(-40, 0);
      nozzle.setHeading(this._velocity.heading());
      nozzle.add(this._position);
      bus.dispatch("AbbEventLCAFire", { 
        pos: nozzle, vel: p5.Vector.mult(this._velocity, 2) });
      me.nozzleFiring = true;
      return true;
    });
  }

  init(x, y, a, showHealth = true) {
    super.init(x, y, a, showHealth);
    this.prevx = this.x;
    this.prevy = this.y;
    this.nozzleFiring = false;
  }

  get _velocity() { return createVector(this.x - this.prevx, this.y - this.prevy) }

  show() {
    this.drawGun();
    super.show();
  }

  drawGun() {
    push();
    translate(this.x, this.y);
    rotate(this.a - HALF_PI);
    stroke(this.lC);
    strokeWeight(3);
    line( 0, 0, -38, 0 );
    if (this.nozzleFiring) {
      noStroke();
      fill(fireColor);
      circle(-40, 0, 10);
      this.nozzleFiring = false;
    }
    pop();
  }

  animate() {
    this.prevx = this.x;
    this.prevy = this.y;
    super.animate();
    if (this.inView()) this.shootWithDelay();
  }

  getView = () => FighterLCA.MAIN;

}

FighterLCA.FLY_BY = (ox, oy, w, h) => {
  return (fighter) => {
    let x = Math.cos(fighter.a);
    let y = Math.sin(fighter.a);
    fighter.x = ox + x * w;
    fighter.y = oy + y * h;
    fighter.a = (fighter.a + GameConfigs.CONFIGS.lcaAngularSpeed()) % TWO_PI;
  };
};

FighterLCA.MAIN = {
  body: {
    xCords: [-32, -30, -26, 5, 25, 30, 30, 25, 5, -26, -30], 
    yCords: [0, 5, 6, 6, 4, 3, -3, -4, -6, -6, -5]
  },
  bodyS: {
    xCords: [-32, -30, -26, 5, 25, 30, 30, 25, 5, -26, -30], 
    yCords: [0, 4, 5, 6, 4, 3, -3, -4, -6, -5, -4]
  },
  wing: {
    xCords: [-15, -12, -2, 4, 1, 4, -2, -12], 
    yCords: [0, 7, 30, 28, 0, -28, -30, -7]
  },
  stabalizer: {
    xCords: [25, 22, 25, 30, 28, 30, 25, 22], 
    yCords: [0, 7, 15, 13, 0, -13, -15, -7]
  }, 
  cockpit: { x: -12, y: 0, w: 16, h: 6 }
};