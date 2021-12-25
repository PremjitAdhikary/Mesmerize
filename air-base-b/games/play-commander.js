class PlayCommander extends PlayCommons {

  constructor() {
    super({
      addGunner: true, 
      addRoller: true, 
      addSAM: true, 
      hasEnemyBombers: true, 
      addBombersInterval: () => 180, 
      minBombersToAdd: 7, 
      maxBombersToAdd: 9, 
      hasEnemyKamikazes: true, 
      addKamikazesInterval: () => Math.floor(random(900, 1500)), 
      hasEnemyLCAs: true, 
      addLCAsInterval: () => 1000, 
      minLCAToAdd: 1, 
      maxLCAToAdd: 2
    });
  }

  gameOver = () => 
    this.strip.state == OBJ_POP || (this.gunner.isPopped() && this.roller.isPopped());

  showResults() {
    this.animating = false;
    manager.showScene(GameOver, { 
      backTo: PlayCommander, 
      song: this.song,  
      stats: {
        repairStats: this.strip.repairStats(), 
        killStats: this.killStats, 
        ticks: this.ticks
      }
    });
  }

  keyPressed() {
    if (key == 'Escape') {
      this.animating = false;
      manager.showScene(PauseScreen, { 
        backTo: PlayCommander, 
        song: this.song 
      });
    }
    if (key == ' ') {
      this.sam.act();
    }
  }

}