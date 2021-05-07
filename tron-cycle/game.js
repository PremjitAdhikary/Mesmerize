class Game {

  constructor(gameType, difficulty, control, audio, callback) {
    this._state = Game.STATE.NOT_STARTED;
    this._callback = callback;
    this.controlType = control;
    this.audio = audio;
    this.grid = new Grid(10, gameType);
    this.setUpPlayer(gameType, difficulty);
    this.setUpOpponents(gameType, difficulty);

    this._messageRibbonColor = SketchColor.black().alpha50().stringify();

    this._song = this.getSong(gameType);
  }

  setUpPlayer(gameType, difficulty) {
    if (gameType === Game.GAMETYPE.PHASER) {
      this.player = new PhaseCycle(1, createVector(310, 471), 
        LightCycle.DIRECTION.NORTH, this.grid, this.getSpeed(difficulty), 
        this.getMaxPhaseAmmo(difficulty));
      this.player._paths[0].push(createVector(310, 480));
    } else if (gameType === Game.GAMETYPE.RINZLER) {
      this.player = new SecondGenCycle(1, createVector(310, 471), 
        LightCycle.DIRECTION.NORTH, this.grid, this.getSpeed(difficulty));
      this.player._path.push(createVector(310, 480));
    } else {
      this.player = new LightCycle(1, createVector(310, 471), 
        LightCycle.DIRECTION.NORTH, blue, this.grid, this.getSpeed(difficulty));
      this.player._path.push(createVector(310, 480));
    }
  }

  setUpOpponents(gameType, difficulty) {
    this.opponents = [];
    this.ais = [];
    let opponentPositions = Game.STARTING_POSITION_OPPONENTS.get(gameType);
    if (gameType === Game.GAMETYPE.RINZLER) {
      let opponent = new RinzlerCycle(10, 
        createVector(opponentPositions[0].x, opponentPositions[0].y), 
        opponentPositions[0].dir, this.grid, this.getSpeed(difficulty));
      opponent._path.push(createVector(opponentPositions[0].x0, opponentPositions[0].y0));
      this.opponents.push(opponent);
      this.ais.push(this.getRinzlerAi(difficulty, opponent));
      return;
    }
    for (let i=0; i<opponentPositions.length; i++) {
      let opponent = new LightCycle(10+i, 
        createVector(opponentPositions[i].x, opponentPositions[i].y), 
        opponentPositions[i].dir, orange, this.grid, this.getSpeed(difficulty));
      opponent._path.push(createVector(opponentPositions[i].x0, opponentPositions[i].y0));
      this.opponents.push(opponent);
      this.ais.push(this.getAi(difficulty, opponent));
    }
  }

  getSpeed(difficulty) {
    switch(difficulty) {
      case Game.DIFFICULTY.EASY: return 2;
      case Game.DIFFICULTY.NORMAL: return 3;
      case Game.DIFFICULTY.HARD: return 4;
    }
  }

  getMaxPhaseAmmo(difficulty) {
    switch(difficulty) {
      case Game.DIFFICULTY.EASY: return 50;
      case Game.DIFFICULTY.NORMAL: return 40;
      case Game.DIFFICULTY.HARD: return 35;
    }
  }

  getSong(gameType) {
    switch(gameType) {
      case Game.GAMETYPE.PHASER: return new GameHasChanged();
      case Game.GAMETYPE.RINZLER: return new Rinzler();
      default: return new ThemePartRemix();
    }
  }

  getAi(difficulty, opponent) {
    switch(difficulty) {
      // case Game.DIFFICULTY.EASY: return new RandomAI(opponent);
      case Game.DIFFICULTY.EASY: return new DefensiveAI(opponent, 10, 5);
      case Game.DIFFICULTY.NORMAL: return new DefensiveAI(opponent, 5, 10);
      case Game.DIFFICULTY.HARD: return new DefensiveAI(opponent, 3, 15);
      // case Game.DIFFICULTY.HARD: return new OffensiveAI(opponent, 3, 15, this.player);
    }
  }

  getRinzlerAi(difficulty, opponent) {
    switch(difficulty) {
      case Game.DIFFICULTY.EASY: return new RinzlerDefensiveAI(opponent, 10, 5);
      case Game.DIFFICULTY.NORMAL: return new RinzlerDefensiveAI(opponent, 5, 10);
      case Game.DIFFICULTY.HARD: return new RinzlerDefensiveAI(opponent, 3, 15);
    }
  }

  show() {
    if (debug)
      this.showFrameRate();
    this.grid.show();
    for (let opponent of this.opponents) {
      opponent.show();
    }
    this.player.show();
    this.showMessage();
    if (this.isGamePaused()) 
      return;
    this.animate();
    for (let ai of this.ais) {
      ai.command();
    }
    if (this.checkIfPlayerOrAllOpponentsDerezzed()) {
      this.deactivateCycles();
    }
  }

  showFrameRate() {
    stroke(255);
    strokeWeight(1);
    fill(255);
    textSize(24);
    textFont('Courier New');
    text('FPS: ' + Math.floor(frameRate()), 10, 20);
  }

  animate() {
    this.grid.animate();
    this.player.animate();
    for (let opponent of this.opponents) {
      opponent.animate();
    }
  }

  isGameOver() {
    return this._state === Game.STATE.OVER;
  }

  isGamePaused() {
    return this._state === Game.STATE.PAUSED;
  }

  checkIfPlayerOrAllOpponentsDerezzed() {
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
      if (this.audio === Game.AUDIO.ON)
        this._song.start();
      this.activateCycles();
      return;
    }
    
    if (this._state === Game.STATE.OVER && keyCode === ENTER) {
      this._song.stop();
      this._callback();
      return;
    }
    
    if (this._state === Game.STATE.PAUSED && keyCode === ENTER) {
      this._state = Game.STATE.RUNNING;
      return;
    }
    
    if (this._state === Game.STATE.RUNNING) {
      this.playerInput(keyCode);
    }
  }

  inputOff(keyCode) {
    if (this._state === Game.STATE.RUNNING) {
      this.player.actionOut(keyCode);
    }
  }

  playerInput(keyCode) {
    if (keyCode === ENTER) {
      this._state = Game.STATE.PAUSED;
      return;
    }

    if (this.controlType === Game.CONTROL.RIDER) {
      if (keyCode === LEFT_ARROW) {
        this.player.left();
      } else if (keyCode === RIGHT_ARROW) {
        this.player.right();
      } else {
        this.player.actionIn(keyCode);
      }
      return;
    }
    if (this.controlType === Game.CONTROL.TOP_DOWN) {
      if (keyCode === LEFT_ARROW) {
        this.player.west();
      } else if (keyCode === RIGHT_ARROW) {
        this.player.east();
      } else if (keyCode === UP_ARROW) {
        this.player.north();
      } else if (keyCode === DOWN_ARROW) {
        this.player.south();
      } else {
        this.player.actionIn(keyCode);
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
    if (this.isGameOver()) {
      messages.push((this.player.crashed() ? 'You Lost! ' : 'You Won! '));
      messages.push('Press ENTER to go back to Main Menu.');
    }
    if (this.isGamePaused()) {
      messages.push('Game Paused!');
      messages.push('Press ENTER to Resume.');
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
  MANY: 'Vs Many',
  PHASER: 'Phaser Cycle',
  RINZLER: 'Vs Rinzler'
};

Game.STARTING_POSITION_OPPONENTS = new Map();
Game.STARTING_POSITION_OPPONENTS.set(Game.GAMETYPE.ONE, [
  {x: 320, y: 9, x0: 320, y0: 0, dir: LightCycle.DIRECTION.SOUTH}
]);
Game.STARTING_POSITION_OPPONENTS.set(Game.GAMETYPE.MANY, [
  {x: 320, y: 9, x0: 320, y0: 0, dir: LightCycle.DIRECTION.SOUTH}, 
  {x: 220, y: 9, x0: 220, y0: 0, dir: LightCycle.DIRECTION.SOUTH}, 
  {x: 420, y: 9, x0: 420, y0: 0, dir: LightCycle.DIRECTION.SOUTH}
]);
Game.STARTING_POSITION_OPPONENTS.set(Game.GAMETYPE.PHASER, [
  {x: 320, y: 9, x0: 320, y0: 0, dir: LightCycle.DIRECTION.SOUTH}, 
  {x: 200, y: 9, x0: 200, y0: 0, dir: LightCycle.DIRECTION.SOUTH}, 
  {x: 440, y: 9, x0: 440, y0: 0, dir: LightCycle.DIRECTION.SOUTH}, 
  {x: 9, y: 280, x0: 0, y0: 280, dir: LightCycle.DIRECTION.EAST}, 
  {x: 631, y: 280, x0: 640, y0: 280, dir: LightCycle.DIRECTION.WEST}
]);
Game.STARTING_POSITION_OPPONENTS.set(Game.GAMETYPE.RINZLER, [
  {x: 320, y: 9, x0: 320, y0: 0, dir: LightCycle.DIRECTION.SOUTH}
]);

Game.DIFFICULTY = {
  EASY: 'Easy',
  NORMAL: 'Normal',
  HARD: 'Hard'
};

Game.CONTROL = {
  TOP_DOWN: 'Top Down',
  RIDER: 'Rider'
};

Game.AUDIO = {
  ON: 'On',
  OFF: 'Off'
};

Game.STATE = {
  NOT_STARTED: 1,
  RUNNING: 2,
  OVER: 3,
  PAUSED: 4
};