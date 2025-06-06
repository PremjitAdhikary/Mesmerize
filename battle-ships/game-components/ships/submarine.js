class Submarine extends BaseShip {
  constructor() {
    super(3);
    this.shipClass = BaseShip.SUBMARINE;
    this.name = 'Submarine';
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
    vertex(0,fullLen*0.3);
    vertex(side/2, fullLen/2-side/4);
    vertex(side/2, fullLen/2-side/5);
    vertex(-side/2, fullLen/2-side/5);
    vertex(-side/2, fullLen/2-side/4);
    endShape(CLOSE);
    rect(-fullWid/2, -fullLen/2, fullWid, fullLen, 25);
    rect(-fullWid/4, 0, fullWid/2, fullLen*2/7, 25);
    pop();
  }
}