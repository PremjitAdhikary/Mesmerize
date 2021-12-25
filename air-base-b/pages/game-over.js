class GameOver extends BaseMenu {

  setup() {
    this.mainMenu.push(
      new MenuItem('Back to Main Menu', true, 
      () => {
        kModeOn = false;
        if (bgSoundOn && this.sceneArgs.song) this.sceneArgs.song.stop();
        manager.showScene(Menu);
      })
    );
  }

  enter() {
    if (bgSoundOn && this.sceneArgs.song) this.sceneArgs.song.hiVolume();
    this.activeItem = 0;
    this.updateMenu();
    if (this.sceneArgs.stats) {
      if (debug) console.log(this.sceneArgs.stats);
      this.calcStats();
      if (debug) console.log(this.points);
    }
  }

  draw() {
    manager.findScene( this.sceneArgs.backTo ).oScene.draw();
    drawModal();
    this.drawTitle();
    super.draw(140, false);
    if (this.sceneArgs.stats) this.drawStats();
  }

  drawTitle() {
    let title = 'Game Over';
    stroke(darkColor);
    strokeWeight(2);
    fill(darkColor);
    textSize(30);
    textFont(TEXT_FONT);
    let nWid = textWidth(title);
    text(title, width/2 - nWid/2, 100);
  }

  drawStats() {
    stroke(lineColor);
    strokeWeight(1);
    fill(lineColor);
    textSize(Info.TXT_SIZE);
    textFont(TEXT_FONT);
    let xOff = 40;
    let yOff = 190;
    let ticks = GameOver.SURVIVAL + this.points.ticks;
    let tickWid = textWidth(GameOver.SURVIVAL);
    text(ticks, width/2 - tickWid/2 - xOff, yOff);

    GameOver.SHOW_STATS
      .filter(ss => ss.condition(this.sceneArgs))
      .forEach(ss => {
        yOff += 30;
        text(ss.name + ss.getPoints(this.points), 
          width/2 - tickWid/2 + (tickWid - textWidth(ss.name)) - xOff, yOff);
      });

    yOff += 30;
    stroke(darkColor);
    fill(darkColor);
    let total = GameOver.TOTAL + this.points.total;
    let totalWid = textWidth(GameOver.TOTAL);
    text(total, width/2 - tickWid/2 + (tickWid - totalWid) - xOff, yOff);
  }

  calcStats() {
    this.points = {};
    this.points.ticks = Math.floor(this.sceneArgs.stats.ticks/30);
    let isCommandGame = manager.findScene( this.sceneArgs.backTo ).oScene instanceof PlayCommander;
    
    if (speed == FAST) this.points.speed = Math.floor(this.points.ticks * 5);
    if (isCommandGame) this.points.game = 0;
    this.points.total = this.points.ticks;
    
    if (this.sceneArgs.stats.killStats) {
      this.points.kills = (this.sceneArgs.stats.killStats.kills * 100 
        + this.sceneArgs.stats.killStats.perfects * 50);
      this.points.total += this.points.kills;
      if (speed == FAST) this.points.speed += (this.points.kills * 3);
      if (isCommandGame) this.points.game += Math.floor(this.points.kills * 1.8);
    }
    
    if (this.sceneArgs.stats.repairStats) {
      this.points.repair = (this.sceneArgs.stats.repairStats.total * 10 
        + this.sceneArgs.stats.repairStats.fullRepair * 50);
      this.points.total += this.points.repair;
      if (speed == FAST) this.points.speed += (this.points.repair * 2);
      if (isCommandGame) this.points.game += Math.floor(this.points.repair * 1.2);
    }
    
    if (speed == FAST) this.points.total += this.points.speed;
    if (isCommandGame) this.points.total += this.points.game;
  }

}

GameOver.SURVIVAL = 'Survival Bonus : ';
GameOver.KILL = 'Kill Bonus : ';
GameOver.REPAIR = 'Repair Bonus : ';
GameOver.SPEED = 'Speed Bonus : ';
GameOver.GAME = 'Gameplay Bonus : ';
GameOver.TOTAL = 'Total Points : ';

GameOver.SHOW_STATS = [
  {
    name: GameOver.KILL,
    condition: sceneArgs => sceneArgs.stats.killStats,
    getPoints: points => points.kills
  }, 
  {
    name: GameOver.REPAIR,
    condition: sceneArgs => sceneArgs.stats.repairStats,
    getPoints: points => points.repair
  }, 
  {
    name: GameOver.SPEED,
    condition: () => speed == FAST,
    getPoints: points => points.speed
  }, 
  {
    name: GameOver.GAME,
    condition: (sceneArgs) => manager.findScene( sceneArgs.backTo ).oScene instanceof PlayCommander,
    getPoints: points => points.game
  }
];