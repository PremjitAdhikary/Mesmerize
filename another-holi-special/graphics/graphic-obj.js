class GraphicObj {

  constructor(img, x, y, z) {
    this.img = img;
    this.x = x; 
    this.y = y;
    this.z = z;
    this.toRemove = false;
  }

  animate() {}

  show() {
    image(this.img, this.x, this.y);
  }

}