class GameEventManager {

  constructor(gameId, startAfterFrames = 60) {
    this.gameId = gameId;
    this.gameEvents = [];
    this.startAfterFrames = startAfterFrames;
  }

  addEvent(criteria, action) {
    this.gameEvents.push({
      criteria, 
      action, 
      executed: false
    });
  }

  run() {
    if (this.startAfterFrames > 0) {
      this.startAfterFrames--;
      return;
    }
    for (let e=0; e<this.gameEvents.length; e++) {
      if (!this.gameEvents[e].executed && this.gameEvents[e].criteria()) {
        this.gameEvents[e].executed = true;
        this.gameEvents[e].action();
        return;
      }
    }
  }

}