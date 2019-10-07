class DigitalClock {

  constructor() {
    this._numWidth = width/12;

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
    let barWidth = 10;
    stroke(color);
    fill(color);

    // mid bar
    if (this._midBar[num]) {
      quad(x-this._numWidth/2, height/2-barWidth/2, 
          x+this._numWidth/2, height/2-barWidth/2, 
          x+this._numWidth/2, height/2+barWidth/2, 
          x-this._numWidth/2, height/2+barWidth/2);
    }
    
    // top bar
    if (this._topBar[num]) {
      quad(x-this._numWidth/2, height/2-barWidth/2-this._numWidth, 
          x+this._numWidth/2, height/2-barWidth/2-this._numWidth, 
          x+this._numWidth/2, height/2-barWidth*3/2-this._numWidth, 
          x-this._numWidth/2, height/2-barWidth*3/2-this._numWidth);
    }
    
    // bottom bar
    if (this._bottomBar[num]) {
      quad(x-this._numWidth/2, height/2+barWidth/2+this._numWidth, 
          x+this._numWidth/2, height/2+barWidth/2+this._numWidth, 
          x+this._numWidth/2, height/2+barWidth*3/2+this._numWidth, 
          x-this._numWidth/2, height/2+barWidth*3/2+this._numWidth);
    }
        
    // top left
    if (this._topLeft[num]) {
      quad(x-this._numWidth/2-barWidth, height/2-barWidth/2, 
        x-this._numWidth/2, height/2-barWidth/2, 
        x-this._numWidth/2, height/2-barWidth/2-this._numWidth, 
        x-this._numWidth/2-barWidth, height/2-barWidth/2-this._numWidth);
    }
    
    // top right
    if (this._topRight[num]) {
      quad(x+this._numWidth/2+barWidth, height/2-barWidth/2, 
        x+this._numWidth/2, height/2-barWidth/2, 
        x+this._numWidth/2, height/2-barWidth/2-this._numWidth, 
        x+this._numWidth/2+barWidth, height/2-barWidth/2-this._numWidth);
    }
        
    // bottom left
    if (this._bottomLeft[num]) {
      quad(x-this._numWidth/2-barWidth, height/2+barWidth/2, 
        x-this._numWidth/2, height/2+barWidth/2, 
        x-this._numWidth/2, height/2+barWidth/2+this._numWidth, 
        x-this._numWidth/2-barWidth, height/2+barWidth/2+this._numWidth);
    }
      
    // bottom right
    if (num!=2) {
      quad(x+this._numWidth/2+barWidth, height/2+barWidth/2, 
        x+this._numWidth/2, height/2+barWidth/2, 
        x+this._numWidth/2, height/2+barWidth/2+this._numWidth, 
        x+this._numWidth/2+barWidth, height/2+barWidth/2+this._numWidth);
    }
  }

  drawColon(x, color) {
    stroke(color);
    fill(color);
    let colonWidth = 10;
    square(x - colonWidth/2,height/2 - colonWidth/2,10);
    square(x - colonWidth/2,height/2 + this._numWidth - colonWidth/2,10);
  }

}