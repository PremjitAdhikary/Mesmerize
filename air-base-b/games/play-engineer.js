class PlayEngineer extends PlayCommons {

  constructor() {
    super({
      addRoller: true, 
      hasEnemyBombers: true, 
      addBombersInterval: () => 180, 
      minBombersToAdd: 5, 
      maxBombersToAdd: 5, 
      hasEnemyKamikazes: true, 
      addKamikazesInterval: () => Math.floor(random(1200, 1800))
    });
  }

  gameOver() {
    return this.strip.state == OBJ_POP || this.roller.isPopped();
  }

  showResults() {
    this.animating = false;
    manager.showScene(GameOver, { 
      backTo: PlayEngineer, 
      song: this.song,  
      stats: {
        repairStats: this.strip.repairStats(), 
        ticks: this.ticks
      }
    });
  }

  keyPressed() {
    if (key == 'Escape') {
      this.animating = false;
      manager.showScene(PauseScreen, { 
        backTo: PlayEngineer, 
        song: this.song
       });
    }
  }

}