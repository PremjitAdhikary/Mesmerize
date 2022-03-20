class KpBobble extends GraphicObj {

  constructor(sprite, x, y, z) {
    super(sprite, x, y, z);
    this.angle = 0.0;
    this.rotateAngle = 0;
  }

  animate() {
    this.rotateAngle = map(sin(this.angle), 1, -1, 0.15, -0.15);
    this.angle += 0.05;
  }

  show() {
    image(this.img.get(0, 50, 60, 85), this.x - 30, this.y - 40);
    push();
    translate(this.x, this.y - 38);
    rotate(this.rotateAngle);
    image(this.img.get(0, 0, 60, 50), -30, -40);
    pop();
  }

}