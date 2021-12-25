class FighterKamikaze extends FighterJet {

  constructor(x, y) {
    super(x, y, FighterKamikaze.DIVE());
    this.initialVel = createVector(-5.5, 10);
    this._velocity = this.initialVel.copy();
    this.type = FighterJet.TYPE_KAMIKAZE;
    this.damage = 65;
    this.health = 15;
  }

  init(x, y, a = 0, showHealth = true) {
    super.init(x, y, a, showHealth);
    if (this.initialVel)
      this._velocity = this.initialVel.copy();
    this.targets = [];
  }

  animate() {
    super.animate();
    if (!this.inView()) return;
    
    let targetsHit = this.targets.filter( t => t.isHit(this.x, this.y) );
    if (targetsHit.length > 0) {
      this.setToExplode();
      targetsHit.forEach(t => t.damage(this.damage, this.x, this.y));
    }
  }

  setToExplode() {
    if (audioOn) explodeBlast();
    this.state = OBJ_POP;
    bus.dispatch("AbbEventFighterKamikaze", { fighter: this });
  }

  getView = () => FighterKamikaze.MAIN;

  addTarget = target => this.targets.push(target);

}

FighterKamikaze.DIVE = () => {
  return (fighter) => {
    fighter._velocity.mult(1.05);
    fighter._velocity.limit(GameConfigs.CONFIGS.kamikazeMaxSpeed());
    fighter.x += fighter._velocity.x;
    fighter.y += fighter._velocity.y;
    fighter.a = fighter._velocity.heading() - HALF_PI;
  };
};

FighterKamikaze.MAIN = {
  body: {
    xCords: [-32, -30, -26, 5, 25, 30, 30, 25, 5, -26, -30], 
    yCords: [0, 4, 5, 5, 4, 3, -3, -4, -5, -5, -4]
  },
  bodyS: {
    xCords: [-32, -30, -26, 5, 25, 30, 30, 25, 5, -26, -30], 
    yCords: [0, 4, 6, 5, 4, 3, -3, -4, -5, -6, -4]
  },
  wing: {
    xCords: [-15, -14, -10, -6, -4, -6, -10, -14], 
    yCords: [0, 7, 30, 29, 0, -29, -30, -7]
  },
  stabalizer: {
    xCords: [25, 25, 26, 29, 28, 29, 26, 25], 
    yCords: [0, 7, 15, 14, 0, -14, -15, -7]
  }, 
  cockpit: { x: 6, y: 0, w: 16, h: 9 }
};