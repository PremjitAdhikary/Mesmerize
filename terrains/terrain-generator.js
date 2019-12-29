/**
 * constructor ddetails:
 * terrainWidth: width of the terrain to render
 * terrainHeight: height of the terrain to render
 * terrainVariables: {
 *   noStroke: boolean value denoting whether to draw stokes or not
 *   strokeWidth: if noStroke is false, this has the stroke width, defaults to 1
 *   strokeColor: if noStroke is false, this has the stroke color, defaults to grey
 *   unitSize: size (pixel length) of each unit area, defaults to 30
 *   unitColor: color of the plane, defaults to grey
 *   rowOffsetIncrement: increment for rowOffset, defaults to 0.02
 *   colOffsetIncrement: increment for colOffset, defaults to 0.01
 *   zLow, zHigh: z value range defaults to -100 to 120
 *   flyDirection: flying direction - possible values - north, south, east, west, defaults to north
 *   flySpeed: flying speed, defaults to 0.08
 * }
 */
class TerrainGenerator {

  constructor(terrainWidth, terrainHeight, terrainVariables) {
    this._terrainWidth = terrainWidth;
    this._terrainHeight = terrainHeight;
    this._setTerrainVariables(terrainVariables);
  }

  _setTerrainVariables(terrainVariables) {
    if (terrainVariables.noStroke) {
      this._noStroke = true;
    } else {
      this._noStroke = false;
      this._strokeWidth = terrainVariables.strokeWidth ? terrainVariables.strokeWidth : 1;
      this._strokeColor = terrainVariables.strokeColor ? 
        terrainVariables.strokeColor : new SketchColor(0,0,0);
    }

    this._unitSize = terrainVariables.unitSize ? terrainVariables.unitSize : 30;
    this._unitColor = terrainVariables.unitColor ? 
        terrainVariables.unitColor : SketchColor.blend(SketchColor.grey(), SketchColor.white());

    this._rowOffsetIncrement = terrainVariables.rowOffsetIncrement ? 
        terrainVariables.rowOffsetIncrement : 0.2;
    this._colOffsetIncrement = terrainVariables.colOffsetIncrement ? 
        terrainVariables.colOffsetIncrement : 0.1;

    this._zLow = terrainVariables.zLow ? terrainVariables.zLow : -100;
    this._zHigh = terrainVariables.zHigh ? terrainVariables.zHigh : 120;
    this._zMax = 0;

    this._flyDirection = terrainVariables.flyDirection ? terrainVariables.flyDirection : 'north';
    this._flySpeed = terrainVariables.flySpeed ? terrainVariables.flySpeed : 0.08;
    this._initialFlyLocation = 0;

    // the extra +5 and +1 are to account for sudden crops in frame
    this._terrain = create2DArray(
      Math.ceil(this._terrainHeight/this._unitSize)+5, 
      Math.ceil(this._terrainWidth/this._unitSize)+1);
  }

  updateTerrainVariables() {
    this._initialFlyLocation += this._flySpeed;
    let rowOffset = this._verticalSpeedMultiplier() * this._initialFlyLocation;
    this._zMax = -1000;

    for (let r=0; r<this._terrain.length; r++) {
      let colOffset = this._horizontalSpeedMultiplier() * this._initialFlyLocation;
      for (let c=0; c<this._terrain[0].length; c++) {
        this._terrain[r][c] = map(noise(rowOffset, colOffset), 0, 1, this._zLow, this._zHigh);
        colOffset += this._colOffsetIncrement;
        this._zMax = Math.max(this._zMax, this._terrain[r][c]);
      }
      rowOffset += this._rowOffsetIncrement;
    }
  }

  _verticalSpeedMultiplier() {
    if (this._flyDirection === 'north') return -1;
    if (this._flyDirection === 'south') return 1;
    return 0;
  }

  _horizontalSpeedMultiplier() {
    if (this._flyDirection === 'east') return 1;
    if (this._flyDirection === 'west') return -1;
    return 0;
  }

  render() {
    if (this._noStroke) {
      noStroke();
    } else {
      stroke(this._strokeColor.stringify());
      strokeWeight(this._strokeWidth);
    }
    
    for (let r=0; r<this._terrain.length-1; r++) {
      beginShape(TRIANGLE_STRIP);
      for (let c=0; c<this._terrain[0].length; c++) {
        vertex(c*this._unitSize, r*this._unitSize, this._terrain[r][c]);
        vertex(c*this._unitSize, (r+1)*this._unitSize, this._terrain[r+1][c]);

        let shadow = this._mapColorToZ(this._terrain[r][c]);
        fill(SketchColor.blend(this._unitColor, shadow).stringify());
      }
      endShape();
    }
  }

  _mapColorToZ(zVal) {
    return new SketchColor(
        map(zVal, this._zLow, this._zMax, -this._unitColor._r, this._unitColor._r),
        map(zVal, this._zLow, this._zMax, -this._unitColor._g, this._unitColor._g),
        map(zVal, this._zLow, this._zMax, -this._unitColor._b, this._unitColor._b));
  }

}