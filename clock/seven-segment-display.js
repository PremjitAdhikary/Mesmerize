/**
 * Source: https://en.wikipedia.org/wiki/Seven-segment_display
 */
class SevenSegmentDisplay {

  constructor(x,y,size) {
    this._x = x;
    this._y = y;
    this._segmentLen = size;
    this._segmentWid = size/4;
    this._digit = 8;
    this._color = SketchColor.green().stringify();
  }

  setDigit(digit) {
    this._digit = digit;
  }

  show(color) {
    if (color)
      this._color = color;
    stroke(this._color);
    fill(this._color);
    this.drawA();
    this.drawB();
    this.drawC();
    this.drawD();
    this.drawE();
    this.drawF();
    this.drawG();
  }

  drawA() {
    if (SevenSegmentDisplay.DISPLAY_ENCODE[this._digit] & 0x40) {
      this.drawHorizontalSegment(this._x, this._y-this._segmentLen-this._segmentWid);
    }
  }

  drawB() {
    if (SevenSegmentDisplay.DISPLAY_ENCODE[this._digit] & 0x20) {
      this.drawVerticalSegment(this._x+this._segmentLen/2+this._segmentWid/2, 
        this._y-this._segmentLen/2-this._segmentWid/2);
    }
  }

  drawC() {
    if (SevenSegmentDisplay.DISPLAY_ENCODE[this._digit] & 0x10) {
      this.drawVerticalSegment(this._x+this._segmentLen/2+this._segmentWid/2, 
        this._y+this._segmentLen/2+this._segmentWid/2);
    }
  }

  drawD() {
    if (SevenSegmentDisplay.DISPLAY_ENCODE[this._digit] & 0x8) {
      this.drawHorizontalSegment(this._x, this._y+this._segmentLen+this._segmentWid);
    }
  }

  drawE() {
    if (SevenSegmentDisplay.DISPLAY_ENCODE[this._digit] & 0x4) {
      this.drawVerticalSegment(this._x-this._segmentLen/2-this._segmentWid/2, 
        this._y+this._segmentLen/2+this._segmentWid/2);
    }
  }

  drawF() {
    if (SevenSegmentDisplay.DISPLAY_ENCODE[this._digit] & 0x2) {
      this.drawVerticalSegment(this._x-this._segmentLen/2-this._segmentWid/2, 
        this._y-this._segmentLen/2-this._segmentWid/2);
    }
  }

  drawG() {
    if (SevenSegmentDisplay.DISPLAY_ENCODE[this._digit] & 0x1) {
      this.drawHorizontalSegment(this._x, this._y);
    }
  }

  drawHorizontalSegment(x,y) {
    quad(x-this._segmentLen/2, y-this._segmentWid/2, 
      x+this._segmentLen/2, y-this._segmentWid/2,
      x+this._segmentLen/2, y+this._segmentWid/2,
      x-this._segmentLen/2, y+this._segmentWid/2);
  }

  drawVerticalSegment(x,y) {
    quad(x-this._segmentWid/2, y-this._segmentLen/2, 
      x+this._segmentWid/2, y-this._segmentLen/2,
      x+this._segmentWid/2, y+this._segmentLen/2,
      x-this._segmentWid/2, y+this._segmentLen/2);
  }

}

SevenSegmentDisplay.DISPLAY_ENCODE = [
  0x7E, 0x30, 0x6D, 0x79, 0x33, 0x5B, 0x5F, 0x70, 0x7F, 0x7B
];