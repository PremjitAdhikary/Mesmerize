class PlayCommons {

  constructor(params) {
    this.commandProcessor = new KeyDownCommandProcessor();
    this.resetEnabled = true;
    this.addRoller = params.addRoller;
    this.addGunner = params.addGunner;
    this.addSAM = params.addSAM;
    this.hasEnemyBombers = params.hasEnemyBombers;
    this.addBombersInterval = params.addBombersInterval;
    this.minBombersToAdd = this.hasEnemyBombers ? params.minBombersToAdd : 0;
    this.maxBombersToAdd = this.hasEnemyBombers ? params.maxBombersToAdd : 0;
    this.hasEnemyLCAs = params.hasEnemyLCAs;
    this.addLCAsInterval = params.addLCAsInterval;
    this.minLCAToAdd = this.hasEnemyLCAs ? params.minLCAToAdd : 0;
    this.maxLCAToAdd = this.hasEnemyLCAs ? params.maxLCAToAdd : 0;
    this.hasEnemyKamikazes = params.hasEnemyKamikazes;
    this.addKamikazesInterval = params.addKamikazesInterval;

    this.powerUpN = 0;
    this.buildTimers();
  }

  buildTimers() {
    this.buildEnemyTimers();
    this.buildPlayerTimers();
  }

  buildEnemyTimers() {
    if (this.hasEnemyBombers) this.buildTimerToAddBombers();
    if (this.hasEnemyLCAs) this.buildTimerToAddLCAs();
    if (this.hasEnemyKamikazes) this.buildTimerToAddKamikaze();
  }

  buildTimerToAddBombers() {
    let me = this;
    this.bomberAddWithDelay = intervalCaller(me.addBombersInterval, () => {
      let maxBombers = Math.floor(random(me.minBombersToAdd, me.maxBombersToAdd+1));
      for (let f = 0; f < maxBombers; f++) 
        me.gFighters.push(GOFactory.FACTORY.getFighterBomber(-100, -100, -0.5 - (0.25 * f)));
      return true;
    });
  }

  buildTimerToAddLCAs() {
    let me = this;
    this.LCAAddWithDelay = intervalCaller(me.addLCAsInterval, () => {
      if (me.gFighters.some( f => f.type == 'lca')) return false;
      let maxLCAs = Math.floor(random(me.minLCAToAdd, me.maxLCAToAdd+1));
      for (let f = 0; f < maxLCAs; f++) 
        me.gFighters.push(GOFactory.FACTORY.getFighterLCA(0, 0, -0.5 + f*0.3));
      return true;
    });
  }

  buildTimerToAddKamikaze() {
    let me = this;
    this.kamikazeStartX = [630,450,745,400,500,600,480,570,430,540,690,645];
    this.kamikazrStartIndex = Math.floor(random(this.kamikazeStartX.length));
    this.kamikazesAddWithDelay = intervalCaller(me.addKamikazesInterval, () => {
      let f = GOFactory.FACTORY.getFighterKamikaze(
        me.kamikazeStartX[me.kamikazrStartIndex++ % me.kamikazeStartX.length], -100, true);
      f.addTarget(me.strip);
      if (me.addGunner)
        f.addTarget(me.gunner.damagable);
      if (me.addRoller)
        f.addTarget(me.roller.damagable);
        me.gFighters.push(f);
      return true;
    });
  }

  buildPlayerTimers() {
    let me = this;
    this.currIndex = 0;
    this.powerUpAddWithDelay = intervalCaller(() => {
      let nextPowerUp = Math.pow(2, me.powerUpN) * 1000;
      me.powerUpN++;
      return nextPowerUp;
    }, () => {
      let x = 100;
      for (let i=0; i<4; i++) {
        x = PlayCommons.POWER_LOCATIONS[(i + this.currIndex)%4];
        if (me.addGunner && me.gunner.isHit(x, 400)) continue;
        if (me.addRoller && me.roller.isHit(x, 400)) continue;
        break;
      }
      let powerUp = new PowerUp(x, Math.pow(2, me.powerUpN) * 500);
      me.powerUpActive = true;
      if (me.addGunner) powerUp.addTarget(me.gunner);
      if (me.addRoller) powerUp.addTarget(me.roller);
      me.tempObjects.push(powerUp);
      this.currIndex++;
      return true;
    });
  }
  
  setup() {
    this.bg = new AirBaseBG();
    this.setupEventsForEnemyFighters();
    this.setupEventsForPlayer();
  }

  setupEventsForEnemyFighters() {
    bus.register("AbbEventFighterDown", e => {
      let f = e.detail.fighter;
      this.killStats.kills++;
      if (f.type == FighterJet.TYPE_BOMBER && f.bombsDropped == 0) this.killStats.perfects++;
      this.tempObjects.push(...GOFactory.FACTORY.getFighterBlast(f));
      let fi = this.gFighters.indexOf(f);
      if (fi >= 0) {
        this.gFighters.splice(fi, 1);
      }
    });

    if (this.hasEnemyBombers) this.setupBomberEvents();
    if (this.hasEnemyLCAs) this.setupLCAEvents();
    if (this.hasEnemyKamikazes) this.setupKamikazeEvents();
  }

  setupBomberEvents() {
    bus.register("AbbEventBombsAway", e => {
      let f = e.detail.fighter;
      let bomb = GOFactory.FACTORY.getBomb(f);
      this.tempObjects.push(bomb);
      bomb.addTarget(this.strip);
      if (this.addGunner)
        bomb.addTarget(this.gunner.damagable);
      if (this.addRoller)
        bomb.addTarget(this.roller.damagable);
      this.tempObjects.filter( b => b instanceof Bullet && b.active && b.firedBy == BLUE_TEAM )
        .forEach( b => b.addTarget(bomb.damagable) );
    });
  }

  setupLCAEvents() {
    bus.register("AbbEventLCAFire", e => {
      let bullet = GOFactory.FACTORY.getBullet(e.detail.pos, e.detail.vel, 3);
      bullet.firedBy = GREEN_TEAM;
      this.tempObjects.push(bullet);
      if (this.addGunner)
        bullet.addTarget(this.gunner.damagable);
      if (this.addRoller)
        bullet.addTarget(this.roller.damagable);
    });
  }

  setupKamikazeEvents() {
    bus.register("AbbEventFighterKamikaze", e => {
      let f = e.detail.fighter;
      this.tempObjects.push(...GOFactory.FACTORY.getFighterBlast(f, false));
      let fi = this.gFighters.indexOf(f);
      if (fi >= 0) {
        this.gFighters.splice(fi, 1);
      }
    });
  }

  setupEventsForPlayer() {
    this.setupEventsForCauseAndEffects();
    if (this.addGunner) this.setupGunnerEvents();
    if (this.addRoller) this.setupRollerEvents()
    if (this.addSAM) this.setupSAMEvents();
  }

  setupEventsForCauseAndEffects() {
    bus.register("AbbEventBombExplode", e => 
      this.tempObjects.push(...GOFactory.FACTORY.getBombBlast(e.detail.bomb)));
    bus.register("AbbEventVehicleExhaust", e => 
      this.tempObjects.push(GOFactory.FACTORY.getExhaust(e.detail.pos, e.detail.vel)));
    bus.register("AbbEventVehicleBurn", e => 
      this.tempObjects.push(...GOFactory.FACTORY.getVehicleBurn(e.detail.x, e.detail.y)));

    bus.register("AbbEventVehiclePoweredUp", () => this.powerUpActive = false);
  }

  setupGunnerEvents() {
    bus.register("AbbEventGunnerDown", e => 
      this.tempObjects.push(...GOFactory.FACTORY.getVehicleBlast(e.detail.gunner)));
    bus.register("AbbEventFireBullet", e => {
      let bullet = GOFactory.FACTORY.getBullet(e.detail.pos, e.detail.vel, e.detail.damage);
      this.tempObjects.push(bullet);
      this.gFighters.forEach( f => bullet.addTarget(f.damagable) );
      this.tempObjects.filter( b => b instanceof Bomb ).filter( b => b.active )
        .forEach( b => bullet.addTarget(b.damagable) );
    });
  }

  setupRollerEvents() {
    bus.register("AbbEventEngineerFix", e => 
      this.strip.repair(e.detail.amt, e.detail.x, e.detail.y));
    bus.register("AbbEventRollerDown", e => 
      this.tempObjects.push(...GOFactory.FACTORY.getVehicleBlast(e.detail.roller)));
  }

  setupSAMEvents() {
    bus.register("AbbEventMissileAway", e => this.tempObjects.push(e.detail.missile));
  }

  enter() {
    this.gameOverCount = 120;
    this.resetEnabled = this.sceneArgs.reset;
    if (this.sceneArgs.endGame) this.showResults();
    if (this.sceneArgs.animate) this.animating = this.sceneArgs.animate;
    if (this.resetEnabled) this.reset();
  }

  reset() {
    this.resetControlValues();
    this.resetGameObjects();

    if (bgSoundOn) {
      this.song = getSong();
      this.song.start();
    }
  }

  resetControlValues() {
    this.ticks = 0;
    this.powerUpN = 0;
    this.powerUpActive = false;
    this.animating = true;
    this.killStats = { kills: 0, perfects:0 };
  }

  resetGameObjects() {
    this.gFighters = [];
    this.tempObjects = [];
    this.strip = GOFactory.FACTORY.getAirStrip();
    GOFactory.FACTORY.returnAllFightersToPool();
    this.addBombers();
    if (this.addGunner) this.resetGunner();
    if (this.addRoller) this.resetRoller();
    if (this.addSAM) this.resetSAM();
  }

  addBombers() {
    if (this.gFighters.filter(f => f.type == 'bomber').length > 0) return;
    this.bomberAddWithDelay();
  }

  resetGunner() {
    this.gunner = GOFactory.FACTORY.getAntiAircraftGun();
    this.gunner.setRange(50, 590);
    this.commandProcessor.addCommand(PlayCommons.KEY_D, this.gunner.moveRight);
    this.commandProcessor.addCommand(PlayCommons.KEY_A, this.gunner.moveLeft);
    this.commandProcessor.addCommand(PlayCommons.KEY_S, this.gunner.act);
  }

  resetRoller() {
    this.roller = GOFactory.FACTORY.getRoadRoller();
    this.roller.setRange(50, 590);
    this.commandProcessor.addCommand(PlayCommons.KEY_L, this.roller.moveRight);
    this.commandProcessor.addCommand(PlayCommons.KEY_J, this.roller.moveLeft);
    this.commandProcessor.addCommand(PlayCommons.KEY_K, this.roller.act);
  }

  resetSAM() {
    this.sam = GOFactory.FACTORY.getSAM();
    this.sam.setRange(605, 660);
    this.sam.showHealth = false;
    this.sam.targets = this.gFighters;
    this.samAI = new SAMAIAssist(this.sam);
  }

  draw() {
    background(bgColor);
    this.bg.show();
    this.strip.show();
    this.gFighters.forEach( f => f.show() );
    if (this.addRoller) this.roller.show();
    if (this.addGunner) this.gunner.show();
    if (this.addSAM) this.sam.show();
    if (this.tempObjects.length > 100) {
      this.tempObjects = this.tempObjects.filter( t => t.active );
    }
    this.tempObjects.forEach( t => t.show() );
    this.animate();
  }

  animate() {
    if (!this.animating) return;
    if (this.gameOverCount >= 0 && this.gameOver()) {
      this.gameOverCount--;
      if (this.gameOverCount == 0) {
        this.showResults();
      }
    }
    this.bg.animate();
    this.gFighters.forEach( f => f.animate() );
    this.tempObjects.forEach( t => t.animate() );
    this.addBombers();
    this.ticks++;

    if (this.hasEnemyKamikazes) this.kamikazesAddWithDelay();
    if (this.hasEnemyLCAs) this.LCAAddWithDelay();
    if (this.addGunner) this.gunner.animate();
    if (this.addRoller) this.roller.animate();
    if (this.addSAM) {
      this.samAI.run();
      this.sam.animate();
    }
    if (!this.powerUpActive) this.powerUpAddWithDelay();
    this.commandProcessor.run();
  }

}

PlayCommons.KEY_J = 74;
PlayCommons.KEY_K = 75;
PlayCommons.KEY_L = 76;
PlayCommons.KEY_A = 65;
PlayCommons.KEY_S = 83;
PlayCommons.KEY_D = 68;

PlayCommons.POWER_LOCATIONS = [125, 240, 350, 480];

class KeyDownCommandProcessor {
  constructor() {
    this.keyMap = new Map();
  }
  addCommand(key, command) {
    this.keyMap.set(key, command);
  }
  run() {
    this.keyMap.forEach((value, key) => {
      if(keyIsDown(key)) {
        value();
      }
    });
  }
}