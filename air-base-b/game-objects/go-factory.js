class GOFactory {

  constructor() {
    this.strip = new AirStrip();
    this.roller = new RoadRoller();
    this.gunner = new AntiAircraftGun();
    this.sam = new SAM();
    this.fighterPoolsPopulated = false;
  }

  setupFighterPools() {
    this.bomberPool = [];
    for (let i=0; i<10; i++) {
      let f = new FighterBomber(0, 0, 200 + (i * 20), -420 + (i* 2), 800, 500);
      f.lC = greenColor;
      this.bomberPool.push(f);
    }
    this.bomberInUse = [];
    
    this.kamikazePool = [];
    for (let i=0; i<3; i++) {
      let f = new FighterKamikaze(0, 0);
      f.lC = greenColor;
      this.kamikazePool.push(f);
    }
    this.kamikazeInUse = [];

    this.lcaPool = [];
    for (let i=0; i<3; i++) {
      let f = new FighterLCA(0, 0, 350 + (i * 20), -350 + (i* 2), 250, 650, 0.015);
      f.lC = greenColor;
      this.lcaPool.push(f);
    }
    this.lcaInUse = [];
    
    this.fighterPoolsPopulated = true;
  }

  getAirStrip() {
    this.strip.init();
    return this.strip;
  }

  getFighterBomber(x = 0, y = 0, a = 0, showHealth = true) {
    if (!this.fighterPoolsPopulated) this.setupFighterPools();
    if (this.bomberPool.length == 0) console.error('Insufficient bombers');
    let f = this.bomberPool.shift();
    f.init(x, y, a, showHealth);
    this.bomberInUse.push(f);
    return f;
  }

  getFighterKamikaze(x = 0, y = 0, showHealth = true) {
    if (!this.fighterPoolsPopulated) this.setupFighterPools();
    if (this.kamikazePool.length == 0) console.error('Insufficient kamikaze fighters');
    let f = this.kamikazePool.shift();
    f.init(x, y, 0, showHealth);
    this.kamikazeInUse.push(f);
    return f;
  }

  getFighterLCA(x = 0, y = 0, a = 0, showHealth = true) {
    if (!this.fighterPoolsPopulated) this.setupFighterPools();
    if (this.lcaPool.length == 0) console.error('Insufficient lca fighters');
    let f = this.lcaPool.shift();
    f.init(x, y, a, showHealth);
    this.lcaInUse.push(f);
    return f;
  }

  getFighterBlast(f, useVelocity = true) {
    let vel = useVelocity ? f._velocity : createVector(0,0);
    let tempObjs = []
    tempObjs.push(new BlastCircle(createVector(f.x, f.y), vel, 3, 40, 4, 0, true));
    tempObjs.push(new BlastCircle(
      createVector(f.x - random(10,15), f.y + random(-5,5)), vel, 1, 20, 3, 3, true));
    tempObjs.push(new BlastCircle(
      createVector(f.x + random(10,15), f.y + random(-5,5)), vel, 1, 20, 3, 5, true));
    if (random() > 0.5) 
    tempObjs.push(new BlastCircle(
      createVector(f.x + random(-10,10), f.y + random(-5,5)), vel, 1, 20, 3, 6, true));
    return tempObjs;
  }

  getBomb(f) {
    let vel = createVector((f._velocity.x)*0.4, 0.9);
    return new Bomb(createVector(f.x, f.y+20), vel);
  }

  getBombBlast(b) {
    let vel = createVector(0, 0);
    let tempObjs = []
    tempObjs.push( new BlastCircle(createVector(b.pos.x, b.pos.y), vel, 3, 30, 6, 0, true));
    tempObjs.push( new BlastCircle(
      createVector(b.pos.x + random(-20,20), b.pos.y), vel, 3, 18, 3, 4, true));
    return tempObjs;
  }

  getAntiAircraftGun(x = 200, y = 400, showHealth = true) {
    this.gunner.init(x, y, blueColor, showHealth);
    return this.gunner;
  }

  getRoadRoller(x = 500, y = 400, showHealth = true) {
    this.roller.init(x, y, blueColor, showHealth);
    return this.roller;
  }

  getSAM(x = 610, y = 400, showHealth = true) {
    this.sam.init(x, y, blueColor, showHealth);
    return this.sam;
  }

  getBullet(pos, vel, damage) {
    let b = new Bullet(pos, vel, damage);
    return b;
  }

  getExhaust(pos, vel) {
    return new BlastCircle(pos, vel, 5, 15, 0.5);
  }

  getVehicleBlast(r) {
    let vel = createVector(0, -2);
    let tempObjs = []
    tempObjs.push(new BlastCircle(createVector(r.x, r.y), vel, 3, 40, 4, 0, true));
    tempObjs.push(new BlastCircle(createVector(r.x - random(10,15), r.y + random(-5,5)), 
      vel, 1, 20, 1.5, 3, true));
    tempObjs.push(new BlastCircle(createVector(r.x + random(10,15), r.y + random(-5,5)), 
      vel, 1, 20, 1.5, 3, true));
    tempObjs.push(new BlastCircle(createVector(r.x - random(10,15), r.y + random(-5,5)), 
      vel, 1, 20, 1.5, 5, true));
    tempObjs.push(new BlastCircle(createVector(r.x + random(10,15), r.y + random(-5,5)), 
      vel, 1, 20, 1.5, 5, true));
    if (random() > 0.5) {
      tempObjs.push(new BlastCircle(createVector(r.x + random(-10,10), r.y + random(-5,5)), 
        vel, 1, 20, 1.5, 7, true));
      tempObjs.push(new BlastCircle(createVector(r.x + random(-10,10), r.y + random(-5,5)), 
        vel, 1, 20, 1.5, 7, true));
    }
    return tempObjs;
  }

  getVehicleBurn(x, y) {
    let vel = createVector(0.2, -2);
    let velL = createVector(-0.1, -1.9);
    let velR = createVector(0.5, -1.9);
    let tempObjs = [];
    tempObjs.push(new BlastCircle(createVector(x, y), vel, 3, 22, 0.5));
    tempObjs.push(new BlastCircle(createVector(x - random(12,20), y + random(-2,-5)), velL, 2, 20, 0.8));
    tempObjs.push(new BlastCircle(createVector(x + random(12,20), y + random(-2,-5)), velR, 2, 20, 0.8));
    tempObjs[0].blastColor = 150;
    tempObjs[1].blastColor = 150;
    tempObjs[2].blastColor = 150;
    return tempObjs;
  }

  setBus(bus) {
    if (this.bus) return;
    this.bus = bus;
    this.strip.bus = bus;
    this.bus.register("AbbEventFighterDown", e => {
      let f = e.detail.fighter;
      switch(f.type) {
        case FighterJet.TYPE_BOMBER:
          this.returnFighterToPool(f, this.bomberPool, this.bomberInUse);
          break;
        case FighterJet.TYPE_KAMIKAZE:
          this.returnFighterToPool(f, this.kamikazePool, this.kamikazeInUse);
          break;
        case FighterJet.TYPE_LCA:
          this.returnFighterToPool(f, this.lcaPool, this.lcaInUse);
          break;
      }
    });
    this.bus.register("AbbEventFighterKamikaze", e => {
      let f = e.detail.fighter;
      this.returnFighterToPool(f, this.kamikazePool, this.kamikazeInUse);
    });
  }

  returnFighterToPool(f, pool, inUse) {
    let fi = inUse.indexOf(f);
    if (fi >= 0) {
      inUse.splice(fi, 1);
      pool.push(f);
    }
  }

  returnAllFightersToPool() {
    if (!this.fighterPoolsPopulated) return;
    this.bomberPool.push(...this.bomberInUse);
    this.bomberInUse = [];
    this.kamikazePool.push(...this.kamikazeInUse);
    this.kamikazeInUse = [];
    this.lcaPool.push(...this.lcaInUse);
    this.lcaInUse = [];
  }

}

GOFactory.FACTORY = new GOFactory();