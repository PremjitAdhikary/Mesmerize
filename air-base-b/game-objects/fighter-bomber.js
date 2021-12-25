class FighterBomber extends FighterJet {

  constructor(x, y, ox, oy, w, h) {
    super(x, y, FighterBomber.FLY_BY(ox, oy, w, h));
    this.type = FighterJet.TYPE_BOMBER;
    this.health = 25;
  }

  init(x, y, a, showHealth = true) {
    super.init(x, y, a, showHealth);
    this.prevx = this.x;
    this.prevy = this.y;
    this.bombsDropped = 0;
    this.dispenser = FighterBomber.BOMB_DISPENSER(this);
  }

  get _velocity() { return createVector(this.x - this.prevx, this.y - this.prevy) }

  animate() {
    this.prevx = this.x;
    this.prevy = this.y;
    super.animate();
    if (this.inView()) this.dispenser();
  }

  getView = () => FighterBomber.MAIN;

}

FighterBomber.FLY_BY = (ox, oy, w, h, a) => {
  return (fighter) => {
    let x = Math.cos(fighter.a);
    let y = Math.sin(fighter.a);
    fighter.x = ox + x * w;
    fighter.y = oy + y * h;
    fighter.a += GameConfigs.CONFIGS.bomberAngularSpeed();
    if (fighter.a > HALF_PI * 3) fighter.a = 0;
  };
};

FighterBomber.BOMB_DISPENSER = (fighter) => {
  let totalDelays = GameConfigs.CONFIGS.bomberDrops().length;
  let delayIndex = Math.floor(Math.random()*totalDelays);
  return intervalCaller(
    () => GameConfigs.CONFIGS.bomberDrops()[delayIndex++%totalDelays], 
    () => {
      if (fighter.x < 190 || fighter.x > 620) return false;
      fighter.bombsDropped++;
      bus.dispatch("AbbEventBombsAway", { fighter });
      return true;
    }
  );
};

FighterBomber.MAIN = {
  body: {
    xCords: [-32, -30, -26, 5, 25, 30, 30, 25, 5, -26, -30], 
    yCords: [0, 4, 8, 8, 4, 3, -3, -4, -8, -8, -4]
  },
  bodyS: {
    xCords: [-32, -30, -26, 5, 25, 30, 30, 25, 5, -26, -30], 
    yCords: [0, 4, 7, 6, 4, 3, -3, -4, -6, -7, -4]
  },
  wing: {
    xCords: [-17, -16, -8, 0, 7, 0, -8, -16], 
    yCords: [0, 7, 30, 29, 0, -29, -30, -7]
  },
  stabalizer: {
    xCords: [25, 22, 25, 30, 28, 30, 25, 22], 
    yCords: [0, 7, 15, 13, 0, -13, -15, -7]
  }, 
  cockpit: { x: -8, y: 0, w: 16, h: 11 }
};