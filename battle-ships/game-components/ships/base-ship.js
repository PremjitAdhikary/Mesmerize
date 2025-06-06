class BaseShip {

  constructor(len) {
    this.len = len;
    this.orientation = BaseShip.NS;
    this.damage = new Array(len).fill(false);
    this.row = 0;
    this.col = 0;
  }

  placeAt(row, col) {
    this.row = row;
    this.col = col;
  }

  isAt(row, col) {
    if (this.orientation == BaseShip.NS) {
      if (this.col != col) return false;
      return row >= this.row && row <= (this.row+this.len-1);
    } else {
      if (this.row != row) return false;
      return col >= this.col && col <= (this.col+this.len-1);
    }
  }

  hitAt(row, col) {
    if (!this.isAt(row, col)) return;
    if (this.orientation == BaseShip.NS)
      this.damage[row - this.row] = true;
    else
      this.damage[col - this.col] = true;
  }

  switchOrientation() {
    this.orientation = this.orientation == BaseShip.NS ? BaseShip.EW : BaseShip.NS;
  }

  isSunk() {
    return !this.damage.some(d => !d);
  }

  getHorizontalLength(side) {
    let gap = side/8;
    if (this.orientation == BaseShip.NS) {
      return side - gap*2;
    } else {
      return side * this.len - gap*2;
    }
  }

  show(boardX, boardY, side) {
    stroke(blackMark);
    strokeWeight(2);
    noFill();
    let gap = side/8;
    let shipLen = this.len*side-gap*2;
    let shipWd = side-gap*2;
    let xStart, yStart;
    if (this.orientation == BaseShip.NS) {
      xStart = boardX + (this.col-1)*side + shipWd/2 + gap;
      yStart = boardY + (this.row-1)*side + shipLen/2 + gap;
      scribble.scribbleRect(xStart, yStart, shipWd, shipLen);
    }
    else {
      xStart = boardX + (this.col-1)*side + shipLen/2 + gap;
      yStart = boardY + (this.row-1)*side + shipWd/2 + gap;
      scribble.scribbleRect(xStart, yStart, shipLen, shipWd);
    }
  }
}

BaseShip.NS = 1;
BaseShip.EW = 2;

BaseShip.AIRCRAFT_CARRIER = 'c';
BaseShip.BATTLESHIP = 'b';
BaseShip.DESTROYER = 'd';
BaseShip.SUBMARINE = 's';
BaseShip.PATROL_BOAT = 'p';
BaseShip.FRIGATE = 'f';