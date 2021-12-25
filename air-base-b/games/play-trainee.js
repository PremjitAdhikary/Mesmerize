class PlayTrainee {

  constructor() {}

  setup() {
    this.bg = new AirBaseBG();
    this.targetOne = new TrainerTarget(310, 100, HALF_PI);
    this.targetOne.active = false;
    this.targetTwo = new TrainerTarget(330, 150, HALF_PI * 3);
    this.targetTwo.active = false;
    this.flag = new TrainerFlag(-100, () => 
      bus.dispatch("AbbEventTraineeStageUpdate", { stage: this.stage.next }));

    this.setupEvents();

    this.stageSetupMap = new Map();
    this.stageSetupMap.set(TraineeStages.GunnerIntro, () => this.gunnerIntroStage());
    this.stageSetupMap.set(TraineeStages.GunnerMoveRight, () => this.gunnerMoveRightStage());
    this.stageSetupMap.set(TraineeStages.GunnerMoveLeft, () => this.gunnerMoveLeftStage());
    this.stageSetupMap.set(TraineeStages.GunnerShoot, () => this.gunnerShootStage());
    this.stageSetupMap.set(TraineeStages.TruckIntro, () => this.truckIntroStage());
    this.stageSetupMap.set(TraineeStages.TruckMoveLeft, () => this.truckMoveLeftStage());
    this.stageSetupMap.set(TraineeStages.TruckMoveRight, () => this.truckMoveRightStage());
    this.stageSetupMap.set(TraineeStages.TruckRepair, () => this.truckRepairStage());
    this.stageSetupMap.set(TraineeStages.SamIntro, () => this.samIntroStage());
    this.stageSetupMap.set(TraineeStages.SamShoot, () => this.samShootStage());
    this.stageSetupMap.set(TraineeStages.Outro, () => this.outroStage());
  }

  setupEvents() {
    bus.register("AbbEventTraineeStageUpdate", e => {
      this.stage = e.detail.stage;
      this.setupStage();
    });
    bus.register("AbbEventVehicleExhaust", e => 
      this.tempObjects.push(GOFactory.FACTORY.getExhaust(e.detail.pos, e.detail.vel)));
    bus.register("AbbEventFireBullet", e => {
      let bullet = GOFactory.FACTORY.getBullet(e.detail.pos, e.detail.vel, e.detail.damage);
      this.tempObjects.push(bullet);
      bullet.addTarget(this.targetOne.damagable);
      bullet.addTarget(this.targetTwo.damagable);
    });
    bus.register("AbbEventTargetExplode", e => {
      this.tempObjects.push(...GOFactory.FACTORY.getBombBlast(e.detail.bomb));
      if (!this.targetOne.active && !this.targetTwo.active)
        bus.dispatch("AbbEventTraineeStageUpdate", { stage: this.stage.next });
    });
    bus.register("AbbEventEngineerFix", e => {
      this.strip.repair(e.detail.amt, e.detail.x, e.detail.y);
      if (this.strip.currHealth == this.strip.health) 
        bus.dispatch("AbbEventTraineeStageUpdate", { stage: this.stage.next });
    });
    bus.register("AbbEventMissileAway", e => this.tempObjects.push(e.detail.missile));
  }

  enter() {
    if (this.sceneArgs.endGame) manager.showScene(Menu);
    if (this.sceneArgs.animate) this.animating = this.sceneArgs.animate;
    if (this.sceneArgs.reset) this.reset();
  }

  reset() {
    this.tempObjects = [];
    this.targetOne.active = false;
    this.targetTwo.active = false;
    this.stage = PlayTrainee.GUNNER_RIGHT;
    this.strip = GOFactory.FACTORY.getAirStrip();
    this.gunner = GOFactory.FACTORY.getAntiAircraftGun(-200, 400, false);
    this.roller = GOFactory.FACTORY.getRoadRoller(740, 400, false);
    this.sam = GOFactory.FACTORY.getSAM(740, 400, false);
    this.sam.loadMissiles();
    this.sam.targets = [this.targetOne, this.targetTwo];

    this.gameOn = false;
    this.modalOn = false;
    this.modalExit = false;
    this.modalText = [];
    this.animating = true;

    this.traineeAI = new TraineeAiAssist(this.gunner, this.roller, this.sam);
    bus.dispatch("AbbEventTraineeStageUpdate", { stage: TraineeStages.GunnerIntro });
  }

  draw() {
    background(bgColor);
    this.bg.show();
    this.strip.show();
    this.flag.show();
    this.targetOne.show();
    this.targetTwo.show();
    this.gunner.show();
    this.roller.show();
    this.sam.show();
    this.tempObjects.forEach( t => t.show() );

    if (this.modalOn) {
      drawModal();
      this.showModalText();
    }

    this.animate();
  }

  showModalText() {
    stroke(darkColor);
    strokeWeight(1);
    fill(darkColor);
    textSize(15);
    textFont(TEXT_FONT);
    let yOffset = 100;
    this.modalText.forEach( t => {
      let nWid = textWidth(t);
      text(t, width/2 - nWid/2, yOffset);
      yOffset += 30;
    } );
    if (this.modalExit) {
      let txt = this.stage == TraineeStages.Outro ? PlayTrainee.GAME_OVER : PlayTrainee.MODAL_EXIT;
      let nWid = textWidth(txt);
      text(txt, width/2 - nWid/2, 400);
    }
  }

  animate() {
    if (!this.animating) return;
    if (!this.animating) return;
    this.bg.animate();
    this.flag.animate();
    this.targetOne.animate();
    this.targetTwo.animate();
    this.tempObjects.forEach( t => t.animate() );
    
    this.gunner.animate();
    this.roller.animate();
    this.sam.animate();
    this.traineeAI.run();

    if (this.gameOn) {
      this.enableControls();
    }
  }

  enableControls() {
    let stageGunner = () => [
      TraineeStages.GunnerMoveRight, TraineeStages.GunnerMoveLeft, TraineeStages.GunnerShoot
    ].includes(this.stage);
    if (stageGunner()) {
      if (keyIsDown(PlayCommons.KEY_A)) this.gunner.moveLeft();
      if (keyIsDown(PlayCommons.KEY_D)) this.gunner.moveRight();
    }
    if (TraineeStages.GunnerShoot == this.stage && keyIsDown(PlayCommons.KEY_S)) 
    this.gunner.act();

    let stageRoller = () => [
      TraineeStages.TruckMoveRight, TraineeStages.TruckMoveLeft, TraineeStages.TruckRepair
    ].includes(this.stage);
    if (stageRoller()) {
      if (keyIsDown(PlayCommons.KEY_J)) this.roller.moveLeft();
      if (keyIsDown(PlayCommons.KEY_L)) this.roller.moveRight();
    }
    if (TraineeStages.TruckRepair == this.stage && keyIsDown(PlayCommons.KEY_K)) 
    this.roller.act();
  }

  setupStage() {
    this.stageSetupMap.get(this.stage)();
  }

  keyPressed() {
    if (key == 'Escape') {
      this.animating = false;
      manager.showScene(PauseScreen, { 
        backTo: PlayTrainee
      });
    }
    if (this.modalExit && key == 'Enter') {
      if (this.stage == TraineeStages.Outro) {
        this.animating = false;
        manager.showScene(Menu);
        return;
      }
      this.modalOn = false;
      this.modalExit = false;
      this.gameOn = true;
    }
    if (TraineeStages.SamShoot && key == ' ') {
      this.sam.act();
    }
  }

  gunnerIntroStage() {
    this.modalOn = true;
    this.modalText = PlayTrainee.GUNNER_INTRO_INFO;
    this.traineeAI.bringInTheGunner();
  }

  gunnerMoveRightStage() {
    this.modalOn = true;
    this.modalExit = true;
    this.modalText = [...PlayTrainee.GUNNER_INTRO_INFO, ...PlayTrainee.GUNNER_MOVE_INFO];
    this.flag.x = 500;
    this.flag.addTarget(this.gunner);
    this.flag.active = true;
  }

  gunnerMoveLeftStage() {
    this.flag.x = 200;
    this.flag.active = true;
  }

  gunnerShootStage() {
    this.gameOn = false;
    this.modalOn = true;
    this.modalText = PlayTrainee.GUNNER_SHOOT_INFO;
    this.modalExit = true;
    this.targetOne.reset();
    this.targetTwo.reset();
  }

  truckIntroStage() {
    this.gameOn = false;
    this.modalOn = true;
    this.modalText = PlayTrainee.TRUCK_INTRO_INFO;
    this.traineeAI.takeOutTheGunner();
    this.traineeAI.bringInTheRoller();
  }

  truckMoveLeftStage() {
    this.modalOn = true;
    this.modalExit = true;
    this.modalText = [...PlayTrainee.TRUCK_INTRO_INFO, ...PlayTrainee.TRUCK_MOVE_INFO];
    this.flag.x = 100;
    this.flag.active = true;
    this.flag.addTarget(this.roller);
  }

  truckMoveRightStage() {
    this.flag.x = 500;
    this.flag.active = true;
  }

  truckRepairStage() {
    this.gameOn = false;
    this.modalOn = true;
    this.modalExit = true;
    this.strip.damage(10, 200, 400);
    this.modalText = PlayTrainee.TRUCK_REPAIR_INFO;
  }

  samIntroStage() {
    this.gameOn = false;
    this.modalOn = true;
    this.modalText = PlayTrainee.SAM_INTRO_INFO;
    this.traineeAI.takeOutTheRoller();
    this.traineeAI.bringInTheSAM();
  }

  samShootStage() {
    this.gameOn = false;
    this.modalOn = true;
    this.modalExit = true;
    this.targetOne.reset();
    this.targetTwo.reset();
    this.modalText = [...PlayTrainee.SAM_INTRO_INFO, ...PlayTrainee.SAM_SHOOT_INFO];
  }

  outroStage() {
    this.gameOn = false;
    this.modalOn = true;
    this.modalExit = true;
    this.modalText = PlayTrainee.OUTRO_INFO;
  }

}

