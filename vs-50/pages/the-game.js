class TheGame extends BasicGameManager {

  constructor() {
    super();
    this.song = new HeroTheme();
    this.iconBG = SketchColor.white().alpha(0.4).stringify();
    this.iconBGStylized = SketchColor.black().alpha(0.2).stringify();
    this.lifeColor = 0;
    this.lifeColorStylized = (new SketchColor(168, 10, 10)).stringify();
    this.borderColor = 0;
    this.borderColorStylized = SketchColor.gold().stringify();
  }

  enter() {
    super.enter();
    this.songStarted = false;
    this.setupEvents();
  }

  buildHero() {
    let hero = AllCharacters.INSTANCE().buildRam({
      x: GameCamera.OFFSET_X, y : 370, 
      lifeMultiplier: 1, 
      armorMultiplier: 1, 
      strengthMultiplier: 1, 
      cSprite: this.sceneArgs.bwEnabled ? ramSprite : ramSpriteColored, 
      stylizedArrow: !this.sceneArgs.bwEnabled, 
      id: this.idGenerator()
    });
    hero.enableAction(CHAR_FORWARD);
    hero.enableAction(CHAR_DEFEND);
    hero.enableAction(CHAR_PRIMARY_ATTACK);
    hero.enableAction(CHAR_SECONDARY_ATTACK);
    return hero;
  }

  buildNpcs(hero) {
    this.gameDifficulty = this.sceneArgs.difficulty;
    let npcs = [];
    let gap = (width * 1.1);
    let npcX = gap;
    let lifeColor = (this.sceneArgs.bwEnabled ? SketchColor.black() : new SketchColor(168, 10, 10)).stringify();
    let effectColor = (this.sceneArgs.bwEnabled ? SketchColor.black() : SketchColor.grey());
    let paramsBuilder = (x, overallInitiative, cSprite) => {
      return {
        x, y : 370, 
        lifeMultiplier: TheGame.NPC_LIFE_DIFFICULTY_MAPPER.get(this.gameDifficulty), 
        armorMultiplier: TheGame.NPC_ARMOR_DIFFICULTY_MAPPER.get(this.gameDifficulty), 
        strengthMultiplier: TheGame.NPC_STRENGTH_DIFFICULTY_MAPPER.get(this.gameDifficulty), 
        viewRangeMultiplier: TheGame.NPC_VIEW_RANGE_DIFFICULTY_MAPPER.get(this.gameDifficulty), 
        overallInitiative, cSprite, lifeColor, effectColor, hero, 
        id: this.idGenerator()
      };
    };
    let enableNpcActions = npc => {
      npc.enableAction(CHAR_FORWARD);
      npc.enableAction(CHAR_PRIMARY_ATTACK);
      npc.enableAction(CHAR_SECONDARY_ATTACK);
      return npc;
    };
    for (let i=0; i<TheGame.NPC_LINEUP.length; i++) {
      for (let j=0; j<TheGame.NPC_LINEUP[i].length; j++) {
        switch(TheGame.NPC_LINEUP[i].charAt(j)) {
          case 'v':
            npcs.push(enableNpcActions(
              AllCharacters.INSTANCE().buildVanara(
                paramsBuilder(npcX, 
                  85+TheGame.NPC_OVERALL_INITIATIVE_DIFFICULTY_MAPPER.get(this.gameDifficulty), 
                  (this.sceneArgs.bwEnabled ? vanaraSprite : vanaraSpriteColored)) ))
              );
            npcX += Math.ceil(random(30, 70));
            break;
          case 'j':
            npcs.push(enableNpcActions(
              AllCharacters.INSTANCE().buildJambuvan(
                paramsBuilder(npcX, 
                  60+TheGame.NPC_OVERALL_INITIATIVE_DIFFICULTY_MAPPER.get(this.gameDifficulty), 
                  (this.sceneArgs.bwEnabled ? jambuvanSprite : jambuvanSpriteColored)) ))
              );
            npcX += Math.ceil(random(30, 70));
            break;
          case 'b':
            npcs.push(enableNpcActions(
              AllCharacters.INSTANCE().buildVali(
                paramsBuilder(npcX, 
                  75+TheGame.NPC_OVERALL_INITIATIVE_DIFFICULTY_MAPPER.get(this.gameDifficulty), 
                  (this.sceneArgs.bwEnabled ? valiSprite : valiSpriteColored)) ))
              );
            npcX += Math.ceil(random(30, 70));
            break;
        }
      }
      npcX += gap;
    }
    return npcs;
  }

  buildEnvironment() {
    return this.sceneArgs.bwEnabled ? BgEnv.setupForest() : BgEnv.setupStylizedForest();
  }

  configureNpcAi(hero, npcs) {
    return new NpcAi(hero, npcs, 
      TheGame.MAX_NPCS_TO_ENGAGE_HERO.get(this.sceneArgs.difficulty));
  }

  getHint() {
    return random([
      'Be careful! If you injure an enemy but dont finish him off, he will heal up...', 
      'Did you know that the Hero heals at a small pace? So if you are low on health, be patient and wait for a while!', 
      'Blessings are great! But to get the most out of them, adjust your play style!', 
      'Did you know that once you hit an enemy, he will definitely attack you back? Use your Secondary attack wisely!', 
      'In this game Rapid Clicking won\'t get you anywhere. Timing is the key!', 
      'Bear in mind that at higher difficulties, playing defensive no longer remains optional!'
    ]);
  }

  enablePauseScreen() {
    this.engine.pauseAnimation = true;
    super.enablePauseScreen();
  }

  disablePauseScreen() {
    this.engine.pauseAnimation = false;
    super.disablePauseScreen();
  }

  setupEvents() {
    this.heroStrengthPoweredUp = false;
    this.heroArmorPoweredUp = false;
    this.heroSpeedPoweredUp = false;
    this.heroHealthPoweredUp = false;
    this.eventManager = new GameEventManager(this.gameId);
    this.addFirstPowerUpEvent();
    this.addSecondPowerUpEvent();
  }

  addFirstPowerUpEvent() {
    this.eventManager.addEvent(
      () => this.engine.npcs.filter(npc => !npc.active).length >= 21, 
      () => eventBus.dispatch(TheGame.FIRST_POWER_UP, { })
    );
    eventBus.register(TheGame.FIRST_POWER_UP, () => {
        let attackPower = NpcAi.isSuccess(50);
        if (attackPower && !this.heroStrengthPoweredUp) {
          this.addNonInteractiveInfoBanner(
            TheGame.STRENGTH_POWER_UP_TITLE, TheGame.STRENGTH_POWER_UP_DESCRIPTION, () => { }, 300);
          this.powerUpHeroStrength();
        } else if (!attackPower && !this.heroArmorPoweredUp) {
          this.addNonInteractiveInfoBanner(
            TheGame.ARMOR_POWER_UP_TITLE, TheGame.ARMOR_POWER_UP_DESCRIPTION, () => { }, 300);
          this.powerUpHeroArmor();
        }
    });
  }

  addSecondPowerUpEvent() {
    this.eventManager.addEvent(
      () => this.engine.npcs.filter(npc => !npc.active).length >= 32, 
      () => eventBus.dispatch(TheGame.SECOND_POWER_UP, { })
    );
    eventBus.register(TheGame.SECOND_POWER_UP, () => {
        let attackPower = NpcAi.isSuccess(50);
        if (attackPower && !this.heroSpeedPoweredUp) {
          this.addNonInteractiveInfoBanner(
            TheGame.SPEED_POWER_UP_TITLE, TheGame.SPEED_POWER_UP_DESCRIPTION, () => { }, 300);
          this.powerUpHeroSpeed();
        } else if (!attackPower && !this.heroHealthPoweredUp) {
          this.addNonInteractiveInfoBanner(
            TheGame.HEALTH_POWER_UP_TITLE, TheGame.HEALTH_POWER_UP_DESCRIPTION, () => { }, 300);
          this.powerUpHeroHealth();
        }
    });
  }

  powerUpHeroStrength() {
    if (this.heroStrengthPoweredUp) return;
    this.heroStrengthPoweredUp = true;
    this.engine.hero.chAttributes.strengthMultiplier 
      = TheGame.HERO_STRENGTH_ENHANCE_DIFFICULTY_MAPPER.get(this.sceneArgs.difficulty);
  }

  powerUpHeroArmor() {
    if (this.heroArmorPoweredUp) return;
    this.heroArmorPoweredUp = true;
    this.engine.hero.chAttributes.armorMultiplier 
      = TheGame.HERO_ARMOR_ENHANCE_DIFFICULTY_MAPPER.get(this.sceneArgs.difficulty);
  }

  powerUpHeroSpeed() {
    if (this.heroSpeedPoweredUp) return;
    this.heroSpeedPoweredUp = true;
    this.engine.hero.chAttributes
      .getAction(AllStates.PRIMARY_ATTACK.name).cooldownMultiplier = 0.5;
    this.engine.hero.chAttributes
      .getAction(AllStates.SECONDARY_ATTACK.name).cooldownMultiplier = 0.4;
  }

  powerUpHeroHealth() {
    if (this.heroHealthPoweredUp) return;
    this.heroHealthPoweredUp = true;
    this.engine.hero.regenerateInterval = 72;
  }

  executeGameOver(e) {
    let firstLine = (
      e.result == HERO_LOST ? 
      (this.sceneArgs.difficulty == 'easy' ? 
          'A little Training might help here' : 'Try again at a lower difficulty Level') 
        : 
      'You defeated all the enemies at ' + this.sceneArgs.difficulty + ' difficulty Level'
    );
    this.addInteractiveInfoBanner(
      (e.result == HERO_WON ? 'You Won' : 'You Lost'), [
        firstLine, ' ', 
        'Click on OK to go back to Main Menu'
      ], 
      () => {
        this.exitGame();
        manager.showScene(GameMenu);
      }
    );
  }

  exitGame() {
    super.exitGame();
    if (this.sceneArgs.audioEnabled)
      this.song.stop();
  }

  showGameSpecificGraphics() {
    if (!this.engine.gameLoaded) return;
    if (!this.songStarted && this.sceneArgs.audioEnabled) {
      this.song.start();
      this.songStarted = true;
    }
    this.eventManager.run();
    this.showLife();
    this.showAllIcons();
    this.showGameInfo();
  }

  showLife() {
    let d = 70;
    let x = d/2 + 5;
    let y = d/2 + 5;
    noStroke();
    fill(this.iconBG);
    circle(x, y, d);
    fill(this.sceneArgs.bwEnabled ? this.lifeColor : this.lifeColorStylized);
    let lifeAngle = map(this.engine.hero.chAttributes.currentLife, 
      0, this.engine.hero.chAttributes.maxLife, 90, -90);
    arc(x, y, d-2, d-2, radians(lifeAngle), radians(180-lifeAngle), CHORD);
    stroke(this.sceneArgs.bwEnabled ? this.borderColor : this.borderColorStylized);
    strokeWeight(3);
    noFill();
    circle(x, y, d);
  }

  showAllIcons() {
    let spriteX = 105;
    let spriteY = 30;
    let xGap = 55;
    this.showInfoForAction(this.engine.hero.chAttributes.getAction(CHAR_PRIMARY_ATTACK), 
      CHAR_PRIMARY_ATTACK, spriteX, spriteY, 
      TheGame.ACTION_ICONS(CHAR_PRIMARY_ATTACK, this.sceneArgs.bwEnabled));
    spriteX += xGap;
    this.showInfoForAction(this.engine.hero.chAttributes.getAction(CHAR_SECONDARY_ATTACK), 
      CHAR_SECONDARY_ATTACK, spriteX, spriteY, 
      TheGame.ACTION_ICONS(CHAR_SECONDARY_ATTACK, this.sceneArgs.bwEnabled));
    
    if (this.heroStrengthPoweredUp) {
      spriteX += xGap;
      this.showInfoForBlessing(spriteX, spriteY, 
        TheGame.ACTION_ICONS('strength', this.sceneArgs.bwEnabled));
    }
    if (this.heroArmorPoweredUp) {
      spriteX += xGap;
      this.showInfoForBlessing(spriteX, spriteY, 
        TheGame.ACTION_ICONS('armor', this.sceneArgs.bwEnabled));
    }
    if (this.heroHealthPoweredUp) {
      spriteX += xGap;
      this.showInfoForBlessing(spriteX, spriteY, 
        TheGame.ACTION_ICONS('health', this.sceneArgs.bwEnabled));
    }
    if (this.heroSpeedPoweredUp) {
      spriteX += xGap;
      this.showInfoForBlessing(spriteX, spriteY, 
        TheGame.ACTION_ICONS('speed', this.sceneArgs.bwEnabled));
    }
  }

  showInfoForAction(action, state, x, y, sprite) {
    noStroke();
    fill(this.sceneArgs.bwEnabled ? this.iconBG : this.iconBGStylized);
    circle(x, y, 50);
    image(sprite, x - 25, y - 25);
    stroke(this.sceneArgs.bwEnabled ? this.borderColor : this.borderColorStylized);
    strokeWeight(3);
    noFill();
    circle(x, y, 50);
    if (action.executed) {
      fill(this.inactiveColor);
      let attributeAngle = map(action.currentCooldown, 0, action.cooldown, 0, TWO_PI);
      arc(x, y, 50, 50, TWO_PI-HALF_PI, -HALF_PI+attributeAngle);
    }
    if (!this.engine.hero.enabledActions.includes(state)) {
      fill(this.inactiveColor);
      circle(x, y, 50);
    }
  }

  showInfoForBlessing(x, y, sprite) {
    noStroke();
    fill(this.sceneArgs.bwEnabled ? this.iconBG : this.iconBGStylized);
    circle(x, y, 50);
    image(sprite, x - 25, y - 25);
    stroke(this.sceneArgs.bwEnabled ? this.borderColor : this.borderColorStylized);
    strokeWeight(3);
    noFill();
    circle(x, y, 50);
  }

  showGameInfo() {
    noStroke();
    fill(this.infoBGColor);
    let rectHeight = debug ? 60 : 20;
    let infoX = 10, infoY = 90;
    rect(infoX, infoY, 130, rectHeight);
    stroke(this.infoColor);
    strokeWeight(0);
    fill(this.infoColor);
    textSize(16);
    textFont(gameFont);
    text('Enemies Left: '+this.engine.npcs.filter(npc => npc.active).length.toFixed(0), 
      infoX + 10, infoY + 15);
    if (debug) {
      textSize(12);
      textFont('sans-serif');
      text('FrameRate: '+frameRate().toFixed(2), infoX + 20, infoY + 35);
      text('currX: '+this.engine.camera.currX, infoX + 20, infoY + 55);
    }
  }

}

