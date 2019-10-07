class ArcClock extends BaseClock {

  show() {
    background(0);
    noFill();
    translate(width/2, height/2);
    rotate(270);

    this.showArc(this._hr_color, this.hour12Angle(), 3, hour()%12!=1);
    this.showArc(this._min_color, this.minuteAngle(), 2, hour()%2!=1);
    this.showArc(this._sec_color, this.secondAngle(), 1, minute()%2!=1);

    stroke(255);
    strokeWeight(20);
    point(0,0);
  }

  showArc(color, angle, position, alt) {
    if (!alt && angle==0) return;
    let wt = 50;
    let radius = height/20 + (wt*position*2.5);
    push();
    stroke(color);
    strokeWeight(wt);
    strokeCap(SQUARE);
    if (alt) {
      arc(0,0,radius,radius,angle,0);
    } else {
      arc(0,0,radius,radius,0,angle);
    }
    pop();
  }

}