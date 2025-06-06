class AircraftCarrier extends BaseShip {
  constructor() {
    super(5);
    this.shipClass = BaseShip.AIRCRAFT_CARRIER;
    this.name = 'Aircraft Carrier';
  }
  draw(x, y, side, angle) {
    push();
    translate(x, y);
    rotate(angle);
    let fullLen = side * this.len;
    let fullWid = side * 1.5;
    stroke(shipStroke);
    strokeWeight(3);
    fill(shipFill);
    beginShape();
    vertex(-fullWid/8, -fullLen/2);
    vertex(fullWid/2-fullWid/8, -fullLen/2);
    vertex(fullWid/2-fullWid/8, -fullLen/2+fullLen*1/4-fullLen*1/32);
    vertex(fullWid/2, -fullLen/2+fullLen*1/4);
    //
    vertex(fullWid/2, fullLen/2-fullLen/32);
    vertex(0, fullLen/2);
    vertex(-fullWid/2, fullLen/2);
    vertex(-fullWid/2, -fullLen/2+fullLen*1/3);
    vertex(-fullWid/6, -fullLen/2+fullLen*1/3-fullLen/32);
    endShape(CLOSE);
    stroke(255);
    strokeWeight(2);
    line(fullWid/8, -fullLen/2+fullLen/64, fullWid/8, fullLen/2-fullLen/32);
    line(-fullWid/2, -fullLen/2+fullLen*1/3, 2, fullLen/2);
    line(-fullWid/6, -fullLen/2+fullLen*1/3-fullLen/32, fullWid/3, fullLen/2-fullLen/32);
    circle(-fullWid/4, fullLen/2-fullWid/4, fullWid/3);
    stroke(shipStroke);
    strokeWeight(3);
    rect(fullWid/4, 0, fullWid/3, side*1.2);
    strokeWeight(2);
    rect(fullWid/4+3, side*3/5, fullWid/3-6, side/3);
    this.drawFighter(fullWid/3, side*2, side/3, -PI/2);
    this.drawFighter(fullWid/3, side*1.5, side/3, -PI/2);
    this.drawFighter(fullWid*2/7, -side/3, side/3, -PI/6);
    this.drawFighter(fullWid*2/7, -side*4/5, side/3, -PI/6);
    this.drawFighter(fullWid*2/7, -side*1.275, side/3, -PI/6);
    pop();
  }
  drawFighter(x, y, side, angle) {
    push();
    translate(x, y);
    rotate(angle);
    stroke(shipStroke);
    fill(shipStroke);
    beginShape();
    vertex(0, -side/2);
    vertex(-side/12, -side/16);
    vertex(-side/2, side/3);
    vertex(-side/2, side/2);
    vertex(-side/10, side/3);
    vertex(-side/10, side/2);
    vertex(side/10, side/2);
    vertex(side/10, side/3);
    vertex(side/2, side/2);
    vertex(side/2, side/3);
    vertex(side/12, -side/16);
    endShape(CLOSE);
    pop();
  }
}