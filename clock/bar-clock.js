class BarClock extends BaseClock {

  show() {
    background(0);
    strokeWeight(1);
    textSize(12);

    stroke(this._hr_color);
    fill(this._hr_color);
    text(hour(), 5, height*1/5);
    rect(width*0.05, height*1/5 - height/20, this.hour24Length(width*0.9), height/10);

    stroke(this._min_color);
    fill(this._min_color);
    text(minute(), 5, height*2/5);
    rect(width*0.05, height*2/5 - height/20, this.minuteLength(width*0.9), height/10);

    stroke(this._sec_color);
    fill(this._sec_color);
    text(second(), 5, height*3/5);
    rect(width*0.05, height*3/5 - height/20, this.secondLength(width*0.9), height/10);

    stroke(this._millis_color);
    fill(this._millis_color);
    text(floor(millis()%1000), 5, height*4/5);
    rect(width*0.05, height*4/5 - height/20, this.millisLength(width*0.9), height/10);
  }

}