class AquariumTurtle extends BasicVehicle {

  constructor(x, y) {
    super(x, y);
    this._size = 20;
    this._maxSpeed = 1.0;
    this._maxForce = 0.06;
    this.renderer = new LimbedRenderer(this._size*1.5);
    this.renderer._strokeColor = 135;
    this.renderer._bodyColor = TURTLE_COLOR;
    this.renderer._headColor = 135;
    this.renderer._limbColor = 135;
    this.mover = new MoverAdaptor(this);
  }

  show() {
    this.renderer.render(this.mover);
  }
  
}