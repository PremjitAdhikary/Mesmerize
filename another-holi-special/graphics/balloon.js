class Balloon extends GraphicObj {

  constructor(sprite, config, target) {
    super(sprite, config.x, config.y, config.z);
    this.config = config;
    this.target = target;
    this.speed = -9;
    this.scale = 1.0;
    this.thrown = false;
    this.moveBarColor = SketchColor.grey().stringify();
  }

  animate() {
    if (this.toRemove) return;
    if (!this.thrown) {
      this.moveOnBar();
      if (!this.config.isActive(this)) this.toRemove = true;
      return;
    }
    this.moveInAir();
    this.checkAndHitTarget();
    if (!this.config.isActive(this)) this.toRemove = true;
  }

  show() {
    if (this.toRemove) return;
    this.showMoveBar();
    this.showBalloon();
  }

  moveOnBar() {
    if (collidePointRect(mouseX, mouseY, 
      Balloon.MOVEBAR.x, 0, Balloon.MOVEBAR.w, height)) {
      this.x = mouseX - balloon.config.spriteW/2;
    }
  }

  moveInAir() {
    this.y += this.speed;
    this.speed += 0.2;
    this.z -= 0.2;
    this.scale -= 0.007;
  }

  checkAndHitTarget() {
    if (this.target.checkCollision(this)) {
      this.target.hit(this.center(), this.config.color());
    }
  }

  showMoveBar() {
    if (this.thrown) return;
    stroke(this.moveBarColor);
    noFill();
    rect(Balloon.MOVEBAR.x, Balloon.MOVEBAR.y, Balloon.MOVEBAR.w, Balloon.MOVEBAR.h);
  }

  showBalloon() {
    let balloonImage = this.img.get(
      this.config.spriteX, this.config.spriteY, this.config.spriteW, this.config.spriteH);
    balloonImage.resize(this.config.spriteW*this.scale, 0)
    image(balloonImage, this.x, this.y);
  }

  throw() {
    if (this.toRemove) return;
    if (!this.thrown) this.thrown = true;
  }

  center() {
    return createVector(this.x + this.config.spriteW/2, this.y + this.config.spriteH/2);
  }

  diameter() {
    return this.config.spriteW - 35;
  }

}

Balloon.MOVEBAR = {
  x: 100, y: 392, w: 200, h: 10
};

Balloon.CONFIGURATIONS = [
  {
    x: 200, y: 360, z: 12, 
    spriteX: 0, spriteY: 135, spriteW: 60, spriteH: 57,
    isActive: balloon => (balloon.y < 380 && !(balloon.target.isHit || balloon.target.toRemove)), 
    color: () => SketchColor.green()
  }, 
  {
    x: 200, y: 360, z: 12, 
    spriteX: 0, spriteY: 192, spriteW: 60, spriteH: 60,
    isActive: balloon => (balloon.y < 380 && !(balloon.target.isHit || balloon.target.toRemove)), 
    color: () => SketchColor.yellow()
  }, 
  {
    x: 200, y: 360, z: 12, 
    spriteX: 0, spriteY: 252, spriteW: 60, spriteH: 64,
    isActive: balloon => (balloon.y < 380 && !(balloon.target.isHit || balloon.target.toRemove)), 
    color: () => SketchColor.red()
  }
];

Balloon.GET_ONE = target => {
  let config = random(Balloon.CONFIGURATIONS);
  return new Balloon(sprite, config, target);
};