class BaseSystem {

  constructor(hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate) {
    this._hueInit = hueInit;
    this._hueInterval = hueInterval;
    this._shapeVerticesInterval = shapeVerticesInterval;
    this._maxPoints = maxPoints;
    this._maxPointsToCalculate = maxPointsToCalculate;
    this._scale = 5;
    this._points = [];
  }

  draw() {
    if (this._points.length < this._maxPoints) {
      for (let i=0; i<this._maxPointsToCalculate; i++)
        this._points.push(this.calculatePoints());
    }
  
    this.drawPoints();
  }

  calculatePoints() {
    // to be overridden
  }

  drawPoints() {
    // orbitControl();
    scale(this._scale);
    noFill();
  
    let hu = this._hueInit;
  
    strokeWeight(1);
    stroke(hu, 255, 255);
    for (let i=0; i<this._points.length; i++) {
      if (i % this._shapeVerticesInterval == 0) {
        beginShape();
        if (i !=0) vertex(this._points[i-1].x, this._points[i-1].y, this._points[i-1].z);
      }
      vertex(this._points[i].x, this._points[i].y, this._points[i].z);
      if (i == this._points.length-1) {
        endShape();
        break;
      }
      if (i % this._shapeVerticesInterval == this._shapeVerticesInterval - 1) {
        endShape();
        hu += this._hueInterval;
        stroke(hu % 360, 255, 255);
      }
    }
  
    if (this._points.length < this._maxPoints) {
      strokeWeight(5);
      stroke(hu, 255, 255);
      point(this._points[this._points.length-1].x, this._points[this._points.length-1].y, 
        this._points[this._points.length-1].z);
    }
  }

}