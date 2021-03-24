/**
 * A multi level pie chart where the outer arc is subdivided to show child values for the pie.
 */
class PieChart {
  
  constructor(diameter, init, max, primaryColors, secondaryColors) {
    this._diameter = diameter;
    this._init = init;
    this.updateMax(max);
    this._primaryColors = primaryColors;
    this._x = 0;
    this._y = 0;
    this._primaryValues = new Array(primaryColors.length).fill(0);
    if (secondaryColors !== undefined) {
      this._secondaryColors = secondaryColors;
      this._secondaryValues = [];
      for (let c of primaryColors) {
        this._secondaryValues.push(new Array(secondaryColors.length).fill(0));
      }
    }
  }

  updateMax(max) {
    this._max = max;
  }

  updateValues(primaryValues, secondaryValues) {
    if (primaryValues.length != this._primaryValues.length) {
      throw 'Primary Values dont match';
    }
    for (let i=0; i<primaryValues.length; i++) {
      this._primaryValues[i] = primaryValues[i];
      if (this._secondaryColors !== undefined) {
        if (secondaryValues[i].length != this._secondaryColors.length) {
          throw 'Secondary Values dont match';
        }
        for (let j=0; j<secondaryValues.length; j++) {
          this._secondaryValues[i][j] = secondaryValues[i][j];
        }
      }
    }
  }

  show() {
    if (this._max == 0) return;
    let lastAngle = 0;
    push();
    translate(this._x + this._diameter/2, this._y + this._diameter/2);
    let primaryStrokeWeight = this._diameter / 5;
    let primaryDiameter = this._diameter / 5 * 3.5;
    let secondaryRadius = this._diameter / 5 * 4.8;
    let secondaryStrokeWeight = this._diameter / 20;
    for (let i=0; i<this._primaryValues.length; i++) {
      if (this._primaryValues[i] == 0) continue;
      let angle = radians(map(this._primaryValues[i], this._init, this._max, 0, 360));
      stroke(this._primaryColors[i]);
      fill(0);
      strokeWeight(primaryStrokeWeight);
      strokeCap(SQUARE);
      arc(0, 0, primaryDiameter, primaryDiameter, lastAngle, lastAngle+angle);
      if (this._secondaryColors !== undefined) {
        let lastAngleS = lastAngle;
        for (let j=0; j<this._secondaryColors.length; j++) {
          if (this._secondaryValues[i][j] == 0) continue;
          let angleS = radians(map(this._secondaryValues[i][j], this._init, this._max, 0, 360));
          stroke(this._secondaryColors[j]);
          noFill();
          strokeWeight(secondaryStrokeWeight);
          arc(0, 0, secondaryRadius, secondaryRadius, lastAngleS, lastAngleS+angleS);
          lastAngleS += angleS;
        }
      }
      lastAngle += angle;
    }
    pop();
  }

}