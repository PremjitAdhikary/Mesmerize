class PatrolBoat extends BaseShip {
  constructor() {
    super(2);
    this.shipClass = BaseShip.PATROL_BOAT;
    this.name = 'Patrol Boat';
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
    vertex(fullWid/2, fullLen/3);
    vertex(0,fullLen/2);
    vertex(-fullWid/2, fullLen/3);
    vertex(-fullWid/2, -fullLen/4);
    endShape(CLOSE);
    strokeWeight(2);
    let buildWid = fullWid * 0.7;
    rect(-buildWid/2, -fullWid/4, buildWid, fullWid * 1.2);
    pop();
  }
}