class Destroyer extends BaseShip {
  constructor() {
    super(3);
    this.shipClass = BaseShip.DESTROYER;
    this.name = 'Destroyer';
  }
  draw(x, y, side, angle) {
    push();
    translate(x, y);
    rotate(angle);
    let fullLen = side * this.len;
    let fullWid = side * 0.8;
    stroke(shipStroke);
    strokeWeight(3);
    fill(shipFill);
    beginShape();
    vertex(0, -fullLen/2);
    //
    vertex(fullWid/2, -fullLen/2+side);
    vertex(fullWid/2, fullLen/2-side/2);
    vertex(fullWid/3, fullLen/2);
    //
    vertex(-fullWid/3, fullLen/2);
    vertex(-fullWid/2, fullLen/2-side/2);
    vertex(-fullWid/2, -fullLen/2+side);
    endShape(CLOSE);
    let buildWid = fullWid * 0.8;
    let towerWid = buildWid * 0.8;
    strokeWeight(2);
    rect(-buildWid/2, -side/2, buildWid, side*1.4);
    rect(-towerWid/2, side/12, towerWid, side*0.3);
    rect(-towerWid/2, side/2, towerWid, side*0.3);
    stroke(255);
    circle(0, fullLen/2-fullWid/3, side*2/5);
    this.drawGuns(0, -fullLen/4, fullWid/3, 0);
    this.drawGuns(-fullWid/5, -fullLen/20, fullWid/4, -PI/9);
    this.drawGuns(fullWid/5, -fullLen/20, fullWid/4, PI/9);
    this.drawHelicopter(0, fullLen/2-fullWid/3, fullWid*1.1, -PI/3);
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
  drawHelicopter(x, y, side, angle) {
    push();
    translate(x, y);
    rotate(angle);
    stroke(shipStroke);
    fill(shipStroke);
    strokeWeight(2);
    let bSide = side/2;
    rect(-bSide/4, -bSide/2, bSide/2, bSide, 5);
    strokeWeight(bSide/4);
    line(0, 0, 0, bSide);
    push();
    rotate(-PI/4);
    line(0, -bSide*0.8, 0, bSide*0.8);
    pop();
    push();
    rotate(PI/4);
    line(0, -bSide*0.8, 0, bSide*0.8);
    pop();
    line(-bSide/6, side/2, bSide/6, side/2);
    pop();
  }
}