class MyBoard extends BaseBoard {
  constructor(x, y, size, cellsOnSide) {
    super(x, y, size, cellsOnSide);
    this.ships = [];
    this.missedColor = blueMark;
    this.hitColor = redMark;
    this.allHits = [];
  }

  show() {
    super.show();
    for (let ship of this.ships) {
      ship.show(this.x, this.y, this.side);
    }
    stroke(255);
    fill(255);
    for (let aHit of this.allHits) {
      let aColor = (this.board[aHit.x][aHit.y] == MyBoard.HIT) ? this.hitColor : this.missedColor;
      this.drawCross(aColor, aHit.x, aHit.y);
    }
  }

  addShip(ship, row, col) {
    if (!this.canShipBeAdded(ship, row, col)) return false;
    this.ships.push(ship);
    ship.placeAt(row, col);
    return true;
  }

  canShipBeAdded(ship, row, col) {
    let shipOnGrid = (ship.orientation == BaseShip.NS && (row + ship.len - 1 <= this.cellsOnSide) ) 
      || (ship.orientation == BaseShip.EW && (col + ship.len - 1 <= this.cellsOnSide) );
    if (!shipOnGrid) return false;
    if (ship.orientation == BaseShip.NS) {
      for (let s of this.ships) 
        for (let r = row; r < row + ship.len; r++) 
          if (s.isAt(r, col)) return false;
    } else {
      for (let s of this.ships) 
        for (let c = col; c < col + ship.len; c++) 
          if (s.isAt(row, c)) return false;
    }
    return true;
  }

  hit(row, col) {
    if (this.board[row-1][col-1] == MyBoard.HIT || this.board[row-1][col-1] == MyBoard.MISSED) return false;
    this.allHits.push({ x: (row-1), y: (col-1) });
    for (let ship of this.ships) {
      if (ship.isAt(row, col)) { 
        ship.hitAt(row, col);
        this.board[row-1][col-1] = MyBoard.HIT;
        return true;
      }
    }
    this.board[row-1][col-1] = MyBoard.MISSED;
    return false;
  }

  getSunkShip() {
    return this.ships.filter(ship => ship.isSunk());
  }
}

MyBoard.NOT_ATTEMPTED = 0
MyBoard.MISSED = 1;
MyBoard.HIT = 2;