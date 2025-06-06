class Frigate extends BaseShip {
  constructor() {
    super(2);
    this.shipClass = BaseShip.FRIGATE;
    this.name = 'Frigate';
  }
  draw(x, y, side, angle) {
    push();
    translate(x, y);
    rotate(angle);
    let fullLen = side * this.len;
    let fullWid = side * 0.6;
    stroke(shipStroke);
    strokeWeight(3);
    fill(shipFill);
    beginShape();
    vertex(0,-fullLen/2);
    vertex(fullWid/2, -fullLen/4);
    vertex(fullWid/2, fullLen/2);
    vertex(-fullWid/2, fullLen/2);
    vertex(-fullWid/2, -fullLen/4);
    endShape(CLOSE);
    strokeWeight(2);
    let buildWid = fullWid * 0.7;
    rect(-buildWid/2, 0, buildWid, fullWid * 1.2);
    this.drawGuns(0, -fullWid/2, fullWid/2, 0);
    pop();
  }
  drawGuns(x, y, side, angle) {
    push();
    translate(x, y);
    rotate(angle);
    stroke(shipStroke);
    fill(shipStroke);
    strokeWeight(2);
    beginShape();
    vertex(side/3, -side/2+side/4);
    vertex(side/2, side/3);
    vertex(-side/2, side/3);
    vertex(-side/3, -side/2+side/4);
    vertex();
    endShape(CLOSE);
    line(0, -side/2+side/4, 0, -side);
    pop();
  }
}