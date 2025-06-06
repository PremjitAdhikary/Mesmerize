class BasicButton {
  constructor(x,y, len,wid, txt, txtSz) {
    this.x = x;
    this.y = y;
    this.len = len;
    this.wid = wid;
    this.txt = txt;
    this.txtSz = txtSz
    textSize(txtSz);
    this.txtWd = textWidth(this.txt);
    this.enabled = true;
  }
  show() {
    if (this.enabled) {
      fill(buttonFill);
      stroke(buttonStroke);
    } else {
      fill(shipFill);
      stroke(shipStroke);
    }
    strokeWeight(2);
    rect(this.x - this.len/2, this.y - this.wid/2, this.len, this.wid, 5);
    strokeWeight(1);
    if (this.enabled) {
      fill(buttonTxtColor);
      stroke(buttonTxtColor);
    } else {
      fill(shipStroke);
      stroke(shipStroke);
    }
    textSize(this.txtSz);
    text(this.txt, this.x-this.txtWd/2, this.y+this.txtSz/3);
  }
  isClicked(x, y) {
    return this.enabled && x > this.x - this.len/2 && x < this.x + this.len/2
     && y > this.y - this.wid/2 && y < this.y + this.wid/2;
  }
}