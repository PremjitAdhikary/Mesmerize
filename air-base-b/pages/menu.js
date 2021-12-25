class Menu extends BaseMenu {

  setup() {
    this.activeItem = 0;
    this.mainMenu.push(
      new MenuItem('Gunner', true, 
      () => manager.showScene(PlayGunner, { reset: true }))
    );
    this.mainMenu.push(
      new MenuItem('Engineer', false, 
      () => manager.showScene(PlayEngineer, { reset: true }))
    );
    this.mainMenu.push(
      new MenuItem('Wing Commander', false, 
      () => manager.showScene(PlayCommander, { reset: true }))
    );
    this.mainMenu.push(
      new MenuItem('Trainee', false, 
      () => manager.showScene(PlayTrainee, { reset: true }))
    );
    this.mainMenu.push(
      new MenuItem('Settings', false, 
      () => manager.showScene(Settings))
    );
    this.mainMenu.push(
      new MenuItem('Help', false, 
      () => manager.showScene(Help, {index: 0}))
    );
    this.drawIconFunctions = [
      () => this.gunner.show(), () => this.roller.show(), () => this.sam.show(), 
      () => this.drawTraineeIcon(), this.drawSettingsIcon, this.drawHelpIcon
    ];
  }

  enter() {
    this.gunner = GOFactory.FACTORY.getAntiAircraftGun(width/2, 175, false);
    this.roller = GOFactory.FACTORY.getRoadRoller(width/2, 170, false);
    this.sam = GOFactory.FACTORY.getSAM(width/2, 175, false);
    this.sam.loadMissiles();
    this.target = new TrainerTarget(width/2 + 10, 160, 0);
    this.flag = new TrainerFlag(width/2 - 15, () => {});
    this.flag.baseY = 180;
  }

  draw() {
    background(bgColor);
    super.draw();
    this.drawIconFunctions[this.activeItem]();
  }

  drawTraineeIcon() {
    fill(lineColor);
    stroke(lineColor);
    rect(width/2 - 30, 178, 60, 5);
    this.flag.show();
    this.target.show();
  }

  drawSettingsIcon() {
    stroke(lineColor);
    strokeWeight(1);
    fill(lineColor);
    push();
    translate(width/2, 150);
    rect(-4, -30, 8, 60);
    rect(-30, -4, 60, 8);
    push();
    rotate(HALF_PI/2);
    rect(-4, -30, 8, 60);
    rect(-30, -4, 60, 8);
    pop();
    strokeWeight(8);
    fill(bgColor);
    circle(0, 0, 40, 40);
    pop();
  }

  drawHelpIcon() {
    stroke(lineColor);
    strokeWeight(1);
    fill(lineColor);
    rect(width/2 - 30, 120, 8, 20);
    rect(width/2 - 30, 120, 60, 8);
    rect(width/2 + 22, 120, 8, 40);
    rect(width/2 - 4, 152, 30, 8);
    rect(width/2 - 4, 152, 8, 20);
    rect(width/2 - 4, 182, 8, 8);
  }

}