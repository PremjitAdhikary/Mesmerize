class Salvo extends BaseGame {

  constructor(param) {
    super();
    let boardConfig = {
      startX : Salvo.BOARD_START_X, 
      startY : Salvo.BOARD_START_Y,
      side : Salvo.BOARD_SIDE,
      cellsSide : Salvo.BOARD_CELLS_SIDE
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
    humanShips.push(new Frigate());
    return humanShips;
  }

  spawnAiShips() {
    let aiShips = [];
    aiShips.push(new AircraftCarrier());
    aiShips.push(new Battleship());
    aiShips.push(new Destroyer());
    aiShips.push(new Submarine());
    aiShips.push(new Frigate());
    this.fauxAiShips = [];
    aiShips.forEach(s => this.fauxAiShips.push({ship: s, active: true}));
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
    let side = Salvo.BOARD_SIDE/Salvo.BOARD_CELLS_SIDE;
    ship.draw(530, 250, side, (ship.orientation == BaseShip.NS ? 0 : PI/2));
  }

  showGameplayMenu() {
    this.drawBlueRectangle(160, 8, 120, 24);
    fill(0);
    stroke(0);
    textSize(15);
    strokeWeight(1);
    this.printCentreAlignedText('Enemy Ships Active', 530, 90);
    this.printCentreAlignedText('Player Ships Active', 530, 275);
    let humanShipsSunked = this.human.myBoard.ships.filter(s => s.isSunk()).length;
    this.printCentreAlignedText(this.human.isMyTurn ? 'Enemy Grid' : 'Player Grid', 220, 25);
    let menuTxt = (this.human.isMyTurn) ?
     'Player Turn (Shots: '+this.humanMoveCount+')' : 'Enemy Turn';
    if (this.isGameOver()) {
      this.printCentreAlignedText('Enemy Hit Rate: '+this.ai.successRate()+'%', 530, 75);
      this.printCentreAlignedText('Player Hit Rate: '+this.human.successRate()+'%', 530, 260);
      let enemyWon = this.human.myBoard.ships.length == humanShipsSunked;
      menuTxt = enemyWon ? 'Enemy Won' : 'Player Won';
      this.updateHumanBoard();
      this.exitButton.y = enemyWon ? 360 : 170;
      this.exitButton.show();
    }
    this.drawAllMenuShips();
    this.printCentreAlignedText(menuTxt, 530, 50);
  }

  drawAllMenuShips() {
    let side = Salvo.BOARD_SIDE/Salvo.BOARD_CELLS_SIDE;
    let shipX = [530, 530+side*1.2, 530-side*1.2, 530-side*2, 530+side*2];
    for (let i=0; i<this.fauxAiShips.length; i++) 
      if (this.fauxAiShips[i].active) 
        this.fauxAiShips[i].ship.draw(shipX[i], 170, side*0.7, 0);
    for (let i=0; i<this.ai.myBoard.ships.length; i++) 
      if (!this.human.myBoard.ships[i].isSunk()) 
        this.human.myBoard.ships[i].draw(shipX[i], 360, side*0.7, 0);
  }

  runAi() {
    if (this.isGameOver() || !this.gameActive) return;
    let allMoves = [];
    for (let c=0; c<this.countAvailableMovesForPlayer(this.ai.myBoard.ships); c++) {
      let move = this.ai.run();
      allMoves.push({ x: move.x, y: move.y, outcome: this.human.attacked(move.x, move.y) });
    }
    allMoves.forEach( m => this.ai.runOutcome(m.x, m.y, m.outcome) );
    this.humanMoveCount = this.countAvailableMovesForPlayer(this.human.myBoard.ships);
    this.humanMovesOutcomes = [];
  }

  countAvailableMovesForPlayer(ships) {
    return ships.filter(s => !s.isSunk())
      .map(s => (s.shipClass == BaseShip.AIRCRAFT_CARRIER ? 2 : 1))
      .reduce((s, a) => s + a, 0);
  }

  humanBoardSetup(x, y) {
    super.humanBoardSetup(x, y);
    if (this.human.isBoardSet) {
      this.humanMoveCount = this.countAvailableMovesForPlayer(this.human.myBoard.ships);
      this.humanMovesOutcomes = [];
    }
  }

  humanGameplay(x, y) {
    this.human.resetBoardHilight();
    let row = this.human.getRowForY(y);
    let col = this.human.getColForX(x);
    if (this.human.fireAttempt(row, col)) {
      this.humanMovesOutcomes.push({ x: row, y: col, outcome: this.ai.attacked(row, col) });
    }
      this.human.fireOutcome(row, col, this.ai.attacked(row, col));
    this.humanMoveCount--;
    if (this.humanMoveCount == 0) {
      this.updateHumanBoard();
      this.gameActive = false;
      this.pauseCountDown = BaseGame.PAUSE_TIMER;
    }
  }

  updateHumanBoard() {
    this.humanMovesOutcomes.forEach(m => this.human.fireOutcome(m.x, m.y, m.outcome));
    this.humanMovesOutcomes = [];
    this.fauxAiShips.forEach(f => f.active = !f.ship.isSunk());
  }

}

Salvo.BOARD_START_X = 20;
Salvo.BOARD_START_Y = 40;
Salvo.BOARD_SIDE = 400;
Salvo.BOARD_CELLS_SIDE = 10;