TheGame.NPC_LINEUP = [
  "v", "vvv", "vvvvvv", "vvvvvvvvvv", "j", 
  "vv", "j", "vj", "vvj", "vjj", 
  "vvvjvj", "vvvjvj", "vvvvv", "b"
];
TheGame.NPC_LIFE_DIFFICULTY_MAPPER = new Map([
  ['easy', 1], ['normal', 1.5], ['hard', 2.5]
]);
TheGame.NPC_ARMOR_DIFFICULTY_MAPPER = new Map([
  ['easy', 1], ['normal', 2], ['hard', 3]
]);
TheGame.NPC_STRENGTH_DIFFICULTY_MAPPER = new Map([
  ['easy', 1], ['normal', 2], ['hard', 4]
]);
TheGame.NPC_VIEW_RANGE_DIFFICULTY_MAPPER = new Map([
  ['easy', 1], ['normal', 1.05], ['hard', 1.2]
]);
TheGame.NPC_OVERALL_INITIATIVE_DIFFICULTY_MAPPER = new Map([
  ['easy', 0], ['normal', 4], ['hard', 10]
]);
TheGame.HERO_STRENGTH_ENHANCE_DIFFICULTY_MAPPER = new Map([
  ['easy', 2], ['normal', 1.8], ['hard', 1.6]
]);
TheGame.HERO_ARMOR_ENHANCE_DIFFICULTY_MAPPER = new Map([
  ['easy', 3], ['normal', 5], ['hard', 5]
]);
TheGame.MAX_NPCS_TO_ENGAGE_HERO = new Map([
  ['easy', 2], ['normal', 3], ['hard', 5]
]);

