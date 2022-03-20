class AquariumFish extends BasicVehicle {

  constructor(x, y) {
    super(x, y);
    this._size = 25;
    this._maxSpeed = 6;
    this._maxForce = 0.4;
    this.renderer = new FinnedRenderer(this._size);
    this.renderer._strokeColor = FISH_COLOR;
    this.renderer._fillColor = FISH_COLOR;
    this.mover = new MoverAdaptor(this);
  }

  show() {
    this.renderer.render(this.mover);
  }

}