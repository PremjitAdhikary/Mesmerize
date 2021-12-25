class Damagable {

  constructor(params) {
    this.obj = params.obj;
    this.damageCriteria = params.damageCriteria ? params.damageCriteria : () => true;
    this.onNoHealthCallback = params.onNoHealthCallback ? params.onNoHealthCallback : () => {};
    this.repairCriteria = params.repairCriteria ? params.repairCriteria : () => true;

    this.barWid = 20;
    this.yOffset = -55;
  }

  isHit = (x, y) => this.obj.isHit(x, y);

  damage(amount) {
    if (!this.damageCriteria()) return;
    this.obj.currHealth -= amount;
    this.obj.currHealth = Math.max(0, this.obj.currHealth);
    if (this.obj.currHealth == 0) {
      this.onNoHealthCallback();
    }
  }

  repair(amount) {
    if (!this.repairCriteria()) return;
    this.obj.currHealth += amount;
    this.obj.currHealth = Math.min(this.obj.health, this.obj.currHealth);
  }

  draw() {
    push();
    translate(this.obj.x, this.obj.y);
    stroke(darkColor);
    strokeWeight(1);
    noFill();
    rect (-this.barWid/2, this.yOffset, this.barWid, 5);
    fill(darkColor);
    let w = map(this.obj.currHealth, 0, this.obj.health, 0, this.barWid);
    rect (-this.barWid/2, this.yOffset, w, 5);
    pop();
  }

}