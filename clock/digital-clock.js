class DigitalClock {

  constructor() {
    this._segmentLen = width/13;
    this._segmentColor = SketchColor.greenyellow().stringify();

    this._hoursTen = new SevenSegmentDisplay(width/8, height/2, this._segmentLen);
    this._hoursUnit = new SevenSegmentDisplay(width/4, height/2, this._segmentLen);
    this._minutesTen = new SevenSegmentDisplay(width/2-40, height/2, this._segmentLen);
    this._minutesUnit = new SevenSegmentDisplay(width*5/8-40, height/2, this._segmentLen);
    this._secondsTen = new SevenSegmentDisplay(width*3/4, height/2, this._segmentLen);
    this._secondsUnit = new SevenSegmentDisplay(width*7/8, height/2, this._segmentLen);

    this._hcm = width/4 + this._segmentLen + 10;
    this._mcs = width*5/8 + this._segmentLen - 30;
  }

  show() {
    background(0);
    strokeWeight(1);
    let milli = floor(millis()%1000);
    let colonColor = (milli > 500 ? 
      SketchColor.greenyellow().alpha50().stringify() : SketchColor.greenyellow().stringify());
    
    this.drawColon(this._hcm, colonColor);
    this.drawColon(this._mcs, colonColor);

    let hr = hour();
    this._hoursTen.setDigit(floor(hr/10));
    this._hoursTen.show(this._segmentColor);
    this._hoursUnit.setDigit(hr%10);
    this._hoursUnit.show(this._segmentColor);
    
    let min = minute();
    this._minutesTen.setDigit(floor(min/10));
    this._minutesTen.show(this._segmentColor);
    this._minutesUnit.setDigit(min%10);
    this._minutesUnit.show(this._segmentColor);

    let sec = second();
    this._secondsTen.setDigit(floor(sec/10));
    this._secondsTen.show(this._segmentColor);
    this._secondsUnit.setDigit(sec%10);
    this._secondsUnit.show(this._segmentColor);
  }

  drawColon(x, color) {
    stroke(color);
    fill(color);
    let colonWidth = 10;
    square(x - colonWidth/2,height/2 - colonWidth/2,10);
    square(x - colonWidth/2,height/2 + this._segmentLen - colonWidth/2,10);
  }

}