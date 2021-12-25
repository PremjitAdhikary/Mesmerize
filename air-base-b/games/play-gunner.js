class PlayGunner extends PlayCommons {

  constructor() {
    super({
      addGunner: true, 
      hasEnemyBombers: true, 
      addBombersInterval: () => 180, 
      minBombersToAdd: 3, 
      maxBombersToAdd: 6
    });
  }

  gameOver() {
    return this.strip.state == OBJ_POP || this.gunner.isPopped();
  }

  showResults() {
    this.animating = false;
    manager.showScene(GameOver, { 
      backTo: PlayGunner, 
      song: this.song, 
      stats: {
        killStats: this.killStats, 
        ticks: this.ticks
      }
    });
  }

  keyPressed() {
    if (key == 'Escape') {
      this.animating = false;
      manager.showScene(PauseScreen, { 
        backTo: PlayGunner, 
        song: this.song
       });
    }
  }

}