TheGame.FIRST_POWER_UP = 'firstPowerEvent';
TheGame.STRENGTH_POWER_UP_TITLE = 'Blessings of Goddess Durga';
TheGame.STRENGTH_POWER_UP_DESCRIPTION = [
  'Goddess Durga shares her strength with you', 
  'Your strength is increased and your attack is more powerful'
];
TheGame.ARMOR_POWER_UP_TITLE = 'Blessings of Lord Shiva';
TheGame.ARMOR_POWER_UP_DESCRIPTION = [
  'Lord Shiva imbues your armor with properties from Shiva Kavaca', 
  'Your armor is increased and damage to you is reduced'
];
TheGame.SECOND_POWER_UP = 'secondPowerEvent';
TheGame.SPEED_POWER_UP_TITLE = 'Blessings of Lord Parashuram';
TheGame.SPEED_POWER_UP_DESCRIPTION = [
  'Lord Parashuram imparts his knowledge of warfare to you', 
  'Your attack speed has increased'
];
TheGame.HEALTH_POWER_UP_TITLE = 'Blessings of Rishi Bhardwaja';
TheGame.HEALTH_POWER_UP_DESCRIPTION = [
  'Rishi Bhardwaja bestows upon you his medical knowledge', 
  'You heal much faster'
];

