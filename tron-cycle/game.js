class Game {

  constructor(gameType, difficulty, callback) {
    this._state = Game.STATE.NOT_STARTED;
    this._callback = callback;
    this.controlType = 2;
    this.grid = new Grid(10);
    this.player = new LightCycle(1, createVector(310, 471), 
      LightCycle.DIRECTION.NORTH, blue, this.grid, this.getSpeed(difficulty));
    this.player._path.push(createVector(310, 480));
    let numOfOpponents = gameType === Game.GAMETYPE.ONE ? 1 : 3;
    this.opponents = [];
    this.ais = [];
    for (let i=0; i<numOfOpponents; i++) {
      let opponent = new LightCycle(10+i, createVector(Game.STARTING_YS[i], 9), 
        LightCycle.DIRECTION.SOUTH, orange, this.grid, this.getSpeed(difficulty));
      opponent._path.push(createVector(Game.STARTING_YS[i], 0));
      this.opponents.push(opponent);
      this.ais.push(this.getAi(difficulty, opponent));
    }

    this._messageRibbonColor = SketchColor.black().alpha50().stringify();
  }

  getSpeed(difficulty) {
    switch(difficulty) {
      case Game.DIFFICULTY.EASY: return 2;
      case Game.DIFFICULTY.NORMAL: return 3;
      case Game.DIFFICULTY.HARD: return 4;
    }
  }

  getAi(difficulty, opponent) {
    switch(difficulty) {
      // case Game.DIFFICULTY.EASY: return new RandomAI(opponent);
      case Game.DIFFICULTY.EASY: return new DefensiveAI(opponent, 10, 5);
      case Game.DIFFICULTY.NORMAL: return new DefensiveAI(opponent, 5, 10);
      case Game.DIFFICULTY.HARD: return new DefensiveAI(opponent, 3, 15);
    }
  }

  show() {
    this.grid.show();
    this.player.show();
    for (let opponent of this.opponents) {
      opponent.show();
    }
    for (let ai of this.ais) {
      ai.command();
    }
    if (this.isGameOver()) {
      this.deactivateCycles();
    }
    this.showMessage();
  }

  isGameOver() {
    if (this._state === Game.STATE.RUNNING)
      return !this.player.isActive() || this.opponents.every(opp => !opp.isActive());
    return false;
  }

  activateCycles() {
    if (this._state !== Game.STATE.NOT_STARTED) return;
    this._state = Game.STATE.RUNNING;
    this.player.activate();
    for (let opponent of this.opponents) {
      opponent.activate();
    }
  }

  deactivateCycles() {
    if (this._state !== Game.STATE.RUNNING) return;
    this._state = Game.STATE.OVER;
    this.player.deactivate();
    for (let opponent of this.opponents) {
      opponent.deactivate();
    }
  }

  input(keyCode) {
    if (this._state === Game.STATE.NOT_STARTED && keyCode === ENTER) {
      this.activateCycles();
      return;
    }
    
    if (this._state === Game.STATE.OVER && keyCode === ENTER) {
      this._callback();
      return;
    }
    
    if (this._state === Game.STATE.RUNNING) {
      this.playerInput(keyCode);
    }
  }

  playerInput(keyCode) {
    if (this.controlType === 1) {
      if (keyCode === LEFT_ARROW) {
        this.player.left();
      } else if (keyCode === RIGHT_ARROW) {
        this.player.right();
      }
      return;
    }
    if (this.controlType === 2) {
      if (keyCode === LEFT_ARROW) {
        this.player.west();
      } else if (keyCode === RIGHT_ARROW) {
        this.player.east();
      } else if (keyCode === UP_ARROW) {
        this.player.north();
      } else if (keyCode === DOWN_ARROW) {
        this.player.south();
      }
      return;
    }
  }

  showMessage() {
    if (this._state === Game.STATE.RUNNING) return;
    let messages = []
    if (this._state === Game.STATE.NOT_STARTED) {
      messages.push('Press ENTER to start.');
    }
    if (this._state === Game.STATE.OVER) {
      messages.push((this.player.crashed() ? 'You Lost! ' : 'You Won! '));
      messages.push('Press ENTER to go back to Main Menu.');
    }
    noStroke();
    fill(this._messageRibbonColor);
    rect(0, height/2-30, width, 60);

    fill(255);
    textSize(20);
    textFont('Courier New');
    let hOffset = 0;
    for (let m of messages) {
      let mWid = textWidth(m);
      text(m, width/2 - mWid/2, height/2 + hOffset);
      hOffset += 20;
    }
  }

}

Game.STARTING_YS = [320, 220, 420];

Game.GAMETYPE = {
  ONE: 'Vs One',
  MANY: 'Vs Many'
};

Game.DIFFICULTY = {
  EASY: 'Easy',
  NORMAL: 'Normal',
  HARD: 'Hard'
};

Game.STATE = {
  NOT_STARTED: 1,
  RUNNING: 2,
  OVER: 3
};