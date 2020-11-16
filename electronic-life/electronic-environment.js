/**
 * This class sets up the initial environment for the world. All the water and land tiles are 
 * drawn here and persisted in buffer. Utilizes EffectsRipples for ripples to appear when actors 
 * move on water.
 * 
 * Constructor:
 * - configData: This is the selected layout from env-plan.json
 * 
 * Other Methods:
 * - setupEnv(): internal method called from the constructor
 * - preprocessRenderTiles(): internal method called from setupEnv()
 * - neighborHasValue(data, x, y, val): internal method
 * - drawLandBlock(x, y): self explanatory
 * - drawWaterBlock(x, y, rounded, color): self explanatory 
 * - blurWater() and blurPixel(pixelArr, pixelX, pixelY): to blur the water to simulate mix
 * - setDamping(damping): for the EffectsRipples
 * - show(): renders the environment in 2 steps
 *     1) Renders the EffectsRipples object
 *     2) Renders the saved land tiles buffer
 * - ripple(x, y): drops a ripple in the EffectsRipples object
 */
class ElectronicEnvironment {

  constructor(configData) {
    this._configData = configData;
    this.GROUND_COLOR = new SketchColor(80,210,93);
    this.MOSS_COLOR = SketchColor.greenyellow();
    this.WATER_COLOR = new SketchColor(108,203,229);
    this.DEEP_WATER_COLOR = new SketchColor(91,173,194);

    this._envBuffer = createGraphics(width, height);
    this._envData;
    this._envWithRipples;
    this._landBuffer = createGraphics(width, height);

    this.setupEnv();
  }

  setupEnv() {
    this._envBuffer.background(this.WATER_COLOR.stringify());
    this._envData = this.preprocessRenderTiles();
    for (let x=0; x<this._envData.length; x++) {
      for (let y=0; y<this._envData[x].length; y++) {
        if (this._envData[x][y] === ElectronicEnvironment.LAND_CHAR) {
          this.drawLandBlock(x,y);
        } else if (this._envData[x][y] === ElectronicEnvironment.WATER_MERGE) {
          this.drawWaterBlock(x,y,4,
            SketchColor.blend(this.DEEP_WATER_COLOR, this.WATER_COLOR).stringify());
        } else if (this._envData[x][y] !== ElectronicEnvironment.WATER_EDGE) {
          this.drawWaterBlock(x,y,2,this.DEEP_WATER_COLOR.stringify());
        }
      }
    }
    this.blurWater();
    image(this._envBuffer, 0, 0);
    this._envWithRipples = new EffectsRipples(
      width, height, 
      SketchColor.white(),
      0.7);
    this._envWithRipples.setBaseColor();
  }

  /**
   * Marks the cells as per what tile should be rendered on it
   * - land tiles
   * - shallow water tiles which share at least 1 edge with a land tile
   * - deep water tiles which share no adge with either shallow water or land tile
   * - merge water tiles which stays betwwn shallow and deep water tiles
   */
  preprocessRenderTiles() {
    let dataStr = this._configData.data;
    this._tileSize = this._configData.size;
    let data = [];
    dataStr.forEach(s => data.push([...s]));
    forEach2DArray(data, (arrCell, r, c) => {
      if ((data[r][c] === ' ' 
        && this.neighborHasValue(data,r,c,ElectronicEnvironment.LAND_CHAR))) 
        data[r][c] = ElectronicEnvironment.WATER_EDGE;
    } );
    forEach2DArray(data, (arrCell, r, c) => {
      if ((data[r][c] === ' ' 
        && this.neighborHasValue(data,r,c,ElectronicEnvironment.WATER_EDGE))) 
        data[r][c] = ElectronicEnvironment.WATER_MERGE;
    } );
    return data;
  }

  /**
   * For the cell[x][y], returns true if value is val, else false
   */
  neighborHasValue(data, x, y, val) {
    return (x>0 && y>0 && data[x-1][y-1] === val)
      || (y>0 && data[x][y-1] === val)
      || (x<data.length-1 && y>0 && data[x+1][y-1] === val)
      || (x>0 && data[x-1][y] === val)
      || (x<data.length-1 && data[x+1][y] === val)
      || (x>0 && y<data[0].length-1 && data[x-1][y+1] === val)
      || (y<data[0].length-1 && data[x][y+1] === val)
      || (x<data.length-1 && y<data[0].length-1 && data[x+1][y+1] === val);
  }

