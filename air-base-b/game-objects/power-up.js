class PowerUp {

  constructor(x, powerTicks) {
    this.x = x;
    this.powerTicks = powerTicks;
    this.baseY = 400;
    this.y = this.baseY;
    this.active = true;
    this.targets = [];
    this.a = 0;
  }

  show() {
    if (!this.active) return;
    stroke(fireColor);
    strokeWeight(2);
    fill(fireColor);
    rect(this.x - 8, this.y - 30, 16, 40);
    ellipse (this.x, this.y + 10, 15, 8);
    fill(bgColor);
    ellipse (this.x, this.y - 30, 16, 8);
    ellipse (this.x, this.y - 30, 6, 3);
    stroke(bgColor);
    beginShape();
    vertex(this.x, this.y - 15);
    vertex(this.x - 6, this.y - 5);
    vertex(this.x + 6, this.y - 5);
    vertex(this.x, this.y + 5);
    endShape();
  }

  animate() {
    if (!this.active) return;
    this.y = this.baseY + (Math.cos(this.a) * 3);
    this.a += 0.1;
    let target = this.targets.find( t => t.isHit(this.x, this.y) );
    if (target) {
      target.powerUp(this.powerTicks);
      this.active = false;
    }
  }

  addTarget = target => this.targets.push(target);

}