TheGame.ACTION_ICONS = (action, bwEnabled) => {
  let actionIconMap = new Map([
    [CHAR_PRIMARY_ATTACK, () => actionsIconSprite.get(0, 0, 50, 50)], 
    [CHAR_SECONDARY_ATTACK, () => actionsIconSprite.get(50, 0, 50, 50)], 
    ['strength', () => actionsIconSprite.get(100, 0, 50, 50)], 
    ['armor', () => actionsIconSprite.get(0, 50, 50, 50)], 
    ['health', () => actionsIconSprite.get(50, 50, 50, 50)], 
    ['speed', () => actionsIconSprite.get(100, 50, 50, 50)]
  ]);
  let stylizedActionIconMap = new Map([
    [CHAR_PRIMARY_ATTACK, () => actionsIconSprite.get(0, 150, 50, 50)], 
    [CHAR_SECONDARY_ATTACK, () => actionsIconSprite.get(50, 150, 50, 50)], 
    ['strength', () => actionsIconSprite.get(100, 150, 50, 50)], 
    ['armor', () => actionsIconSprite.get(0, 200, 50, 50)], 
    ['health', () => actionsIconSprite.get(50, 200, 50, 50)], 
    ['speed', () => actionsIconSprite.get(100, 200, 50, 50)]
  ]);
  return (bwEnabled ? actionIconMap.get(action) : stylizedActionIconMap.get(action))();
};