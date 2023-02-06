class GameCamera {

  constructor() {
    this.x = 0;
  }

  follow(target) {
    this.target = target;
    this.update();
  }

  get dX() {
    return (this.target.x - this.x);
  }

  get currX() {
    return (this.target.x - GameCamera.OFFSET_X);
  }

  update() {
    this.x = this.target.x;
  }

}

GameCamera.OFFSET_X = 320;