PlayTrainee.MODAL_EXIT = 'Press Enter to Start Training';
PlayTrainee.GAME_OVER = 'Press Enter to Return to Main Menu';

PlayTrainee.GUNNER_INTRO_INFO = ['Attention Trainee', 'First you train as Gunner'];
PlayTrainee.GUNNER_MOVE_INFO = ['Capture the Flags that show up', '', 
  'To move left: Press A', 'To move right: Press D'
];
PlayTrainee.GUNNER_SHOOT_INFO = [
  'Good Job', 'Now that you know how to move around in your ack-ack gun', 
  'Next lesson is on how to attack', '', 'Shoot the moving targets', 'To shoot: Press S'
];
PlayTrainee.TRUCK_INTRO_INFO = ['Good Job', 'Now you train as Engineer'];
PlayTrainee.TRUCK_MOVE_INFO = [
  'Capture the Flags that show up', '', 'To move left: Press J', 
  'To move right: Press L'
];
PlayTrainee.TRUCK_REPAIR_INFO = [
  'Good Job', 'Now that you know how to move around in yout repair truck', 
  'Next lesson is on how to repair', '', 'Move to the damaged section (over it)', 
  'To start repair: Press and hold K', 'Note: To repair, the truck must be stationary'
];
PlayTrainee.SAM_INTRO_INFO = ['Good Job', 'Next up ... the SAM launcher'];
PlayTrainee.SAM_SHOOT_INFO = ['', 'Shoot the moving targets', 'To shoot: Press Space-bar'];
PlayTrainee.OUTRO_INFO = ['Well Done!', 'Your training is complete'];

class TraineeStages {

  static Outro = new TraineeStages('outro');
  static SamShoot = new TraineeStages('sam-shoot', TraineeStages.Outro);
  static SamIntro = new TraineeStages('sam-intro', TraineeStages.SamShoot);
  static TruckRepair = new TraineeStages('truck-repair', TraineeStages.SamIntro);
  static TruckMoveRight = new TraineeStages('truck-move-right', TraineeStages.TruckRepair);
  static TruckMoveLeft = new TraineeStages('truck-move-left', TraineeStages.TruckMoveRight);
  static TruckIntro = new TraineeStages('truck-intro', TraineeStages.TruckMoveLeft);
  static GunnerShoot = new TraineeStages('gunner-shoot', TraineeStages.TruckIntro);
  static GunnerMoveLeft = new TraineeStages('gunner-move-left', TraineeStages.GunnerShoot);
  static GunnerMoveRight = new TraineeStages('gunner-move-right', TraineeStages.GunnerMoveLeft);
  static GunnerIntro = new TraineeStages('gunner-intro', TraineeStages.GunnerMoveRight);
  
  constructor(name, next = null) { 
    this.name = name;
    this.next = next;
  }

}