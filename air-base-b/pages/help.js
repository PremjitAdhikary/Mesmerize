class Help extends BaseMenu {

  setup() {
    this.activeItem = 0;
    this.mainMenu.push(
      new MenuItem('The Basic Idea', true, 
        () => manager.showScene(Info, { topic: Info.IDEA_P1 }) )
    );
    this.mainMenu.push(
      new MenuItem('How to play as Gunner', false, 
        () => manager.showScene(Info, { topic: Info.GUNNER_P1 }) )
    );
    this.mainMenu.push(
      new MenuItem('How to play as Engineer', false, 
      () => manager.showScene(Info, { topic: Info.ENGINEER_P1 }) )
    );
    this.mainMenu.push(
      new MenuItem('How to play as Wing Commander', false, 
      () => manager.showScene(Info, { topic: Info.COMMANDER_P1 }) )
    );
    this.mainMenu.push(
      new MenuItem('Back to Main Menu', false, 
        () => manager.showScene(Menu) )
    );
    this.drawIconFunctions = [
      () => this.bg.showBuilding(width/2 - 50, 150), 
      () => this.gunner.show(), 
      () => this.roller.show(), 
      () => this.sam.show(), 
      this.drawMainMenuIcon
    ];
  }

  enter() {
    if (this.sceneArgs) {
      this.activeItem = this.sceneArgs.index;
      this.updateMenu();
    }
    this.bg = new AirBaseBG();
    this.gunner = GOFactory.FACTORY.getAntiAircraftGun(width/2, 175, false);
    this.roller = GOFactory.FACTORY.getRoadRoller(width/2, 170, false);
    this.sam = GOFactory.FACTORY.getSAM(width/2, 170, false);
    this.sam.loadMissiles();
  }

  draw() {
    background(bgColor);
    super.draw();
    this.drawIconFunctions[this.activeItem]();
  }

  drawMainMenuIcon() {
    stroke(lineColor);
    strokeWeight(1);
    fill(lineColor);
    rect (width/2 - 50, 120, 100, 8);
    rect (width/2 - 50, 150, 100, 8);
    rect (width/2 - 50, 180, 100, 8);
  }

}