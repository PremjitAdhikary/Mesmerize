class BaseGame {

  constructor() {
    this.switchOrientationButton = new BasicButton(530, 120, 120, 30, 'Switch Orientation', 12);
    this.exitButton = new BasicButton(530, 220, 120, 30, 'Exit to Main Menu', 12);
    this.gameActive = true;
    this.pauseCountDown = 0;
  }

  setupHuman(boardConfig, humanShips) {
    this.human = new Human(boardConfig);
    this.humanShips = humanShips;
  }

  setupAi(boardConfig, aiShips, strategyBuilder) {
    this.ai = new AiForClassic(boardConfig, strategyBuilder);
    this.aiShips = aiShips;
    this.ai.addShips(this.aiShips);
    this.ai.isBoardSet = true;
  }

  show() {
    if (!this.gameActive && !this.isGameOver()) {
      this.pauseCountDown--;
      if (this.pauseCountDown == 0) { 
        this.gameActive = true;
        this.switchTurn();
      }
    }
    this.human.show();
    this.showMenu();
    if (this.human.isBoardSet && this.ai.isMyTurn && this.gameActive) {
      this.runAi();
      this.gameActive = false;
      this.pauseCountDown = BaseGame.PAUSE_TIMER;
      return;
    }
  }

  isGameOver() {
    return this.human.myBoard.ships.every(s => s.isSunk())
       || this.ai.myBoard.ships.every(s => s.isSunk());
  }

  switchTurn() {
    this.ai.isMyTurn = !this.ai.isMyTurn;
    this.human.isMyTurn = !this.human.isMyTurn;
  }

  humanBoardSetup(x, y) {
    if (this.human.isEventOnBoard(x, y)) {
      if (this.human.addShipAt(x, y, this.humanShips[0])) {
        this.humanShips.shift();
        this.human.isBoardSet = this.humanShips.length == 0;
      } 
    } else if (this.switchOrientationButton.isClicked(x, y)) {
      this.humanShips[0].switchOrientation();
    }
  }

  drawBlueRectangle(x, y, len, wd) {
    fill(menuFill);
    stroke(menuStroke);
    strokeWeight(2);
    rect(x, y, len, wd, 10);
  }

  printCentreAlignedText(txt, cx, y) {
    let txtWd = textWidth(txt);
    text(txt, cx-txtWd/2, y);
  }

}

BaseGame.PAUSE_TIMER = 10;