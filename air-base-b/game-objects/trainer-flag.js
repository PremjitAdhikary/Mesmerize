class TrainerFlag {

  constructor(x, onTargetHit) {
    this.x = x;
    this.baseY = 410;
    this.active = true;
    this.targets = [];
    this.onTargetHit = onTargetHit;
  }

  show() {
    if (!this.active) return;
    strokeWeight(2);
    stroke(fireColor);
    fill(fireColor);
    triangle(this.x, this.baseY - 30, this.x, this.baseY - 40, this.x - 20, this.baseY - 30)
    stroke(darkColor);
    line(this.x, this.baseY, this.x, this.baseY - 40);
  }

  animate() {
    if (!this.active) return;
    
    let targetsHit = this.targets.filter( t => t.isHit(this.x, this.baseY - 20) );
    if (targetsHit.length > 0) {
      this.active = false;
      this.onTargetHit();
    }
  }

  addTarget = target => this.targets.push(target);

}