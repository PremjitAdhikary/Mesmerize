/**
 * The simplest of the simplest bar.
 * 
 * The bar can show 2 values. In 2 different colors.
 *    __________ _______________
 *   |__________|_______________|
 *  init      left             total
 * 
 * init is the startig value.
 * end is the total of left and right value.
 */
class SplitBar {

  constructor(len, wid, leftColor, rightColor) {
    this._len = len;
    this._wid = wid;
    this._leftColor = leftColor;
    this._rightColor = rightColor;
    this._init = 0;
    this._left = 50;
    this._right = 50;
    this._x = 0;
    this._y = 0;
  }

  updateVals(init, left, right) {
    this._init = init;
    this._left = left;
    this._right = right;
  }

  show() {
    let total = this._left + this._right;
    let mid = map(this._left, this._init , total, 0, this._len);
    fill(this._leftColor);
    rect(this._x, this._y, mid, this._wid);
    fill(this._rightColor);
    rect(this._x + mid, this._y, this._len - mid, this._wid);
    textSize(8);
    fill(255);
    let initText = ''+this._init;
    let tWid = textWidth(initText);
    text(initText, this._x - tWid/2, this._y + this._wid + 10);
    let midText = ''+this._left;
    tWid = textWidth(midText);
    text(midText, this._x + mid - tWid/2, this._y + this._wid + 10);
    let totalText = total.toString();
    tWid = textWidth(totalText);
    text(totalText, this._x + this._len - tWid/2, this._y + this._wid + 10);
  }
}