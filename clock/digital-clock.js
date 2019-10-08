class DigitalClock {

  constructor() {
    this._numWidth = width/12;
    this._barWidth = 10;

    // flags for bars to be visible for digits
    this._midBar = [false, false, true, true, true, true, true, false, true, true];
    this._topBar = [true, false, true, true, false, true, true, true, true, true];
    this._bottomBar = [true, false, true, true, false, true, true, false, true, true];
    this._topLeft = [true, false, false, false, true, true, true, false, true, true];
    this._topRight = [true, true, true, true, true, false, false, true, true, true];
    this._bottomLeft = [true, false, true, false, false, false, true, false, true, false];

    this._htx = width/8; // hour for tens
    this._hux = width/4; // hour for units
    this._hcm = this._hux + this._numWidth + 10;
    this._mtx = width/2-40;
    this._mux = width*5/8-40;
    this._mcs = this._mux + this._numWidth + 10;
    this._stx = width*3/4;
    this._sux = width*7/8;
  }

  show() {
    background(0);
    let milli = floor(millis()%1000);
    let numberColor = SketchColor.greenyellow().stringify();
    let colonColor = (milli > 500 ? 
      SketchColor.greenyellow().alpha50().stringify() : SketchColor.greenyellow().stringify());

    let hr = hour();
    this.drawNumber(floor(hr/10), this._htx, numberColor);
    this.drawNumber(hr%10, this._hux, numberColor);
    
    this.drawColon(this._hcm, colonColor);
    
    let min = minute();
    this.drawNumber(floor(min/10), this._mtx, numberColor);
    this.drawNumber(min%10, this._mux, numberColor);

    this.drawColon(this._mcs, colonColor);

    let sec = second();
    this.drawNumber(floor(sec/10), this._stx, numberColor);
    this.drawNumber(sec%10, this._sux, numberColor);
  }

  drawNumber(num, x, color) {
    stroke(color);
    fill(color);

    if (this._midBar[num]) this.drawHorizontalLine(x,height/2);
    if (this._topBar[num]) this.drawHorizontalLine(x,height/2-this._numWidth-this._barWidth);    
    if (this._bottomBar[num]) this.drawHorizontalLine(x,height/2+this._numWidth+this._barWidth);
    if (this._topLeft[num]) 
      this.drawVerticalLine(x-this._numWidth/2-this._barWidth/2,
        height/2-this._numWidth/2-this._barWidth/2);
    if (this._topRight[num]) 
      this.drawVerticalLine(x+this._numWidth/2+this._barWidth/2,
        height/2-this._numWidth/2-this._barWidth/2);
    if (this._bottomLeft[num]) 
      this.drawVerticalLine(x-this._numWidth/2-this._barWidth/2,
        height/2+this._numWidth/2+this._barWidth/2);
    if (num!=2) 
      this.drawVerticalLine(x+this._numWidth/2+this._barWidth/2,
        height/2+this._numWidth/2+this._barWidth/2);
  }

  drawHorizontalLine(x,y) {
    quad(x-this._numWidth/2, y-this._barWidth/2, 
      x+this._numWidth/2, y-this._barWidth/2,
      x+this._numWidth/2, y+this._barWidth/2,
      x-this._numWidth/2, y+this._barWidth/2);
  }

  drawVerticalLine(x,y) {
    quad(x-this._barWidth/2, y-this._numWidth/2, 
      x+this._barWidth/2, y-this._numWidth/2,
      x+this._barWidth/2, y+this._numWidth/2,
      x-this._barWidth/2, y+this._numWidth/2);
  }

  drawColon(x, color) {
    stroke(color);
    fill(color);
    let colonWidth = 10;
    square(x - colonWidth/2,height/2 - colonWidth/2,10);
    square(x - colonWidth/2,height/2 + this._numWidth - colonWidth/2,10);
  }

}