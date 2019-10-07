class MaedasClock extends BaseClock {

  show() {
    background(0);
    noFill();
    let sec = second();
    let min = minute();
    let hr = hour();
    for (let t=0; t<60; t++) {
      this.drawText(t, hr==t, min==t, sec==t);
    }
  }

  drawText(num, isHr, isMin, isSec) {
    let size = 35;
    if (isSec) {
      size = 50;
      stroke(this._sec_color);
      fill(this._sec_color);
    } else if (isMin) {
      stroke(this._min_color);
      fill(this._min_color);
    } else if (isHr) {
      stroke(this._hr_color);
      fill(this._hr_color);
    } else {
      stroke(SketchColor.grey().stringify());
      fill(SketchColor.grey().stringify());
    }

    strokeWeight(1);
    let x = width/10*(num%10) + (size==35?10:2);
    let y = height/6*(floor(num/10)) + (size==35?55:60);
    textSize(size);
    textStyle(ITALIC);
    text(num<10 ? '0'+num : num, x, y);
  }

}