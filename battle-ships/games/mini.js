class Mini extends BaseGame {

  constructor(param) {
    super();
    let boardConfig = {
      startX : Mini.BOARD_START_X, 
      startY : Mini.BOARD_START_Y,
      side : Mini.BOARD_SIDE,
      cellsSide : Mini.BOARD_CELLS_SIDE
    };
    this.setupHuman(boardConfig, this.spawnHumanShips());
    this.setupAi(boardConfig, this.spawnAiShips(), (board, side) => {
      if (param.difficulty == 'Easy') {
        return new ReconAndAttack(board, side);
      } else {
        return new ReconToAttack(board, side);
      }
    });
    this.switchOrientationButton.x = 480;
    this.exitButton.x = 480;
    this.exitButton.y = 120;
  }

  spawnHumanShips() {
    let humanShips = [];
    humanShips.push(new Frigate());
    humanShips.push(new PatrolBoat());
    return humanShips;
  }

  spawnAiShips() {
    let aiShips = [];
    aiShips.push(new Frigate());
    aiShips.push(new PatrolBoat());
    return aiShips;
  }

  showMenu() {
    this.drawBlueRectangle(340, 30, 280, 420);
    if (!this.human.isBoardSet) {
      this.showShipPlacementMenu();
    } else {
      this.showGameplayMenu();
    }
  }

  showShipPlacementMenu() {
    this.drawBlueRectangle(110, 8, 120, 24);
    if (this.humanShips.length == 0) return;
    fill(0);
    stroke(0);
    textSize(15);
    strokeWeight(1);
    this.printCentreAlignedText('Player Grid', 170, 25);
    this.printCentreAlignedText(
      'Place your '+this.humanShips[0].name, 480, 50);
    let ship = this.humanShips[0];
    this.switchOrientationButton.show();
    let side = Mini.BOARD_SIDE/Mini.BOARD_CELLS_SIDE;
    ship.draw(480, 260, side*1.1, (ship.orientation == BaseShip.NS ? 0 : PI/2));
  }

  showGameplayMenu() {
    let side = Mini.BOARD_SIDE/Mini.BOARD_CELLS_SIDE;
    let aiShipX = [375, 425];
    let humanShipX = [575, 525];
    this.drawBlueRectangle(110, 8, 120, 24);
    fill(0);
    stroke(0);
    textSize(15);
    strokeWeight(1);
    this.printCentreAlignedText('Enemy Ships', 400, 200);
    for (let i=0; i<this.ai.myBoard.ships.length; i++) {
      if (!this.ai.myBoard.ships[i].isSunk()) {
        this.ai.myBoard.ships[i].draw(aiShipX[i], 300, side*1.2, 0);
      }
    }
    this.printCentreAlignedText('Player Ships', 550, 200);
    for (let i=0; i<this.ai.myBoard.ships.length; i++) {
      if (!this.human.myBoard.ships[i].isSunk()) {
        this.human.myBoard.ships[i].draw(humanShipX[i], 300, side*1.2, 0);
      }
    }
    let humanShipsSunked = this.human.myBoard.ships.filter(s => s.isSunk()).length;
    this.printCentreAlignedText(this.human.isMyTurn ? 'Enemy Grid' : 'Player Grid', 170, 25);
    let menuTxt = (this.human.isMyTurn) ? 'Player Turn' : 'Enemy Turn';
    if (this.isGameOver()) {
      let enemyWon = this.human.myBoard.ships.length == humanShipsSunked;
      menuTxt = enemyWon ? 'Enemy Won' : 'Player Won';
      this.exitButton.show();
    }
    this.printCentreAlignedText(menuTxt, 480, 50);
  }

  runAi() {
    if (this.isGameOver() || !this.gameActive) return;
    let move = this.ai.run();
    this.human.resetBoardHilight();
    this.ai.runOutcome(move.x, move.y, this.human.attacked(move.x, move.y));
  }

  humanGameplay(x, y) {
    let row = this.human.getRowForY(y);
    let col = this.human.getColForX(x);
    if (this.human.fireAttempt(row, col))
      this.human.fireOutcome(row, col, this.ai.attacked(row, col));
    this.gameActive = false;
    this.pauseCountDown = BaseGame.PAUSE_TIMER;
  }

}

Mini.BOARD_START_X = 20;
Mini.BOARD_START_Y = 90;
Mini.BOARD_SIDE = 300;
Mini.BOARD_CELLS_SIDE = 5;