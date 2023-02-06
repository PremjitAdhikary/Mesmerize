class Training extends BasicGameManager {

  constructor() {
    super();
    this.song = new TrainingTheme();
  }

  enter() {
    super.enter();
    this.songStarted = false;
    this.setupEvents();
    this.okToMenu.hide();
    this.cancelToGame.hide();
  }

  buildHero() {
    let hero = AllCharacters.INSTANCE().buildRam({
      x: GameCamera.OFFSET_X, y : 370, 
      lifeMultiplier: 1, 
      armorMultiplier: 1, 
      strengthMultiplier: 1, 
      cSprite: ramSpriteColored, 
      stylizedArrow: true, 
      id: this.idGenerator()
    });
    return hero;
  }

  buildNpcs(hero) {
    let npcs = [];
    this.firstVanara = this.buildDummyNpc(hero, width*1.7);
    npcs.push(this.firstVanara);

    this.secondVanara = this.buildDummyNpc(hero, width*1.7+300);
    this.secondVanara.enableAction(CHAR_FORWARD);
    this.thirdVanara = this.buildDummyNpc(hero, width*1.7+345);
    this.thirdVanara.enableAction(CHAR_FORWARD);
    npcs.push(this.secondVanara);
    npcs.push(this.thirdVanara);

    this.attackingVanara = this.buildDummyNpc(hero, width*1.7+300, 90);
    this.attackingVanara.enableAction(CHAR_FORWARD);
    npcs.push(this.attackingVanara);
    
    return npcs;
  }

  buildDummyNpc(hero, x, overallInitiative = 0) {
    let vanara = AllCharacters.INSTANCE().buildVanara({
      x, y : 370, 
      lifeMultiplier: 0.1, 
      armorMultiplier: 0, 
      strengthMultiplier: 3, 
      viewRangeMultiplier: 1,
      overallInitiative, 
      cSprite: vanaraSpriteColored, 
      lifeColor: SketchColor.black().stringify(), 
      effectColor: SketchColor.black(), 
      hero, 
      id: this.idGenerator()
    });
    return vanara;
  }

  configureNpcAi(hero, npcs) {
    return new NpcAi(hero, npcs);
  }

  buildEnvironment() {
    return BgEnv.setupSlimForest();
  }

  showGameSpecificGraphics() {
    if (!this.engine.gameLoaded) return;
    if (!this.songStarted) {
      this.song.start();
      this.songStarted = true;
    }
    this.eventManager.run();
  }

  executeGameOver() {
    this.addInteractiveInfoBanner(
      'You Lost', [
        'Seriously? How can you lose at training?', ' ', 
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
    this.song.stop();
  }

  enablePauseScreen() {
    return;
  }

  disablePauseScreen() {
    return;
  }

  getHint() {
    return '';
  }

  setupEvents() {
    this.eventManager = new GameEventManager(this.gameId);
    this.addStartEvent();
    this.addPrimaryAttackEvent();
    this.addPrimaryAttackExecutedEvent();
    this.addSecondaryAttackEvent();
    this.addSecondaryAttackExecutedEvent();
    this.addDefendEvent();
    this.addTrainingOverEvent();
  }

  addStartEvent() {
    this.eventManager.addEvent(
      () => this.engine.gameLoaded && this.engine.hero.x > -1, 
      () => eventBus.dispatch(Training.START_EVENT, { })
    );
    eventBus.register(Training.START_EVENT, () => 
      this.addInteractiveInfoBanner(Training.START_EVENT_TITLE, Training.START_EVENT_DESCRIPTION, 
        () => eventBus.dispatch(Training.START_EVENT_OK, { })
      ));
    eventBus.register(Training.START_EVENT_OK, () => {
      this.engine.hero.enableAction(CHAR_FORWARD);
      this.engine.pauseAnimation = false;
    });
  }

  addPrimaryAttackEvent() {
    this.eventManager.addEvent(
      () => this.engine.hero.x > width * 1.15, 
      () => eventBus.dispatch(Training.LEARN_TO_ATTACK, { })
    );
    eventBus.register(Training.LEARN_TO_ATTACK, () => {
      this.addInteractiveInfoBanner(
        Training.LEARN_TO_ATTACK_TITLE, Training.LEARN_TO_ATTACK_DESCRIPTION, 
        () => eventBus.dispatch(Training.LEARN_TO_ATTACK_OK, { })
      );
      eventBus.dispatch(this.engine.hero.id, { action: CHAR_STOP });
    });
    eventBus.register(Training.LEARN_TO_ATTACK_OK, () => {
      this.engine.hero.disableAction(CHAR_FORWARD);
      eventBus.dispatch(Training.PRIMARY_ATTACK, { })
    });
    eventBus.register(Training.PRIMARY_ATTACK, () => 
      this.addInteractiveInfoBanner(
        Training.PRIMARY_ATTACK_TITLE, Training.PRIMARY_ATTACK_DESCRIPTION, 
        () => eventBus.dispatch(Training.PRIMARY_ATTACK_OK, { })
      ));
    eventBus.register(Training.PRIMARY_ATTACK_OK, () => {
      this.engine.hero.enableAction(CHAR_PRIMARY_ATTACK);
      this.engine.pauseAnimation = false;
    });
  }

  addPrimaryAttackExecutedEvent() {
    this.eventManager.addEvent(
      () => !this.firstVanara.active, 
      () => eventBus.dispatch(Training.PRIMARY_ATTACK_EXECUTED, { })
    );
    eventBus.register(Training.PRIMARY_ATTACK_EXECUTED, () => 
      this.addInteractiveInfoBanner(
        Training.PRIMARY_ATTACK_EXECUTED_TITLE, Training.PRIMARY_ATTACK_EXECUTED_DESCRIPTION, 
        () => eventBus.dispatch(Training.PRIMARY_ATTACK_EXECUTED_OK, { })
      ));
    eventBus.register(Training.PRIMARY_ATTACK_EXECUTED_OK, () => {
      eventBus.dispatch(this.engine.hero.id, { action: CHAR_STOP });
      this.engine.hero.disableAction(CHAR_PRIMARY_ATTACK);
      eventBus.dispatch(Training.BRING_VANARAS_TO_HERO, { })
    });
    eventBus.register(Training.BRING_VANARAS_TO_HERO, () => {
      eventBus.dispatch(this.secondVanara.id, { action: CHAR_FORWARD });
      eventBus.dispatch(this.thirdVanara.id, { action: CHAR_FORWARD });
      this.engine.pauseAnimation = false;
    });
  }

  addSecondaryAttackEvent() {
    this.eventManager.addEvent(
      () => this.secondVanara.x < width*1.7, 
      () => eventBus.dispatch(Training.VANARAS_NEAR_HERO, { })
    );
    eventBus.register(Training.VANARAS_NEAR_HERO, () => {
      eventBus.dispatch(this.secondVanara.id, { action: CHAR_STOP });
      eventBus.dispatch(this.thirdVanara.id, { action: CHAR_STOP });
      eventBus.dispatch(Training.SECONDARY_ATTACK, { })
    });
    eventBus.register(Training.SECONDARY_ATTACK, () => 
      this.addInteractiveInfoBanner(
        Training.SECONDARY_ATTACK_TITLE, Training.SECONDARY_ATTACK_DESCRIPTION, 
        () => eventBus.dispatch(Training.SECONDARY_ATTACK_OK, { })
      ));
    eventBus.register(Training.SECONDARY_ATTACK_OK, () => {
      this.engine.hero.enableAction(CHAR_SECONDARY_ATTACK);
      this.engine.pauseAnimation = false;
    });
  }

  addSecondaryAttackExecutedEvent() {
    this.eventManager.addEvent(
      () => !this.secondVanara.active && !this.thirdVanara.active , 
      () => eventBus.dispatch(Training.SECONDARY_ATTACK_EXECUTED, { })
    );
    eventBus.register(Training.SECONDARY_ATTACK_EXECUTED, () => 
      this.addInteractiveInfoBanner(
        Training.SECONDARY_ATTACK_EXECUTED_TITLE, Training.SECONDARY_ATTACK_EXECUTED_DESCRIPTION, 
        () => eventBus.dispatch(Training.SECONDARY_ATTACK_EXECUTED_OK, { })
      ));
    eventBus.register(Training.SECONDARY_ATTACK_EXECUTED_OK, () => {
      eventBus.dispatch(this.engine.hero.id, { action: CHAR_STOP });
      this.engine.hero.disableAction(CHAR_SECONDARY_ATTACK);
      eventBus.dispatch(Training.BRING_ATTACKER_TO_HERO, { })
    });
    eventBus.register(Training.BRING_ATTACKER_TO_HERO, () => {
      eventBus.dispatch(this.attackingVanara.id, { action: CHAR_FORWARD });
      this.engine.pauseAnimation = false;
    });
  }

  addDefendEvent() {
    this.eventManager.addEvent(
      () => this.attackingVanara.x < width*1.7 - 300, 
      () => eventBus.dispatch(Training.ATTACKER_NEAR_HERO, { })
    );
    eventBus.register(Training.ATTACKER_NEAR_HERO, () => {
      eventBus.dispatch(this.attackingVanara.id, { action: CHAR_STOP });
      this.attackingVanara.disableAction(CHAR_FORWARD);
      eventBus.dispatch(Training.DEFEND, { })
    });
    eventBus.register(Training.DEFEND, () => 
      this.addInteractiveInfoBanner(
        Training.DEFEND_TITLE, Training.DEFEND_DESCRIPTION, 
        () => eventBus.dispatch(Training.DEFEND_OK, { })
      ));
    eventBus.register(Training.DEFEND_OK, () => {
      this.engine.hero.enableAction(CHAR_DEFEND);
      this.attackingVanara.enableAction(CHAR_FORWARD);
      this.attackingVanara.enableAction(CHAR_PRIMARY_ATTACK);
      this.engine.pauseAnimation = false;
    });
  }

  addTrainingOverEvent() {
    this.eventManager.addEvent(
      () => this.engine.hero.x < 0, 
      () => eventBus.dispatch(Training.TRAINING_OVER, { })
    );
    eventBus.register(Training.TRAINING_OVER, () => {
      this.addInteractiveInfoBanner(
        Training.TRAINING_OVER_TITLE, Training.TRAINING_OVER_DESCRIPTION, 
        () => eventBus.dispatch(Training.TRAINING_OVER_OK, { })
      );
      eventBus.dispatch(this.engine.hero.id, { action: CHAR_STOP });
      eventBus.dispatch(this.attackingVanara.id, { action: CHAR_STOP });
      this.engine.hero.disableAction(CHAR_DEFEND);
      this.attackingVanara.disableAction(CHAR_FORWARD);
      this.attackingVanara.disableAction(CHAR_PRIMARY_ATTACK);
      this.engine.pauseAnimation = true;
    });
    eventBus.register(Training.TRAINING_OVER_OK, () => {
      this.exitGame();
      manager.showScene(GameMenu);
    });
  }

}

Training.START_EVENT = 'StartEvent';
Training.START_EVENT_OK = 'StartEventOk';
Training.START_EVENT_TITLE = 'A humble Start';
Training.START_EVENT_DESCRIPTION = [
  'Every Heroic Journey starts with a First Step', 
  'Learn to navigate through the forests of Kishkindha', ' ', 
  'Hold down Left mouse Button in front of the hero to move forward', 
  'Keep moving forward to the next lesson', ' ', 
  'Click on OK to continue training'
];

Training.LEARN_TO_ATTACK = 'LearnToAttackEvent';
Training.LEARN_TO_ATTACK_OK = 'LearnToAttackEventOk';
Training.LEARN_TO_ATTACK_TITLE = 'Dealing with Enemies';
Training.LEARN_TO_ATTACK_DESCRIPTION = [
  'Excellent, now you know how to move Forward', 
  'Next you need to learn to attack the enemies you find in the forests of Kishkindha', ' ', 
  'You have two attack skills at your disposal', 
  '  Your Primary Skill is to shoot a single arrow at your enemy target', 
  '  Your Secondary Skill is to shoot multiple arrows at multiple targets', ' ',  
  'Click on OK to continue training'
];

Training.PRIMARY_ATTACK = 'PrimaryAttackEvent';
Training.PRIMARY_ATTACK_OK = 'PrimaryAttackEventOk';
Training.PRIMARY_ATTACK_TITLE = 'Learn Primary Attack Skill';
Training.PRIMARY_ATTACK_DESCRIPTION = [
  'Look, there is a Vanara before you', 
  'He has not seen you yet, let\'s attack before he notices you', ' ', 
  'Left Click to shoot a single arrow at the enemy',  ' ',  
  'Click on OK to continue training'
];

Training.PRIMARY_ATTACK_EXECUTED = 'PrimaryAttackExecutedtEvent';
Training.PRIMARY_ATTACK_EXECUTED_OK = 'PrimaryAttackExecutedEventOk';
Training.PRIMARY_ATTACK_EXECUTED_TITLE = 'There is more to learn';
Training.PRIMARY_ATTACK_EXECUTED_DESCRIPTION = [
  'Excellent! You have learnt to use your Primary Skill', 
  'Now what if you encounter multiple enemies in Kishkindha forest?', ' ', 
  'That\'s where your Secondary Skill will come in handy', ' ',  
  'Click on OK to continue training'
];

Training.BRING_VANARAS_TO_HERO = 'BringVanarasToHeroEvent';
Training.VANARAS_NEAR_HERO = 'VanarasNearHeroEvent';

Training.SECONDARY_ATTACK = 'SecondaryAttackEvent';
Training.SECONDARY_ATTACK_OK = 'SecondaryAttackEventOk';
Training.SECONDARY_ATTACK_TITLE = 'Learn Secondary Attack Skill';
Training.SECONDARY_ATTACK_DESCRIPTION = [
  'Now you have a couple of Vanaras before you', 
  'Excellent opportunity for you to execute your Secondary Skill', ' ', 
  'Right Click to shoot multiple arrows at the enemy', ' ',  
  'Click on OK to continue training'
];

Training.SECONDARY_ATTACK_EXECUTED = 'SecondaryAttackExecutedtEvent';
Training.SECONDARY_ATTACK_EXECUTED_OK = 'SecondaryAttackExecutedtEventOk';
Training.SECONDARY_ATTACK_EXECUTED_TITLE = 'And now to Defend';
Training.SECONDARY_ATTACK_EXECUTED_DESCRIPTION = [
  'Excellent! You have learnt how to attack', 
  'But there are times when it is best to take a defensive approach', ' ', 
  'Click on OK to continue training'
];

Training.BRING_ATTACKER_TO_HERO = 'BringAttackerToHeroEvent';
Training.ATTACKER_NEAR_HERO = 'AttackerNearHeroEvent';

Training.DEFEND = 'DefendEvent';
Training.DEFEND_OK = 'DefendEventOk';
Training.DEFEND_TITLE = 'Learn to Defend';
Training.DEFEND_DESCRIPTION = [
  'Another Vanara has come', 
  'He looks angry', 
  'Maybe he wants to avenge his fallen brothers', ' ', 
  'Hold down Left mouse Button behind the hero to defend and move back', 
  'Keep moving back to the next lesson', ' ', 
  'Click on OK to continue training'
];

Training.TRAINING_OVER = 'TrainingOverEvent';
Training.TRAINING_OVER_OK = 'TrainingOverEventOk';
Training.TRAINING_OVER_TITLE = 'Training Over';
Training.TRAINING_OVER_DESCRIPTION = [
  'Excellent, you have evaded and defended yourself well', 
  'Your training is done', 
  'Explore the forests of Kishkindha and defeat the mighty Vali', ' ', ' ', 
  'Click on OK to return to Main Menu'
];