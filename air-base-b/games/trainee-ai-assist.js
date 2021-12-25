class TraineeAiAssist {

  constructor(gunner, roller, sam) {
    this.gunner = gunner;
    this.roller = roller;
    this.sam = sam;

    this.gunnerEnter = false;
    this.gunnerOut = false;
    this.gunnerIsOut = false;
    this.rollerEnter = false;
    this.rollerIsIn = false;
    this.rollerIsOut = false;
    this.truckMoveLeft = false;
    this.sammoveLeft = false;
    this.samEnter = false;
    this.samIsIn = false;
    this.samMoveLeft = false;
  }

  bringInTheGunner() {
    this.gunner.setRange(-150, 590);
    this.gunnerEnter = true;
  }

  takeOutTheGunner() {
    this.gunner.setRange(-150, 590);
    this.gunnerOut = true;
  }

  bringInTheRoller() {
    this.roller.setRange(50, 750);
    this.rollerEnter = true;
  }

  takeOutTheRoller() {
    this.roller.setRange(50, 750);
    this.rollerOut = true;
  }

  bringInTheSAM() {
    this.sam.setRange(550, 750);
    this.samEnter = true;
  }

  run() {
    if (this.gunnerEnter) {
      this.runGunnerEnterCommand();
    }
    if (this.gunnerOut) {
      this.runGunnerOutCommand();
    }
    if (this.rollerEnter) {
      this.runRollerEnterCommand();
    }
    if (this.rollerOut) {
      this.runRollerOutCommand();
    }
    if (this.samEnter) {
      this.runSamEnterCommand();
    }
    if (!this.truckMoveLeft && this.gunnerIsOut && this.rollerIsIn) {
      this.truckMoveLeft = true;
      bus.dispatch("AbbEventTraineeStageUpdate", { stage: TraineeStages.TruckMoveLeft });
    }
    if (!this.samMoveLeft && this.rollerIsOut && this.samIsIn) {
      this.samMoveLeft = true;
      bus.dispatch("AbbEventTraineeStageUpdate", { stage: TraineeStages.SamShoot });
    }
  }

  runGunnerEnterCommand() {
    if (!this.gunnerInPosition()) {
      this.gunner.moveRight();
    } else {
      this.gunner.setRange(50, 590);
      this.gunnerEnter = false;
      bus.dispatch("AbbEventTraineeStageUpdate", { stage: TraineeStages.GunnerMoveRight });
    }
  }

  runGunnerOutCommand() {
    if (!this.gunnerOutOfView()) {
      this.gunner.moveLeft();
    } else {
      this.gunnerOut = false;
      this.gunnerIsOut = true;
    }
  }

  runRollerEnterCommand() {
    if (!this.rollerInPosition()) {
      this.roller.moveLeft();
    } else {
      this.roller.setRange(50, 590);
      this.rollerEnter = false;
      this.rollerIsIn = true;
    }
  }

  runRollerOutCommand() {
    if (!this.rollerOutOfView()) {
      this.roller.moveRight();
    } else {
      this.rollerOut = false;
      this.rollerIsOut = true;
    }
  }

  runSamEnterCommand() {
    if (!this.samInPosition()) {
      this.sam.moveLeft();
    } else {
      this.samEnter = false;
      this.samIsIn = true;
    }
  }

  gunnerInPosition = () => this.gunner.x >= 60;

  gunnerOutOfView = () => this.gunner.x <= -100;

  rollerInPosition = () => this.roller.x <= 580;

  rollerOutOfView = () => this.roller.x >= 740;

  samInPosition = () => this.sam.x <= 580;

}