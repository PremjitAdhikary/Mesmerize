class Classic extends BaseGame {

  constructor(param) {
    super();
    let boardConfig = {
      startX : Classic.BOARD_START_X, 
      startY : Classic.BOARD_START_Y,
      side : Classic.BOARD_SIDE,
      cellsSide : Classic.BOARD_CELLS_SIDE
    };
    this.setupHuman(boardConfig, this.spawnHumanShips());
    this.setupAi(boardConfig, this.spawnAiShips(), (board, side) => {
      if (param.difficulty == 'Easy') {
        return new ReconAndAttack(board, side);
      } else {
        return new ReconToAttack(board, side);
      }
    });
  }

  spawnHumanShips() {
    let humanShips = [];
    humanShips.push(new AircraftCarrier());
    humanShips.push(new Battleship());
    humanShips.push(new Destroyer());
    humanShips.push(new Submarine());
    humanShips.push(new PatrolBoat());
    return humanShips;
  }

  spawnAiShips() {
    let aiShips = [];
    aiShips.push(new AircraftCarrier());
    aiShips.push(new Battleship());
    aiShips.push(new Destroyer());
    aiShips.push(new Submarine());
    aiShips.push(new PatrolBoat());
    return aiShips;
  }

  showMenu() {
    this.drawBlueRectangle(427, 30, 206, 420);
    if (!this.human.isBoardSet) {
      this.showShipPlacementMenu();
    } else {
      this.showGameplayMenu();
    }
  }

  showShipPlacementMenu() {
    this.drawBlueRectangle(160, 8, 120, 24);
    if (this.humanShips.length == 0) return;
    fill(0);
    stroke(0);
    textSize(15);
    strokeWeight(1);
    this.printCentreAlignedText('Player Grid', 220, 25);
    this.printCentreAlignedText(
      'Place your '+this.humanShips[0].name, 530, 50);
    let ship = this.humanShips[0];
    this.switchOrientationButton.show();
    let side = Classic.BOARD_SIDE/Classic.BOARD_CELLS_SIDE;
    ship.draw(530, 250, side, (ship.orientation == BaseShip.NS ? 0 : PI/2));
  }

  showGameplayMenu() {
    let side = Classic.BOARD_SIDE/Classic.BOARD_CELLS_SIDE;
    let shipX = [530, 530+side*1.2, 530-side*1.2, 530-side*2, 530+side*2];
    this.drawBlueRectangle(160, 8, 120, 24);
    fill(0);
    stroke(0);
    textSize(15);
    strokeWeight(1);
    this.printCentreAlignedText('Enemy Hit Rate: '+this.ai.successRate()+'%', 530, 75);
    this.printCentreAlignedText('Enemy Ships Active', 530, 90);
    for (let i=0; i<this.ai.myBoard.ships.length; i++) {
      if (!this.ai.myBoard.ships[i].isSunk()) {
        this.ai.myBoard.ships[i].draw(shipX[i], 170, side*0.7, 0);
      }
    }
    this.printCentreAlignedText('Player Hit Rate: '+this.human.successRate()+'%', 530, 260);
    this.printCentreAlignedText('Player Ships Active', 530, 275);
    for (let i=0; i<this.ai.myBoard.ships.length; i++) {
      if (!this.human.myBoard.ships[i].isSunk()) {
        this.human.myBoard.ships[i].draw(shipX[i], 360, side*0.7, 0);
      }
    }
    let humanShipsSunked = this.human.myBoard.ships.filter(s => s.isSunk()).length;
    this.printCentreAlignedText(this.human.isMyTurn ? 'Enemy Grid' : 'Player Grid', 220, 25);
    let menuTxt = (this.human.isMyTurn) ? 'Player Turn' : 'Enemy Turn';
    if (this.isGameOver()) {
      let enemyWon = this.human.myBoard.ships.length == humanShipsSunked;
      menuTxt = enemyWon ? 'Enemy Won' : 'Player Won';
      this.exitButton.y = enemyWon ? 360 : 170;
      this.exitButton.show();
    }
    this.printCentreAlignedText(menuTxt, 530, 50);
  }

  runAi() {
    if (this.isGameOver() || !this.gameActive) return;
    let move = this.ai.run();
    this.ai.runOutcome(move.x, move.y, this.human.attacked(move.x, move.y));
  }

  eventAt(x, y) {
    if (!this.gameActive && !this.isGameOver()) return;
    if (!this.human.isBoardSet) {
      this.humanBoardSetup(x, y);
      return;
    }
    if (!this.isGameOver() && this.human.isEventOnBoard(x, y) && this.human.isMyTurn) {
      this.humanGameplay(x, y);
      return;
    }
    if (this.isGameOver() && this.exitButton.isClicked(x, y)) {
      bus.dispatch("ControlEInMn", { });
    }
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

Classic.BOARD_START_X = 20;
Classic.BOARD_START_Y = 40;
Classic.BOARD_SIDE = 400;
Classic.BOARD_CELLS_SIDE = 10;