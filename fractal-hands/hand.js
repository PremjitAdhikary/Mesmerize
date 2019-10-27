/**
 * Hand has the following segments.
 * arm, palm and 5 fingers (thumb, index, middle, ring, little)
 */
class Hand {
  
  constructor(x, y, size, angle, color, parent) {
    this._anchor = createVector(x,y,size);
    this._size = size;
    this._angle = angle;
    this._angleOffset = 0;
    this._sizeOffset = 0.25;
    this._convertSize = 45;
    this._color = color;
    this._parent = parent;
    if (parent) {
      this._ratio = size/parent._size;
    }
    
    this._arm = new Segment(this._color);
    this._palm = new Segment(this._color);
    this._middle = new Segment(this._color);
    this._middleTransformed = false;
    this._ring = new Segment(this._color);
    this._ringTransformed = false;
    this._little = new Segment(this._color);
    this._littleTransformed = false;
    this._index = new Segment(this._color);
    this._indexTransformed = false;
    this._thumb = new Segment(this._color);
    this._thumbTransformed = false;

    this.calculateSegments();
  }

  height() {
    let midLen = this._middle.height()*sin(Math.min(PI/18,this._angleOffset/2));
    return this._arm.height() + this._palm.height() + midLen;
  }

  updateAnchor(x,y) {
    this._anchor = createVector(x,y,this._size);
  }

  update() {
    if (this._parent) {
      this._size = this._parent._size * this._ratio;
    } else {
      this._size = this._size * 1.01;
    }
    if(this._size>20 && this._angleOffset<HALF_PI)
      this._angleOffset+=(0.02*this._sizeOffset);
    this.calculateSegments();
  }

  elbowWidth() {
    return this._size*0.75;
  }

  wristWidth() {
    return this._size*0.6;
  }

  fingerBaseWidth() {
    return this._size*0.18;
  }

  fingerTipWidth() {
    return this._size*map(this._size, 0, this._convertSize, 0.1, 0.2);
  }

  calculateSegments() {
    this.calculateArm();
    this.calculatePalm();
    this.calculateFingers();
  }

  calculateArm() {
    let armLength = this._size*1.8;
    this._arm.update(this._anchor.x, this._anchor.y, this._angle, 
      armLength, this.elbowWidth(), this.wristWidth());
  }

  calculatePalm() {
    this._palmAnchor = createVector(this._size*1.8,0);
    this._palmAnchor.rotate(this._angle);
    this._palmAnchor.add(this._anchor);

    this._palm.update(this._palmAnchor.x, this._palmAnchor.y, this._angle, 
      this._size, this.wristWidth(), this.elbowWidth());
  }

  calculateFinger(thisFinger, setFinger, len, fw, ft, yOffset, parentAnchor, 
      isTransformed, angleOffset) {
    let anchor = createVector(this._size*0.95, yOffset);
    anchor.rotate(this._angle);
    anchor.add(parentAnchor);
    if (this._size > this._convertSize) {
      if (!isTransformed) {
        setFinger(new Hand(anchor.x, anchor.y, len*0.27, 
          this._angle + angleOffset, this._color, this));
      } else {
        thisFinger.updateAnchor(anchor.x, anchor.y);
        thisFinger.update();
      }
    } else {
      thisFinger.update(anchor.x,anchor.y,
        this._angle + angleOffset, 
        len,fw,ft);
    }
  }

  calculateFingers() {
    let pw = this.elbowWidth();
    let fw = this.fingerBaseWidth();
    let ft = this.fingerTipWidth();

    this.calculateFinger(
      this._middle,
      h => {
        this._middle = h;
        this._middleTransformed = true;
      },
      this._size, fw, ft, -pw/8, this._palmAnchor, this._middleTransformed, 
      -(Math.min(PI/18,this._angleOffset/2))
      );

    this.calculateFinger(
      this._ring,
      h => {
        this._ring = h;
        this._ringTransformed = true;
      },
      this._size*0.9, fw, ft, pw/8, this._palmAnchor, this._ringTransformed,  
      (Math.min(PI/18,this._angleOffset/2))
      );

    this.calculateFinger(
      this._little,
      h => {
        this._little = h;
        this._littleTransformed = true;
      },
      this._size*0.6, fw, ft, pw*3/8, this._palmAnchor, this._littleTransformed, 
      (Math.min(PI/4,this._angleOffset*1.5))
      );

    this.calculateFinger(
      this._index,
      h => {
        this._index = h;
        this._indexTransformed = true;
      },
      this._size*0.9, fw, ft, -pw*3/8, this._palmAnchor, this._indexTransformed, 
      -(Math.min(PI/6,this._angleOffset*1.5))
      );

    let thumbAnchor = createVector(this._size*0.25,-this.wristWidth()/3);
    thumbAnchor.rotate(this._angle);
    thumbAnchor.add(this._palmAnchor);
    if (this._size > this._convertSize) {
      if (!this._thumbTransformed) {
        this._thumb = new Hand(thumbAnchor.x, thumbAnchor.y, this._size*0.27, 
          this._angle - PI/20 - Math.min(PI/6,this._angleOffset*1.5), this._color, this);
        this._thumbTransformed = true;
      } else {
        this._thumb.updateAnchor(thumbAnchor.x, thumbAnchor.y);
        this._thumb.update();
      }
    } else {
      this._thumb.update(thumbAnchor.x,thumbAnchor.y,
        this._angle - PI/20 - Math.min(PI/6,this._angleOffset*1.5), 
        this._size,fw,ft);
    }
  }
  
  show() {
    this._arm.show();
    this._palm.show();
    this._middle.show();
    this._ring.show();
    this._little.show();
    this._index.show();
    this._thumb.show();
  }

}