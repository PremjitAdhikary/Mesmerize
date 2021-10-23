class BarClock extends BaseClock {

  show() {
    background(0);
    strokeWeight(1);
    textSize(12);

    this.showBar(
      this._hr_color, hour(), height/5, height/5 - height/20, this.hour24Length(width*0.9));
    this.showBar(
      this._min_color, minute(), height*2/5, height*2/5 - height/20, this.minuteLength(width*0.9));
    this.showBar(
      this._sec_color, second(), height*3/5, height*3/5 - height/20, this.secondLength(width*0.9));
    this.showBar(
      this._millis_color, floor(millis()%1000), height*4/5, height*4/5 - height/20, 
      this.millisLength(width*0.9));
  }

  showBar(color, txtVal, txtYVal, rectYVal, len) {
    stroke(color);
    fill(color);
    text(txtVal, 5, txtYVal);
    rect(width*0.05, rectYVal, len, height/10);
  }

}