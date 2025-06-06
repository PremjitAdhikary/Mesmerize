class Battleship extends BaseShip {
  constructor() {
    super(4);
    this.shipClass = BaseShip.BATTLESHIP;
    this.name = 'Battleship';
  }
  draw(x, y, side, angle) {
    push();
    translate(x, y);
    rotate(angle);
    let fullLen = side * this.len;
    stroke(shipStroke);
    strokeWeight(3);
    fill(shipFill);
    beginShape();
    vertex(0, -fullLen/2);
    vertex(side/5, -fullLen/2+side/5);
    vertex(side/2, -fullLen/4);
    vertex(side/2, fullLen/3);
    vertex(side/4, fullLen/2);
    vertex(-side/4, fullLen/2);
    vertex(-side/2, fullLen/3);
    vertex(-side/2, -fullLen/4);
    vertex(-side/5, -fullLen/2+side/5);
    endShape(CLOSE);
    strokeWeight(2);
    rect(-side/4, -side/2, side/2, side/2);
    rect(-side/2+side/12, 0, side-side/6, side*3/4);
    this.drawGuns(0, -fullLen/4, side/3, 0);
    this.drawGuns(0, -side/3, side/3, 0);
    this.drawGuns(side/3, side/3, side/3, PI/3);
    this.drawGuns(-side/3, side/3, side/3, -PI/3);
    this.drawGuns(0, fullLen/2-side, side/3, PI);
    pop();
  }
  drawGuns(x, y, side, angle) {
    push();
    translate(x, y);
    rotate(angle);
    stroke(shipStroke);
    fill(shipStroke);
    strokeWeight(3);
    beginShape();
    vertex(side/3, -side/2+side/4);
    vertex(side/2, -side/3+side/4);
    vertex(side/2, side/3);
    vertex(side/3, side/2);
    vertex(-side/3, side/2);
    vertex(-side/2, side/3);
    vertex(-side/2, -side/3+side/4);
    vertex(-side/3, -side/2+side/4);
    endShape(CLOSE);
    line(side/4, -side/2+side/4, side/4, -side);
    line(-side/4, -side/2+side/4, -side/4, -side);
    pop();
  }

}