  /**
   * Draws a land tile with random grass on it
   */
  drawLandBlock(x, y) {
    this._envBuffer.strokeWeight(1);
    this._envBuffer.stroke(this.GROUND_COLOR.stringify());
    this._envBuffer.fill(this.GROUND_COLOR.stringify());
    this._envBuffer.square(
      y * this._tileSize, 
      x * this._tileSize, 
      this._tileSize, 
      5);
    
    this._landBuffer.strokeWeight(1);
    this._landBuffer.stroke(this.GROUND_COLOR.stringify());
    this._landBuffer.fill(this.GROUND_COLOR.stringify());
    this._landBuffer.square(
      y * this._tileSize, 
      x * this._tileSize, 
      this._tileSize, 
      5);
  
    for (let a=0; a<random(this._tileSize, this._tileSize+10); a++) {
      let xOff = random(this._tileSize);
      let yOff = random(this._tileSize);
  
      this._landBuffer.strokeWeight(random([2,3,3,4]));
      this._landBuffer.stroke(this.MOSS_COLOR.stringify());
      this._landBuffer.point(
        y * this._tileSize + yOff, 
        x * this._tileSize + xOff);
    }
  }

  /**
   * Draws water tile based on type (merge, deep - by default the whole canvas is colored with 
   * shallow water color)
   */
  drawWaterBlock(x, y, rounded, color) {
    this._envBuffer.strokeWeight(1);
    this._envBuffer.stroke(color);
    this._envBuffer.fill(color);
    this._envBuffer.square(
      y * this._tileSize, 
      x * this._tileSize, 
      this._tileSize, 
      rounded);
  }

  /**
   * Finds all the water tiles, and for each tile, blur all the pixels in it
   */
  blurWater() {
    this._envBuffer.loadPixels();
    for (let r = 0; r < this._envData.length; r++) {
      for (let c = 0; c < this._envData[r].length; c++) {
        if (this._envData[r][c] !== ElectronicEnvironment.LAND_CHAR) {
          for (let rOff = 0; rOff < this._tileSize; rOff++) {
            for (let cOff = 0; cOff < this._tileSize; cOff++) {
              let pixelX = c * this._tileSize + cOff;
              let pixelY = r * this._tileSize + rOff;
              this.blurPixel(this._envBuffer.pixels, pixelX, pixelY);
            }
          }
        }
      }
      this._envBuffer.updatePixels();
    }
  }

  /**
   * Analyzes every pixel in an area and blends it with the neighboring pixels to blur the image.
   * 
   */
  blurPixel(pixelArr, pixelX, pixelY) {
    let blurRange = 5; // How blurry the image will be
    let sumR = 0, sumG = 0, sumB = 0;
    for (let kX=-blurRange; kX<=blurRange; kX++) {
      for (let kY=-blurRange; kY<=blurRange; kY++) {
        let indexK = (pixelX+kX + (pixelY+kY)*width) * 4;
        sumR += pixelArr[indexK];
        sumG += pixelArr[indexK+1];
        sumB += pixelArr[indexK+2];
      }
    }
    let index = (pixelX + pixelY*width) * 4;
    let divisor = Math.pow(2*blurRange + 1, 2);
    pixelArr[index] = sumR/divisor;
    pixelArr[index+1] = sumG/divisor;
    pixelArr[index+2] = sumB/divisor;
    pixelArr[index+3] = 255;
  }

  setDamping(damping) {
    this._envWithRipples.setDamping(damping);
  }

  show() {
    this._envWithRipples.show();
    image(this._landBuffer, 0, 0);
  }

  ripple(x, y) {
    this._envWithRipples.ripple(x, y);
  }

}

ElectronicEnvironment.LAND_CHAR = '#';
ElectronicEnvironment.PLANT_CHAR = 'p';
ElectronicEnvironment.FLY_CHAR = 'f';
ElectronicEnvironment.WATER_EDGE = 'l';
ElectronicEnvironment.WATER_MERGE = 'm';
ElectronicEnvironment.PLANT_EATER_CHAR = 'e';
ElectronicEnvironment.PREDATOR = 'x';