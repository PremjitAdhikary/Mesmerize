class PuzzleBoard {

  constructor(thumb, img) {
    this.thumb = thumb;
    this.thumb.resize(100, 0);
    this.img = img;
  }

  jumble() {
    this.puzzleSolved = false;
    this.tiles = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,-1];
    this.movableTiles = this.getMovableTiles();
    for (let i=0; i<100; i++) {
      this.moveTile(random(this.movableTiles));
    }
  }

  show(cx, cy) {
    this.showThumb();
    this.showTiles();
    if (!this.puzzleSolved) {
      this.showMovableTileWhenHovered(cx, cy);
    }
  }

  showThumb() {
    stroke(BOARD_COLOR);
    fill(BOARD_COLOR);
    strokeWeight(1);
    square(8, 8, 104, 2);
    image(this.thumb, 10, 10);
  }

  showTiles() {
    square(125, 35, 410, 5);
    for (let i=0; i < this.tiles.length; i++) {
      if (this.tiles[i] < 0) continue;
      image(this.getSprite(this.tiles[i]), 130 + this.getXForTile(i), 40 + this.getYForTile(i));
    }
  }

  showMovableTileWhenHovered(cx, cy) {
    if (!this.areCoordinatesOnMovableTile(cx, cy)) return;
    let hoveredTileNum = this.getMovableTileInCoordinates(cx, cy);
    noFill();
    stroke(150);
    strokeWeight(3);
    square(130 + this.getXForTile(hoveredTileNum), 40 + this.getYForTile(hoveredTileNum), 100);
  }

  getSprite(tileNum) {
    return this.img.get(this.getXForTile(tileNum), this.getYForTile(tileNum), 100, 100);
  }
  
  getXForTile(tileNum) {
    return (tileNum%4) * 100;
  }
  
  getYForTile(tileNum) {
    return Math.floor(tileNum/4) * 100;
  }
  
  isSolved() {
    for (let t=0; t<this.tiles.length-1; t++) {
      if (t != this.tiles[t]) return false;
    }
    return true;
  }

  areCoordinatesOnMovableTile(cx, cy) {
    if (!mouseInCanvas()) return false;
    return this.movableTiles.some(tile => this.areCoordinatesOnTile(tile, cx, cy));
  }

  /**
   * Must call only if areCoordinatesOnMovableTile() is true
   */
  getMovableTileInCoordinates(cx, cy) {
    return this.movableTiles.find(tile => this.areCoordinatesOnTile(tile, cx, cy));
  }

  /**
   * Must call only if areCoordinatesOnMovableTile() is true
   */
  moveTileAtCoordinates(cx, cy) {
    if (this.puzzleSolved) return;
    this.moveTile(this.getMovableTileInCoordinates(cx, cy));
    if (this.isSolved()) {
      this.tiles[15] = 15;
      this.puzzleSolved = true;
    }
  }

  moveTile(tileToMove) {
    let emptyTileNum = this.getEmptyTileNum();
    this.tiles[emptyTileNum] = this.tiles[tileToMove]
    this.tiles[tileToMove] = -1;
    this.movableTiles = this.getMovableTiles();
  }

  getMovableTiles() {
    let emptyTileNum = this.getEmptyTileNum();
    let movableTiles = [];
    let upTilePresent = (emptyTileNum - 4) >= 0;
    if (upTilePresent) movableTiles.push(emptyTileNum - 4);
    let downTilePresent = (emptyTileNum + 4) <= 15;
    if (downTilePresent) movableTiles.push(emptyTileNum + 4);
    let leftTilePresent = (emptyTileNum - 1) >= 0 
      && this.getYForTile(emptyTileNum - 1) == this.getYForTile(emptyTileNum);
    if (leftTilePresent) movableTiles.push(emptyTileNum - 1);
    let rightTilePresent = (emptyTileNum + 1) <= 15 
      && this.getYForTile(emptyTileNum + 1) == this.getYForTile(emptyTileNum);
    if (rightTilePresent) movableTiles.push(emptyTileNum + 1);
    return movableTiles;
  }

  getEmptyTileNum() {
    return this.tiles.indexOf(-1);
  }

  areCoordinatesOnTile(tileNum, cx, cy) {
    let tileX = this.getXForTile(tileNum);
    let tileY = this.getYForTile(tileNum);
    return mouseX > (130 + tileX) && cx < (230 + tileX) 
      && mouseY > (40 + tileY) && cy < (140 + tileY);
  }

}