class TurtleGraphics {

  constructor() {
    this.setOpMap();
    this._custOpsMap = new Map();
    this._custPropsMap = new Map();
    this.resetToDefaults();
  }

  setOpMap() {
    this._opsMap = new Map([
      ['F', me => {
        me._drawUnit(0, -me._len, this._wid);
        translate(0, -me._len);
      }],
      ['f', me => translate(0, -me._len, me._wid)],
      ['+', me => rotate(me._angle)],
      ['-', me => rotate(-me._angle)],
      ['|', me => rotate(PI)],
      ['[', me => push()],
      [']', me => pop()],
      ['X', me => {}]
    ]);
  }

  addCustomeOp(command, func) {
    this._custOpsMap.set(command, func);
  }

  resetCustomOpsMap() {
    this._custOpsMap.clear();
  }

  addCustomProp(name, prop) {
    this._custPropsMap.set(name, prop);
  }

  getCustomProp(name) {
    return this._custPropsMap.get(name);
  }

  resetCustomPropsMap() {
    this._custPropsMap.clear();
  }

  resetToDefaults() {
    this._initPos = createVector(width/2, height/2);
    this._initAngle = 0;
    
    this._len = 50;
    this._wid = 1;
    this._angle = 0;

    this._custOpsMap.clear();
    this._custPropsMap.clear();

    this._drawUnit = (nextX, nextY, wid) => {
      stroke(255);
      strokeWeight(wid);
      line(0, 0, nextX, nextY);
    };
  }

  setDrawUnitFunction(drawUnit) {
    this._drawUnit = drawUnit;
  }

  setInit(init, angle) {
    this._initPos = init.copy();
    this._initAngle = angle;
  }

  getLen() {
    return this._len;
  }

  setLen(len) {
    this._len = len;
  }

  getWid() {
    return this._wid;
  }

  setWid(wid) {
    this._wid = wid;
  }

  setAngle(angle) {
    this._angle = angle;
  }

  render(input) {
    resetMatrix();
    push();
    translate(this._initPos.x, this._initPos.y);
    rotate(this._initAngle);
    for (let i=0; i<input.length; i++) {
      let c = input.charAt(i);
      let opsMap = this._opsMap.has(c) ? 
        this._opsMap : this._custOpsMap.has(c) ? this._custOpsMap : null;
      opsMap.get(c)(this);
    }
    pop();
  }
}