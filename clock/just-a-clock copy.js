class JustAClock extends BaseClock {

  show() {
    background(0);

    stroke(this._millis_color);
    strokeWeight(20);
    noFill();
    circle(width/2, height/2, height*2/3+30);

    stroke(0);
    strokeWeight(1);
    fill(0);
    textSize(12);
    text('12', width/2-6, height/2-height/3-10);
    text('6', width/2-3, height/2+height/3+20);
    text('3', width/2+height/3+12, height/2+5);
    text('9', width/2-height/3-18, height/2+5);

    noFill();
    translate(width/2, height/2);
    rotate(270);

    this.showHand(this._sec_color, this.secondAngle(), height/3);
    this.showHand(this._min_color, this.minuteAngle(), height/3-10);
    this.showHand(this._hr_color, this.hour12Angle(), height/4-10);

    stroke(255);
    strokeWeight(20);
    point(0,0);
  }

  showHand(color, angle, length) {
    push();
    stroke(color);
    strokeWeight(5);
    rotate(angle);
    line(0,0,length,0);
    pop();
  }

}