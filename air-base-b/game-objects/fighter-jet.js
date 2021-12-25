class FighterJet {

  constructor(x, y, move = () => {}) {
    this.init(x, y);
    this.lC = lineColor;
    this.move = move;

    this.state = OBJ_ON;
    let me = this;
    this.damagable = new Damagable({
      obj: me, 
      onNoHealthCallback: () => me.setToExplode(), 
      repairCriteria: () => false
    });
    this.damagable.barWid = 15;
    this.damagable.yOffset = -37;
  }

  init(x, y, a, showHealth = true) {
    this.x = x;
    this.y = y;
    this.prevx = this.x;
    this.prevy = this.y;
    this.a = a;
    this.idle = false;
    this.currHealth = this.health;
    this.state = OBJ_ON;
    this.showHealth = showHealth;
  }

  get _position() { return createVector(this.x, this.y) }

  animate() {
    if (this.idle) return;
    this.move(this);
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.a - HALF_PI);
    if (this.state == OBJ_ON) {
      this.drawMain(this.getView());
    }
    pop();
    if (debug) {
      stroke(255, 0, 0);
      strokeWeight(1);
      noFill();
      rect(this.x - 25, this.y - 15, 50, 30);
    }
    if (this.showHealth) this.damagable.draw();
  }

  drawMain(view) {
    drawPoly(view.wing.xCords, view.wing.yCords, this.lC, 2, true, bgColor, 
      true, view.wing.xCords, view.wing.yCords, this.lC, 1, 3, 90);
    drawPoly(view.stabalizer.xCords, view.stabalizer.yCords, this.lC, 2, true, bgColor, 
      true, view.stabalizer.xCords, view.stabalizer.yCords, this.lC, 1, 3, 90);
    drawPoly(view.body.xCords, view.body.yCords, this.lC, 2, true, bgColor, 
      true, view.bodyS.xCords, view.bodyS.yCords, this.lC, 1, 3, 0);
    stroke(this.lC);
    strokeWeight(2);
    fill(bgColor);
    ellipse(view.cockpit.x, view.cockpit.y, view.cockpit.w, view.cockpit.h);
  }

  inView = () => this.state == OBJ_ON 
    && this.x > 0 && this.x < width && this.y > 0 && this.y < height;

  isHit = (x, y) => this.inView() && collidePointRect(x, y, this.x - 25, this.y - 15, 50, 30);

  setToExplode() {
    if (audioOn) explodeBlast();
    this.state = OBJ_POP;
    bus.dispatch("AbbEventFighterDown", { fighter: this });
  }

}

FighterJet.TYPE_BOMBER = 'bomber';
FighterJet.TYPE_KAMIKAZE = 'kamikaze';
FighterJet.TYPE_LCA = 'lca';